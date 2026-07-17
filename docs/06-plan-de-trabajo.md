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

## ETAPA 4 — Recurso: Registros de horas

- [ ] Tabla `registros_horas` (periodo, empleado, fecha, entrada/salida,
      origen EXCEL/MANUAL, comentario).
- [ ] Tabla `calculos` (desglose por tipo de hora, porcentaje y salario/hora
      congelados).
- [ ] Motor de cálculo en `domain/services/motor-calculo.ts` según
      `docs/02-reglas-de-negocio.md` (pendiente de crear/confirmar reglas
      exactas antes de implementar el motor).
- [ ] Endpoints: `GET /periodos/:id/registros`, `POST/PATCH/DELETE /registros`,
      `POST /registros/preview`.

## ETAPA 5 — Recurso: Importaciones

- [ ] Tabla `importaciones` (periodo, usuario, archivo, resumen de filas).
- [ ] Flujo en dos pasos: `POST /periodos/:id/importaciones` (parseo/validación
      sin persistir) → `POST /importaciones/:id/confirmar` (persiste y calcula).
- [ ] `GET /periodos/:id/importaciones` (historial).

## ETAPA 6 — Recurso: Reportes + Usuarios

- [ ] Endpoints de `usuarios` (solo ADMIN): `GET/POST/PATCH`.
- [ ] Reportes de solo lectura sobre `calculos`: reporte de periodo,
      detalle por empleado, export a Excel, histórico.

---

**Nota**: `docs/02-reglas-de-negocio.md` (fórmulas exactas del motor de
cálculo) y `docs/03-modelo-datos.md` no existen todavía en el repositorio.
Las etapas 1-3 no dependen de ellos. La ETAPA 4 sí los necesita como fuente
de verdad antes de implementar el motor de cálculo — confirmar con el
usuario antes de inferir las fórmulas.
