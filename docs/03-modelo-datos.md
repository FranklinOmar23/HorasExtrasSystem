# Modelo de datos

Fuente de verdad: `backend/prisma/schema.prisma`. Este documento explica el
**por qué** de las decisiones que no son obvias leyendo el schema; para los
tipos exactos (nullability, tamaños de columna, etc.) siempre revisar el
schema directamente.

## Convenciones generales

- **Nombres**: modelos y campos en inglés/PascalCase-camelCase (convención de
  Prisma); `@@map`/columnas mapean a `snake_case` en español en la base real
  (ej. modelo `RegistroHoras` → tabla `registros_horas`).
- **Enums**: SQL Server no soporta enums nativos en Prisma. Los campos que
  conceptualmente son un enum (`Usuario.rol`, `Periodo.estado`,
  `RegistroHoras.origen`, `Auditoria.accion`/`entidad`, etc.) se modelan como
  `String` y se tipan con los enums de dominio (`backend/src/domain/enums/`)
  en la capa de aplicación — el schema no los valida, la app sí.
- **`onDelete: NoAction, onUpdate: NoAction`** en casi todas las relaciones:
  SQL Server rechaza múltiples rutas de cascada entre las mismas tablas
  (error de "cascade cycles"), y además tiene sentido de negocio — los
  registros de cálculo/importación/auditoría son historial y no deben
  borrarse en cascada nunca. La única excepción es `Calculo.registro`
  (`onDelete: Cascade`): si se borra un `RegistroHoras` (ej. al editarlo, que
  regenera sus cálculos), sí debe arrastrar sus propios `Calculo`.
- **Soft-delete solo en `Periodo`**: es el único modelo donde "eliminar" no
  borra la fila (ver más abajo). El resto de los borrados (feriados, turnos
  sin asignaciones, registros de horas) son físicos.
- **Prisma no expresa índices únicos filtrados** (`WHERE columna IS NOT
  NULL` / `WHERE condición`): donde la regla de negocio los necesita, existen
  como migraciones manuales aplicadas directamente en producción, documentadas
  como comentarios `///` junto al campo/modelo correspondiente en el schema.
  Si se regenera una migración desde el schema limpio, hay que volver a
  aplicarlos a mano.

## Tablas

### `usuarios` (modelo `Usuario`)
Cuentas de acceso al sistema. `rol` es `ADMIN` o `RRHH` (enum de dominio
`RolUsuario`). `passwordHash` es bcrypt; nunca sale de la API (`UsuarioRespuestaDto`
no lo incluye). `activo=false` desactiva el login sin borrar el historial de
auditoría/periodos cerrados/importaciones que referencian a ese usuario.

### `empleados` (modelo `Empleado`)
`codigo` (entero, único) es el identificador que usa RRHH y los reportes de
reloj biométrico para casar filas. `cedula` es única pero nullable —en
producción vía índice único **filtrado** (`WHERE cedula IS NOT NULL`),
porque SQL Server exige unicidad también entre `NULL`s bajo una constraint
normal, y muchos empleados no tienen cédula registrada.

### `salarios` (modelo `Salario`)
Historial de salario mensual por empleado, con vigencia
(`vigenteDesde`/`vigenteHasta`, `vigenteHasta = NULL` = vigente actual). El
cálculo siempre usa el salario vigente en la fecha del registro, nunca el
"actual" del empleado. En producción existe además un índice único filtrado
(`WHERE vigenteHasta IS NULL`) por empleado, para que dos altas de salario
casi simultáneas nunca dejen a un empleado con dos vigentes a la vez.

### `tipos_hora_extra` (modelo `TipoHoraExtra`)
Catálogo semilla (`HE_35`, `HE_100`, `NOCTURNA_15`, `FERIADO`) con su
`porcentaje` y `modoValorizacion` (`COMPLETA` | `SOLO_RECARGO`, ver
docs/02 §1). El motor congela `porcentajeAplicado` en cada `Calculo`, así que
editar el porcentaje aquí solo afecta cálculos futuros.

### `configuracion` (modelo `Configuracion`)
Clave-valor genérico (`clave` es la PK, `valor` siempre `String`, la app
parsea a `Decimal`/`number`/`"HH:mm"` según la clave). Incluye
`divisor_salario`, `horas_jornada` (global, para salario/hora — no la
ventana de ningún turno), `horas_almuerzo`, `entrada_semana`/`salida_semana`,
`entrada_sabado`/`salida_sabado` (ya no las lee el motor generalizado, quedan
como referencia/edición histórica), `inicio_nocturna`/`fin_nocturna`,
`tolerancia_minutos`, `redondeo` (declarado, aún no conectado a ninguna
lógica).

### `feriados` (modelo `Feriado`)
Un feriado por fecha (única). Borrado físico (no hay historial que proteger
más allá de los `Calculo` ya congelados, que no referencian a `Feriado`).

### `periodos` (modelo `Periodo`)
Rango quincenal (`fechaInicio`/`fechaFin`, único como par). `estado` es
`ABIERTO` | `CERRADO`. Dos pares de columnas de auditoría de estado:
`cerradoEn`/`cerradoPorId` y `eliminadoEn`/`eliminadoPorId`.

