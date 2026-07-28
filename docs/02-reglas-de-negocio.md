# Reglas de negocio — fuente de verdad

Este documento es la referencia autoritativa de cómo el sistema calcula y
paga horas extra. El motor de cálculo (`backend/src/domain/services/motor-calculo.ts`)
implementa exactamente lo descrito aquí; cualquier discrepancia entre el
código y este documento es un bug en uno de los dos.

Todo lo que aparece como "configurable" vive en la tabla `configuracion`
(editable desde Configuración → Reglas de cálculo / Jornada laboral) o en el
catálogo `turnos` (editable desde Configuración → Turnos) — **nunca** está
hardcodeado en el motor.

## 1. Conceptos base

- **Periodo quincenal**: rango de fechas (`fechaInicio`–`fechaFin`) sobre el
  que se agrupan los registros de horas y se paga. Puede estar `ABIERTO` o
  `CERRADO`. Un periodo **CERRADO es inmutable**: cualquier intento de crear,
  editar o borrar un registro de horas dentro de él, o de crear/editar/borrar
  una asignación de turno que lo afecte, lanza `PeriodoCerradoError` (409).
- **Registro de horas**: una entrada/salida de un empleado en una fecha, con
  origen `MANUAL` (digitado a mano) o `EXCEL` (importado). Cada registro
  genera cero o más `calculos` (una fila por cada tipo de hora extra que
  aplica).
- **Tipos de hora extra** (catálogo `tipos_hora_extra`): `HE_35` (35%),
  `HE_100` (100%), `NOCTURNA_15` (15%, recargo aditivo), `FERIADO` (100%).
  Cada uno tiene un `modoValorizacion`:
  - `COMPLETA`: la hora se paga completa **más** el recargo
    (multiplicador = 1 + porcentaje/100). Usan esto `HE_35` (×1.35) y
    `HE_100` (×2.00): son horas que el salario mensual no cubre en absoluto.
  - `SOLO_RECARGO`: solo se paga el recargo (multiplicador = porcentaje/100),
    porque es un adicional sobre horas que ya se pagaron por otro concepto
    (nocturno) o porque no debe duplicarse el 100% (feriado).
- **Salario/hora**: `(salario mensual ÷ divisor_salario) ÷ horas_jornada`.
  `divisor_salario` (23.83 por defecto) convierte el salario mensual a
  diario (estándar dominicano de días hábiles promedio por mes);
  `horas_jornada` es el parámetro **global** de configuración (no el de
  ningún turno específico — ver §3). Cada `calculo` congela el
  `salarioHoraUsado` y el `porcentajeAplicado` en el momento de calcularse:
  cambiar la configuración o el catálogo después **no** altera cálculos ya
  persistidos, ni siquiera si el periodo sigue abierto.
- **Salario vigente**: los salarios tienen historial con vigencia
  (`vigenteDesde`/`vigenteHasta`). El cálculo siempre usa el salario vigente
  en la **fecha del registro**, no el salario actual del empleado. Si no hay
  salario vigente para esa fecha, se lanza `SalarioNoVigenteError`.

## 2. Turnos de trabajo

Cuando hay mucho trabajo, RRHH puede asignar a 1-2 empleados a un turno
distinto al diurno normal (típicamente NOCTURNO) por un rango de fechas.
Esto es un **cambio de turno**, no una autorización de horas extra: las
horas dentro de la ventana de ese turno son jornada normal.

### 2.1 Catálogo de turnos (`turnos`)

Cada turno tiene: `codigo` (único), `nombre`, `horaInicio`/`horaFin`
("HH:mm"), `horasJornada`, `cruzaMedianoche` (si `horaFin` es del día
siguiente), `descuentaAlmuerzo`, `activo`.

Turnos seed (editables desde Configuración → Turnos):

