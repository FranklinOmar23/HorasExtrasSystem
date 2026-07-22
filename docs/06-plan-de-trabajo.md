# Plan de trabajo — Backend

Trabajo organizado por recursos y por etapas. Cada etapa se entrega completa
(migración de Prisma aplicada, build/lint/tests en verde, endpoints probados
contra la base de datos real) antes de pasar a la siguiente.

Convenciones transversales a todas las etapas:
- Rutas y tags de Swagger en español; código interno en inglés.
- Todos los endpoints requieren JWT excepto `/health` y `POST /auth/login`
  (guard global `JwtAuthGuard` + decorador `@Public()`).
- Dinero y horas siempre `Decimal` (columna `@db.Decimal` en Prisma,
  `decimal.js` en el dominio, `string` en las respuestas JSON).
- Errores de negocio: `{ statusCode, error: "CODIGO_ESTABLE", message }`
  vía `DomainErrorFilter`. Cada `DomainError` declara su propio `httpStatus`
  (no hay mapa manual que mantener — evita olvidar registrar un código nuevo).

## ETAPA 1 — Recurso: Empleados ✅ completada

- [x] Tabla `empleados` (codigo int único, cedula único nullable, posicion,
      activo) y `salarios` (historial con vigencia).
- [x] Migración `20260716234355_empleados_salarios` aplicada.
- [x] Dominio: entidades `Empleado`/`Salario`, errores
      (`EmpleadoCodigoDuplicadoError`, `EmpleadoCedulaDuplicadaError`,
      `EmpleadoNoEncontradoError`), utilidad pura `diaAnterior`.
- [x] Casos de uso: listar (con búsqueda por código/nombre y filtro activo),
      obtener, crear (con salario inicial anidado), actualizar, listar
      salarios, crear salario (cierra automáticamente el vigente anterior).
- [x] Endpoints: `GET/POST /empleados`, `GET/PATCH /empleados/:id`,
      `GET/POST /empleados/:id/salarios`.
- [x] Guard JWT + roles global (`APP_GUARD`) con `@Public()` en
      `/health` y `/auth/login`.
- [x] Tests unitarios: `CrearEmpleadoUseCase`, `CrearSalarioUseCase`.
- [x] Probado end-to-end contra SQL Server real (login, CRUD, 401/404/409).

## ETAPA 2 — Recurso: Configuración ✅ completada

- [x] Tabla `tipos_hora_extra` (codigo único HE_35/HE_100/NOCTURNA_15/FERIADO,
      nombre, porcentaje, activo) + seed con los 4 tipos.
- [x] Tabla `configuracion` (clave-valor) + seed de los 10 parámetros
      (divisor_salario, horas_jornada, horarios, tolerancia, redondeo...).
- [x] Tabla `feriados` (fecha única, descripción) — redefinida (antes tenía
      `nombre`, ahora `descripcion`).
- [x] Migración `20260717000542_configuracion` aplicada.
- [x] Dominio: entidades `TipoHoraExtra`/`Feriado`, enum `TipoHoraExtraCodigo`,
      errores `TipoHoraExtraNoEncontradoError`, `FeriadoFechaDuplicadaError`,
      `FeriadoNoEncontradoError`.
- [x] Endpoints: `GET/PATCH /configuracion` (recibe `{clave: valor, ...}`),
      `GET/PATCH /tipos-hora-extra/:id`, `GET/POST/DELETE /feriados`
      (`?anio=` en el listado). 3 tags de Swagger separados
      (`configuracion`, `tipos-hora-extra`, `feriados`) en un mismo
      `ConfiguracionModule`.
- [x] Solo rol ADMIN puede modificar (`@Roles(ADMIN)` en los PATCH/POST/DELETE);
      GET abierto a ADMIN y RRHH.
- [x] Tests unitarios: `CrearFeriadoUseCase` (fecha duplicada),
      `ActualizarTipoHoraExtraUseCase` (no encontrado).
- [x] Probado end-to-end contra SQL Server real, incluyendo 403 con un
      usuario RRHH intentando mutar configuración/feriados.
- [x] Refactor transversal: `DomainError` ahora declara `httpStatus` en
      cada subclase (se detectó que el mapa manual del filtro se había
      quedado desactualizado con los nuevos códigos de esta etapa).

## ETAPA 3 — Recurso: Periodos ✅ completada

- [x] Tabla `periodos` (fechaInicio/fechaFin únicos compuestos, estado
      ABIERTO/CERRADO, cerradoEn, cerradoPorId → usuarios).
- [x] Migración `20260717001812_periodos` — de paso, eliminó las tablas
      placeholder `periodos_quincenales`, `registros_horas`,
      `calculos_horas_extra`, `importaciones_excel` (nunca llegaron a tener
      dominio/aplicación/presentación; las etapas 4-5 las recrean con la
      forma exacta ya especificada).