**Soft-delete**: eliminar un periodo abierto solo llena `eliminadoEn`/
`eliminadoPorId` — nunca borra la fila ni sus `registros_horas`/`calculos`/
`importaciones` (es historial de dinero). Los listados normales excluyen
`eliminadoEn IS NOT NULL`; hay un endpoint aparte para ver/restaurar
eliminados. Restaurable dentro de 30 días desde `eliminadoEn` (regla en
`RestaurarPeriodoUseCase`, no en la base — pasado el plazo la fila sigue
ahí, solo se bloquea la operación de restaurar).

### `registros_horas` (modelo `RegistroHoras`)
Una marcación de entrada/salida de un empleado en un periodo y fecha.
`horaEntrada`/`horaSalida` se guardan como `"HH:mm"` (`VarChar(5)`), no como
`TIME` nativo de SQL Server, para no lidiar con zonas horarias. `origen` es
`MANUAL` | `EXCEL`; si es `EXCEL`, `importacionId` referencia la importación
que lo generó. `comentario` libre, solo para `MANUAL`.

### `calculos` (modelo `Calculo`)
El desglose de horas extra de un `RegistroHoras`: una fila por cada tipo que
aplica (puede haber varias, ej. `HE_35` + `NOCTURNA_15` en el mismo
registro). Congela `porcentajeAplicado` y `salarioHoraUsado` en el momento
del cálculo — es el mecanismo que garantiza que cambiar la configuración o
el salario de un empleado **no** altera periodos ya calculados. Única
relación con `onDelete: Cascade` del schema (ver arriba).

### `importaciones` (modelo `Importacion`)
Una carga de archivo `.xlsx`, en dos pasos: se crea una fila al **parsear**
(sin tocar `registros_horas` todavía; `filasOk`/`filasAdvertencia`/
`filasError` resumen el resultado) y `confirmadaEn` se llena al
**confirmar**, cuando se generan los `registros_horas` (origen `EXCEL`).
`contenido` (`Bytes`) guarda el archivo original completo para poder
re-parsear y re-validar exactamente igual al confirmar, en vez de confiar en
una vista previa que pudo quedar desactualizada (ej. si otra importación se
confirmó entretanto y ahora hay duplicados).

### `auditorias` (modelo `Auditoria`)
Bitácora de solo lectura: quién (`usuarioId`), qué acción (`CREAR` |
`ACTUALIZAR` | `ELIMINAR` | `CERRAR` | `RESTAURAR` | `CONFIRMAR`), sobre qué
entidad (`PERIODO`, `EMPLEADO`, `SALARIO`, `CONFIGURACION`, `FERIADO`,
`TIPO_HORA_EXTRA`, `REGISTRO_HORAS`, `IMPORTACION`, `USUARIO`, `TURNO`,
`ASIGNACION_TURNO`), `entidadId` opcional (ej. `null` para un cambio de
configuración que no es sobre una fila puntual) y una `descripcion` legible
en español. Nunca se edita ni se borra una fila de esta tabla.

### `turnos` (modelo `Turno`)
Catálogo de horarios asignables (`DIURNO`, `SABADO`, `NOCTURNO` de semilla, y
cualquier otro que RRHH cree). `horaInicio`/`horaFin` en `"HH:mm"`;
`cruzaMedianoche` indica si `horaFin` es del día siguiente (ej. `NOCTURNO`
22:00–08:00). `horasJornada` y `descuentaAlmuerzo` son metadata usada por el
mecanismo de cálculo "sin asignación explícita" (docs/02 §2.3) — no
confundir `horasJornada` de un turno con la `horas_jornada` **global** de
`configuracion`, que es la que entra en la fórmula de salario/hora.
`DIURNO`/`SABADO` son los turnos por defecto del sistema (hardcodeados por
`codigo` en `ResolverTurnoDelEmpleadoUseCase`) y no se pueden eliminar; ningún
turno con asignaciones registradas se puede eliminar tampoco — solo
desactivar (`activo=false`).

### `asignaciones_turno` (modelo `AsignacionTurno`)
Asigna un `Turno` a un `Empleado` durante `[fechaDesde, fechaHasta]`
(`fechaHasta = NULL` = indefinida). `creadoPorId` referencia al usuario que
la creó (para auditoría/trazabilidad). No hay constraint de base de datos
que impida rangos solapados del mismo empleado — SQL Server no expresa
unicidad sobre rangos de fecha de forma nativa — se valida en
`CrearAsignacionTurnoUseCase`/`ActualizarAsignacionTurnoUseCase`
(`AsignacionSolapadaError`, 409).

## Relaciones (resumen)

```
Usuario ──< Periodo (cerradoPor, eliminadoPor)
Usuario ──< Importacion
Usuario ──< Auditoria
Usuario ──< AsignacionTurno (creadoPor)

Empleado ──< Salario
Empleado ──< RegistroHoras
Empleado ──< AsignacionTurno

Periodo ──< RegistroHoras
Periodo ──< Importacion

RegistroHoras ──< Calculo
RegistroHoras >── Importacion (opcional, si origen = EXCEL)

TipoHoraExtra ──< Calculo

Turno ──< AsignacionTurno
```