| Código     | Horario       | Horas jornada | Cruza medianoche | Descuenta almuerzo |
|------------|---------------|---------------|-------------------|---------------------|
| `DIURNO`   | 08:30–17:30   | 8             | No                | Sí                  |
| `SABADO`   | 09:00–13:00   | 4             | No                | No                  |
| `NOCTURNO` | 22:00–08:00   | 8             | Sí                | Sí                  |

`DIURNO` y `SABADO` son los turnos por defecto del sistema (ver §2.2) y **no
se pueden eliminar** (`TurnoPorDefectoNoEliminableError`). Ningún turno con
asignaciones registradas se puede eliminar (`TurnoConAsignacionesError`); solo
desactivarlo (`activo=false`).

### 2.2 Asignación de turno (`asignaciones_turno`)

RRHH asigna un turno a un empleado en un rango `fechaDesde`–`fechaHasta`
(`fechaHasta` nulo = indefinida). Un empleado no puede tener dos asignaciones
con rangos solapados (`AsignacionSolapadaError`, 409) — dos rangos que solo
se tocan el mismo día (uno termina el 15, el otro empieza el 15) SÍ cuentan
como solapados; para no solaparse deben terminar/empezar en días distintos.

**Resolución del turno vigente** (`ResolverTurnoDelEmpleadoUseCase`): para un
empleado y una fecha dados,
1. Si hay una `AsignacionTurno` cuyo rango cubre la fecha → ese es el turno
   (`explicita = true`).
2. Si no hay ninguna → turno por defecto: `DIURNO`, o `SABADO` si la fecha
   cae en sábado (`explicita = false`).

### 2.3 Motor generalizado: dos mecanismos de exceso

El motor usa un mecanismo distinto según si el turno vino de una asignación
explícita o del fallback por defecto — esto es deliberado, no un accidente:
preserva exactamente el cálculo histórico para cualquier empleado que nunca
fue asignado a un turno (cero riesgo sobre nómina existente), y usa un
cálculo por posición de reloj, más preciso, solo cuando RRHH puso a alguien
deliberadamente en un horario distinto.

**Sin asignación explícita (DIURNO/SABADO por defecto)** — cálculo
histórico, por presupuesto total:
1. Feriado → todas las horas brutas trabajadas ese día son `FERIADO`.
2. Domingo (sin feriado) → todas las horas brutas son `HE_100`.
3. Sábado o día laboral: `minutosNetos = minutosBrutos − almuerzo` (el
   almuerzo del turno solo se descuenta si `descuentaAlmuerzo=true`);
   `presupuesto = horasJornada(turno) × 60 + tolerancia`;
   `exceso = max(0, minutosNetos − presupuesto)`. El exceso es `HE_100` en
   sábado, `HE_35` entre semana. El exceso **no depende de en qué momento
   del día se trabajó**, solo del total.

**Con asignación explícita** (ej. NOCTURNO puesto por RRHH) — por posición
de reloj:
1. El trabajo se parte por día calendario si cruza medianoche (el registro
   "pertenece" al día de la entrada; el día siguiente se evalúa aparte).
2. Para cada día calendario del registro:
   - Si ese día es feriado → todas sus horas son `FERIADO`, **aunque estén
     dentro de la ventana del turno asignado**.
   - Si ese día es domingo → todas sus horas son `HE_100`, **aunque estén
     dentro de la ventana**. El cambio de turno no exime del recargo de
     domingo/feriado; solo evita que sea extra únicamente por el horario.
   - Si no (laboral): la ventana `[horaInicio, horaFin]` del turno (ajustada
     +24h si `cruzaMedianoche`) define lo normal; el exceso antes del inicio
     o después del fin → `HE_35` (día de semana) o `HE_100` (sábado).
3. La tolerancia se resta del exceso total (antes + después) antes de
   clasificarlo.

En ambos mecanismos, horas negativas se truncan a 0.

### 2.4 Recargo nocturno (aditivo, independiente del mecanismo)