- [x] Dominio: entidad `Periodo` (`estaCerrado()`), enum `EstadoPeriodo`,
      errores `PeriodoNoEncontradoError`, `PeriodoFechasDuplicadasError`,
      `PeriodoRangoFechasInvalidoError` (fechaFin < fechaInicio → 400),
      y reutiliza `PeriodoCerradoError` (ya existía desde la etapa 1) para
      "cerrar un periodo ya cerrado" → 409.
- [x] Endpoints: `GET/POST /periodos`, `GET /periodos/:id`,
      `POST /periodos/:id/cerrar` (usa `@UsuarioActual()` para registrar
      `cerradoPorId`). Abiertos a cualquier usuario autenticado (ADMIN/RRHH);
      el spec no pidió restringir el cierre a un rol específico.
- [x] Tests unitarios: `CerrarPeriodoUseCase` (cierra, 404, 409).
- [x] Probado end-to-end contra SQL Server real: crear, rango inválido (400),
      fechas duplicadas (409), listar, obtener, 404, cerrar, doble cierre
      (409 `PERIODO_CERRADO`), 401 sin token.

## ETAPA 4 — Recurso: Registros de horas ✅ completada

`docs/02-reglas-de-negocio.md` seguía sin existir, así que las reglas exactas
del motor se confirmaron directamente con el usuario (no se infirieron):

- **HE_35** (lunes-viernes): exceso sobre `horas_jornada` (tras descontar
  `horas_almuerzo`). Pago completo: `salario_hora × horas × 1.35`.
- **HE_100**: todas las horas de domingo, y el exceso de sábado más allá de
  `salida_sabado`. Pago completo: `× 2.00`.
- **FERIADO**: todas las horas trabajadas en un día de la tabla `feriados`
  (no se clasifica como HE_100). Solo el adicional: `× 1.00` (no `× 2.00`).
- **NOCTURNA_15**: horas desde `inicio_nocturna` en adelante, **se suma**
  como fila aparte sobre lo que ya se clasificó arriba, pagando *solo* el
  recargo (`× 0.15`) para no duplicar la base.
- El multiplicador por tipo (no una fórmula genérica) vive en
  `tipos_hora_extra.modoValorizacion` (`COMPLETA` = `1 + %`, `SOLO_RECARGO` =
  solo `%`) — configurable, no hardcodeado en el motor
  (`TipoHoraExtra.multiplicador()`).
- **`salario_hora` = `(salario_mensual ÷ divisor_salario) ÷ horas_jornada`**
  (dos divisiones: `divisor_salario`, 23.83, convierte mensual → **diario**,
  el estándar dominicano de días hábiles promedio por mes; luego se divide
  entre las horas de la jornada para llegar al valor por hora). **Bug
  corregido el 2026-07-17**: `CalcularDesgloseService` y el fallback de
  `ReportePeriodoService` se quedaban en la primera división (calculaban el
  salario *diario* y lo usaban como si fuera el salario *por hora*, ~8×
  demasiado alto). Se detectó al cargar la nómina real de Hartemanía y
  cruzar sus columnas de salario diario/por hora contra la fórmula — no
  afectó datos reales porque los únicos `calculos` persistidos hasta ese
  momento eran de pruebas (empleado de QA, periodo nunca cerrado).
- [x] Tabla `registros_horas` (periodo, empleado, fecha, horaEntrada/horaSalida
      como "HH:mm", origen EXCEL/MANUAL, importacionId nullable sin FK aún,
      comentario). Tabla `calculos` (registroId onDelete Cascade, tipoHoraId,
      cantidadHoras/porcentajeAplicado/salarioHoraUsado/monto congelados).
- [x] Migración `20260717011633_registros_calculos` (+ `modoValorizacion` en
      `tipos_hora_extra`, con default temporal para no romper las filas ya
      sembradas; el seed corrige NOCTURNA_15/FERIADO a `SOLO_RECARGO`).
- [x] Dominio: `MotorCalculo` (puro, sin DB) en `domain/services/motor-calculo.ts`,
      utilidades de horas en `hora.util.ts`, entidades `RegistroHoras`/`Calculo`,
      error `SalarioNoVigenteError` (422).
- [x] Aplicación: `CalcularDesgloseService` orquesta salario vigente +
      feriado + configuración + tipos activos y ejecuta el motor; reutilizado
      por crear/actualizar/preview para no triplicar la orquestación.
- [x] Endpoints: `GET /periodos/:id/registros?empleadoId=`,
      `POST/PATCH/DELETE /registros`, `POST /registros/preview`.
      `PATCH` siempre recalcula por completo (reemplaza los `calculos`).
