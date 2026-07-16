# Sistema de Horas Extras — Hartemanía

Sistema web interno que reemplaza una plantilla de Excel para calcular y pagar
horas extras por quincena en una empresa dominicana (~50 empleados).
Moneda: RD$ (peso dominicano). Toda la UI en español.

## Documentación del proyecto (leer antes de implementar)

- `docs/01-vision-general.md` — qué hace el sistema, usuarios, flujo principal
- `docs/02-reglas-de-negocio.md` — ⭐ fórmulas de cálculo (fuente de verdad)
- `docs/03-modelo-datos.md` — esquema de base de datos
- `docs/04-arquitectura.md` — Clean Architecture: capas y estructura de carpetas
- `docs/05-api.md` — endpoints REST
- `docs/06-plan-de-trabajo.md` — fases y orden de construcción
- `docs/design/` — diseño de pantallas generado con Claude Design (referencia visual)

> Estos documentos todavía no existen en el repositorio. Mientras no estén,
> el backend usa como referencia el resumen de reglas de negocio de este
> archivo; el `schema.prisma` actual es un punto de partida inferido y debe
> revisarse contra `docs/02` y `docs/03` en cuanto existan.

## Stack

- **Backend**: NestJS + TypeScript, Prisma ORM, SQL Server
- **Frontend**: React + Vite + TypeScript, TanStack Query, react-dropzone
- **Excel**: SheetJS (xlsx) para leer los reportes subidos
- **Auth**: JWT con @nestjs/passport, roles: ADMIN y RRHH
- **API docs**: Swagger disponible en `/docs` cuando el backend está corriendo
- Monorepo simple: `backend/` y `frontend/` en la raíz

## Arquitectura del backend (obligatorio)

Clean Architecture pragmática. La regla de dependencia apunta hacia adentro:

```
presentation → application → domain
infrastructure implementa los puertos de application
```

- `domain/` es TypeScript puro: CERO imports de Nest, Prisma o librerías externas.
- `application/ports/` define interfaces; `infrastructure/` las implementa.
- El cableado (providers `{ provide: TOKEN, useClass: Impl }`) vive solo en
  los módulos de Nest dentro de `presentation/modules/`.
- Los DTOs con class-validator viven en `presentation/dtos/` y se convierten
  a tipos del dominio en el controller. Nunca filtrar decoradores hacia adentro.
- CRUDs simples (feriados, usuarios) pueden tener use cases delgados; el rigor
  completo se aplica al flujo importación → cálculo → cierre de periodo.

## Reglas críticas de negocio (resumen — detalle en docs/02)

- El motor de cálculo (`domain/services/motor-calculo.ts`) es una clase pura
  y sin estado: recibe registro + configuración + feriados, devuelve el desglose.
- Todo parámetro es configurable, NUNCA hardcodear: porcentajes (35, 100, 15),
  horarios de jornada, divisor de salario (23.83), horas por día (8),
  descuento de almuerzo, hora de inicio nocturna (21:00), tolerancia, redondeo.
- Cada cálculo persiste el `porcentaje_aplicado` y `salario_hora_usado`
  congelados: cambiar la configuración hoy NO altera periodos pasados.
- Un periodo CERRADO es inmutable. Cualquier intento de modificarlo debe
  lanzar `PeriodoCerradoError`.
- Los salarios tienen historial con vigencia: el cálculo usa el salario
  vigente en la fecha del registro, no el actual.

## Base de datos (SQL Server + Prisma)

- Prisma 7 no permite `url` dentro de `schema.prisma`: la cadena de conexión
  vive en `.env` (`DATABASE_URL`) y se referencia desde `prisma.config.ts`
  (usado por la CLI/Migrate).
- `PrismaClient` en runtime requiere un *driver adapter* (`@prisma/adapter-mssql`
  + `mssql`), instanciado en `src/infrastructure/prisma/prisma.service.ts` a
  partir de `DATABASE_URL` (ver `src/shared/config/sqlserver-connection.ts`).
- SQL Server no soporta enums nativos en Prisma: `Usuario.rol` y
  `PeriodoQuincenal.estado` se modelan como `String` y se tipan con los enums
  de dominio (`src/domain/enums/`) en la capa de aplicación.
- Varias relaciones tienen `onDelete: NoAction, onUpdate: NoAction` porque
  SQL Server rechaza múltiples rutas de cascada entre las mismas tablas; además
  tiene sentido de negocio: los registros de cálculo/importación son historial
  y no deben borrarse en cascada.

## Testing

- El motor de cálculo requiere tests unitarios exhaustivos (es dinero).
- Caso de aceptación maestro: con los datos del Excel de abril 2026
  (46 empleados, periodo 1–15 abril), el total a pagar debe dar
  **RD$ 99,540.60** (tolerancia de centavos por redondeo flotante).
- Los tests del dominio no deben requerir base de datos ni Nest.

## Convenciones

- Código en inglés (variables, clases, tablas), textos de UI y mensajes de
  error de negocio en español.
- Commits convencionales: feat/fix/refactor/test/docs.
- No usar `any`. Prisma genera los tipos de persistencia; el dominio tiene
  los suyos propios con mappers explícitos.