Toda hora trabajada dentro de la banda `[inicio_nocturna, fin_nocturna)`
(21:00–07:00 por defecto, cruza medianoche) genera `NOCTURNA_15` como fila
aparte, **sea jornada normal o extra** — se suma encima de lo que ya
corresponda por HE_35/HE_100/FERIADO/normal, nunca lo reemplaza. Se evalúan
tanto la banda "de esta noche" como la "de anoche" (para cubrir turnos que
entran de madrugada, ej. 03:00, dentro de la cola de la banda anterior).

### 2.5 Recalculo al cambiar una asignación de turno

Crear, editar o eliminar una `AsignacionTurno` puede dejar desactualizados
los `calculos` de registros ya persistidos dentro de su rango de fechas
(fueron calculados con el turno vigente en ese momento). Antes de persistir
el cambio, el sistema:
1. Verifica que ningún registro afectado esté en un periodo **CERRADO** — si
   lo está, rechaza la operación completa (409, `PeriodoCerradoError`) sin
   mutar nada.
2. Si todo está en periodos abiertos, persiste el cambio y recalcula los
   `calculos` de cada registro afectado con `CalcularDesgloseService`.

Al editar, el "rango afectado" es la unión del rango viejo y el nuevo (para
recalcular tanto lo que dejó de estar cubierto como lo que ahora queda
cubierto). Esto aplica también al **crear** una asignación retroactiva
(cubriendo fechas que ya tienen registros calculados con el turno anterior).

## 3. Importación de Excel

Dos formatos reconocidos automáticamente por columnas (mismo parser,
`XlsxParserAdapter`):

- **Simple**: una fila por día con columnas `fecha`/`codigo`/`nombre`/
  `entrada`/`salida` (o alias: `date`, `cod`/`code`, `empleado`/`name`,
  `horaentrada`/`in`, `horasalida`/`out`).
- **Time Card** (reporte de reloj biométrico): filas de metadata (empresa,
  título, fecha de exportación) antes del encabezado real
  (`Full Name`/`ID`/`Date`/`Clock-In Time`/`Clock-Out Time`); el parser
  escanea hasta 15 filas buscando el encabezado. `"--"` se trata como hora
  ausente, igual que una celda vacía. Un turno nocturno que cruza medianoche
  llega en **una sola fila** con `salida < entrada` (ej. `21:16`→`08:45`) —
  el motor ya lo interpreta bien vía `entradaSalidaAjustadas` (suma 24h),
  no requiere ningún "cosido" de filas partidas (el reloj real nunca las
  parte en 23:59/00:00).

La importación es en dos pasos: **parsear** (valida y muestra preview,
clasifica cada fila `OK`/`ADVERTENCIA`/`ERROR`, no persiste nada) y
**confirmar** (re-parsea y re-valida el archivo original guardado —no
confía en el preview, que pudo quedar desactualizado— y persiste las filas
válidas, y si se marcó, también las de advertencia).

## 4. Periodos: cierre y eliminación

- **Cerrar** un periodo (`CerrarPeriodoUseCase`) lo vuelve inmutable de
  forma permanente. No se puede cerrar un periodo ya cerrado ni uno
  eliminado.
- **Eliminar** un periodo abierto es un *soft-delete* (`eliminadoEn`/
  `eliminadoPorId`): nunca borra la fila ni sus registros/cálculos/
  importaciones asociados (es historial de dinero), solo lo oculta de los
  listados. Es restaurable dentro de un plazo de **30 días** desde
  `eliminadoEn`; pasado ese plazo, `RestaurarPeriodoUseCase` rechaza la
  restauración (409) pero los datos siguen intactos en la base — no hay
  borrado físico automático. Solo ADMIN puede eliminar/restaurar periodos.

## 5. Auditoría

Toda mutación relevante (crear/actualizar/eliminar/cerrar/restaurar/
confirmar en periodos, empleados, salarios, configuración, feriados, tipos
de hora extra, registros de horas, importaciones, usuarios, turnos y
asignaciones de turno) queda registrada en `auditorias`: quién, qué acción,
sobre qué entidad, y una descripción legible. Es de solo lectura desde la
UI — nunca se edita ni se borra una fila de auditoría.