- [x] Tests unitarios: 9 casos del motor de cálculo (día normal sin exceso,
      HE_35, sábado sin exceso, HE_100 sábado, HE_100 domingo, FERIADO,
      HE_35+NOCTURNA_15 combinados, cruce de medianoche, entrada=salida).
      Un test atrapó un bug real: entrada=salida se interpretaba como turno
      de 24h en vez de 0h (corregido en `hora.util.ts`).
- [x] Probado end-to-end contra SQL Server real: preview, crear con
      HE_35+NOCTURNA_15, recalculo al editar, cascada de calculos al
      eliminar, 409 en periodo cerrado, 404 (periodo/empleado/registro),
      422 sin salario vigente en la fecha.

## ETAPA 5 — Recurso: Importaciones ✅ completada

- [x] Tabla `importaciones` (periodo, usuario, archivo, `contenido` binario
      del .xlsx original, resumen filas_ok/advertencia/error, `confirmadaEn`
      nullable). `registros_horas.importacionId` pasó de FK lógica (comentario)
      a FK real ahora que la tabla existe.
- [x] Migración `20260717014159_importaciones`.
- [x] Dependencia `xlsx` (SheetJS) instalada desde el CDN oficial de SheetJS
      (`cdn.sheetjs.com`), no desde npm: la versión publicada en el registro
      de npm (0.18.5) tiene dos vulnerabilidades altas sin parchear
      (prototype pollution y ReDoS) que SheetJS solo corrigió en releases
      posteriores distribuidos por su propio CDN.
- [x] Dominio: entidad `Importacion`, enum `EstadoFilaImportacion`
      (OK/ADVERTENCIA/ERROR), errores `ImportacionNoEncontradaError` (404),
      `ImportacionYaConfirmadaError` (409), `ImportacionFormatoInvalidoError` (422).
- [x] Infraestructura: `XlsxParserAdapter` (puerto `ExcelParserPort`) —
      reconoce encabezados sin importar tildes/espacios/guiones (`"Hora
      Entrada"`, `hora_entrada`, `HoraEntrada`... todos normalizan igual),
      interpreta fechas y horas venga como texto o número serial de Excel,
      e ignora filas totalmente vacías (padding al final de la hoja).
- [x] **Bug corregido el 2026-07-17** (reportado por el usuario con un Excel
      real): las horas importadas salían corridas ~4h32min. Causa: se leía
      el archivo con `cellDates: true`, que hace que SheetJS convierta las
      celdas de fecha/hora a objetos `Date`; esa conversión quedó afectada
      por la zona horaria del sistema para el "día 0" ficticio de Excel
      (1899-12-30). Se corrigió leyendo **sin** `cellDates` y parseando
      siempre desde el número de serie crudo con aritmética pura (sin
      `Date` de por medio, inmune a cualquier zona horaria) — se eliminaron
      las ramas que aceptaban un `Date` directamente porque ya no son
      alcanzables. Se agregó un test que fija horas no-redondas (09:01,
      21:44) para que cualquier desfase, por pequeño que sea, falle.
- [x] Aplicación: `ValidarFilasImportacionService` clasifica cada fila:
      - **ERROR** (nunca se persiste): código inexistente, empleado inactivo,
        sin salario vigente en la fecha (extensión sobre el spec original:
        evita que `confirmar` reviente a medio lote con `SalarioNoVigenteError`),
        horas de entrada/salida vacías ("fila ignorada").
      - **ADVERTENCIA** (se persiste solo si `incluirAdvertencias=true`):
        fecha fuera del rango del periodo, fila duplicada (dentro del mismo
        archivo o contra un `registro_horas` ya existente), cruce de
        medianoche con duración > 12h (umbral fijo, pensado para detectar
        probables errores de captura tipo AM/PM invertido).
      - **OK**: se persiste siempre.
- [x] `ParsearImportacionUseCase`: valida que el periodo exista y esté
      abierto, parsea+valida, y crea la fila `importaciones` (guarda el
      archivo original en `contenido` para poder re-parsear al confirmar).
- [x] `ConfirmarImportacionUseCase`: re-parsea y re-valida el archivo
      original (no confía en la vista previa, que pudo quedar desactualizada
      si otra importación se confirmó mientras tanto), calcula el desglose
      de **todas** las filas a persistir antes de escribir ninguna (si el
      salario de un empleado dejó de estar vigente entre el parseo y la
      confirmación, la importación completa falla en vez de aplicarse a
      medias), y solo entonces crea los `registros_horas` (origen EXCEL).
- [x] Endpoints: `POST /periodos/:id/importaciones` (multipart, campo
      `archivo`, límite 10MB), `POST /importaciones/:id/confirmar`
      (`{ incluirAdvertencias }`), `GET /periodos/:id/importaciones`.
