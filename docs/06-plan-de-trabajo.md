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
  vía `DomainErrorFilter`.

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

## ETAPA 2 — Recurso: Configuración

- [ ] Tabla `tipos_hora_extra` (enum código HE_35/HE_100/NOCTURNA_15/FERIADO,
      porcentaje, activo) + seed.
- [ ] Tabla `configuracion` (clave-valor) + seed (divisor_salario,
      horas_jornada, horarios, tolerancia, redondeo...).
- [ ] Tabla `feriados` (fecha única, descripción).
- [ ] Endpoints: `GET/PATCH /configuracion`, `GET/PATCH /tipos-hora-extra/:id`,
      `GET/POST/DELETE /feriados`.
- [ ] Solo rol ADMIN puede modificar configuración.

## ETAPA 3 — Recurso: Periodos

- [ ] Tabla `periodos` (fecha_inicio/fecha_fin únicos, estado
      ABIERTO/CERRADO, cerrado_en, cerrado_por).
- [ ] Endpoints: `GET /periodos`, `GET /periodos/:id`, `POST /periodos`,
      `POST /periodos/:id/cerrar`.
- [ ] Regla transversal desde aquí: periodo cerrado es inmutable
      (`PeriodoCerradoError` → 409).

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