- [x] Tests unitarios: `XlsxParserAdapter` (8 casos: fechas/horas en texto,
      serial de Excel, `DD/MM/YYYY`, filas vacías ignoradas, numeración de
      línea, valores no interpretables, archivo sin columnas reconocibles,
      archivo no-xlsx), `ValidarFilasImportacionService` (10 casos, una por
      regla de clasificación), `ConfirmarImportacionUseCase` (7 casos:
      persiste solo OK, persiste OK+ADVERTENCIA, nunca persiste ERROR,
      marca confirmada, y los 404/409/409 de importación inexistente/ya
      confirmada/periodo cerrado).
- [x] Probado end-to-end contra SQL Server real con un .xlsx generado
      cubriendo las 9 combinaciones (fila OK con HE_35, duplicado en
      archivo, código inexistente, empleado inactivo, sin salario vigente,
      fecha fuera del periodo, horas vacías, nocturna razonable, cruce de
      medianoche inusual): la clasificación devuelta coincidió exactamente
      con lo esperado, y tras confirmar con `incluirAdvertencias: true` se
      crearon los 5 registros esperados (2 OK + 3 ADVERTENCIA) con montos
      verificados a mano contra la configuración real (`divisor_salario`
      vigente en la BD: 24.00). Se probaron también: reconfirmar (409
      `IMPORTACION_YA_CONFIRMADA`), confirmar inexistente (404), subir a un
      periodo cerrado (409 `PERIODO_CERRADO`), subir sin archivo o un
      archivo no-xlsx (422 `IMPORTACION_FORMATO_INVALIDO`), sin token (401).

## ETAPA 6 — Recurso: Reportes + Usuarios ✅ completada

No requirió migración: la tabla `usuarios` ya existía (etapa 1, para auth) y
los reportes son de solo lectura sobre `registros_horas`/`calculos`.

**Usuarios** (todo bajo `@Roles(ADMIN)` a nivel de controller):
- [x] `UsuarioRepository` extendido con `listar/crear/actualizar` (antes solo
      tenía los métodos que necesitaba el login).
- [x] Errores `UsuarioEmailDuplicadoError` (409), `UsuarioNoEncontradoError` (404).
- [x] `CrearUsuarioUseCase`/`ActualizarUsuarioUseCase` hashean la contraseña
      vía el mismo `PasswordHasher` (bcrypt) que usa el login; `Actualizar`
      solo re-hashea si se envía una `password` nueva.
- [x] `UsuarioRespuestaDto` nunca incluye `passwordHash` — es la única forma
      en que un usuario sale de la API.
- [x] Endpoints: `GET/POST /usuarios`, `PATCH /usuarios/:id`.

**Reportes** (solo lectura, agregan `calculos` ya congelados — no recalculan):
- [x] `ReportePeriodoService`: agrupa los `registros_horas` de un periodo por
      empleado y suma horas/montos por tipo (`he35/he100/nocturna/feriado`).
      Si un empleado no tiene ningún `calculo` en el periodo (días normales
      sin exceso), resuelve `salarioHora` en vivo vía `SalarioRepository` +
      `divisor_salario` en vez de dejarlo en blanco.
- [x] Endpoints: `GET /periodos/:id/reporte` (por empleado + granTotal),
      `GET /periodos/:id/reporte/empleados/:empleadoId` (día por día, un
      `StreamableFile` para `GET /periodos/:id/reporte/excel` con SheetJS),
      `GET /reportes/historico?meses=` (default 6; granTotal por periodo).
- [x] Tests unitarios: `CrearUsuarioUseCase` (2), `ActualizarUsuarioUseCase` (3),
      `ReportePeriodoService` (4: suma por tipo, orden y gran total entre
      empleados, fallback de salario/hora sin calculos, fila en ceros para
      un empleado sin registros ese periodo).
- [x] Probado end-to-end contra SQL Server real: crear usuario RRHH, 409 con
      email duplicado, un RRHH real recibe 403 al listar `/usuarios`, PATCH
      desactiva un usuario, 404 sobre usuario inexistente; reporte de periodo
      y reporte por empleado con montos verificados a mano (coinciden con los
      registros creados en la prueba de ETAPA 5), descarga del .xlsx
      verificada abriéndolo con SheetJS, histórico con `meses` por defecto y
      personalizado, 404 de periodo/empleado inexistente, 401 sin token.

---

**Nota**: `docs/02-reglas-de-negocio.md` (fórmulas exactas del motor de
cálculo) y `docs/03-modelo-datos.md` no existen todavía en el repositorio.
Las etapas 1-3 no dependen de ellos. La ETAPA 4 sí los necesita como fuente
de verdad antes de implementar el motor de cálculo — confirmar con el
usuario antes de inferir las fórmulas.
