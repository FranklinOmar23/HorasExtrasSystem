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

> `docs/02` y `docs/03` ya existen y son la fuente de verdad vigente (reglas
> de cálculo, incluyendo turnos de trabajo, y esquema de datos completo).
> `docs/01`, `docs/04`, `docs/05` y `docs/design/` todavía no existen — mientras
> no estén, el resumen de este archivo y el propio código siguen siendo la
> referencia para arquitectura, API y visión general.

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
  (usado por la CLI/Migrate). Ver `backend/.env.example` para las dos
  variantes documentadas (copiar a `.env` y ajustar):
  - **Desarrollo local sin Docker (caso por defecto)**: `DATABASE_URL` apunta
    a `localhost`, con un usuario SQL dedicado (no `sa`).
  - **Docker**: `DATABASE_URL` apunta al nombre del servicio (ej. `sqlserver`)
    en vez de `localhost`.
- Toda la persistencia pasa por Prisma — no hay queries directos a la
  librería `mssql`. `PrismaClient` en runtime requiere un *driver adapter*
  (`@prisma/adapter-mssql`), instanciado en
  `src/infrastructure/prisma/prisma.service.ts` a partir de `DATABASE_URL`
  (ver `src/shared/config/sqlserver-connection.ts`). `mssql` solo aparece en
  el backend como `devDependency`, para tipar ese objeto de conexión — en
  runtime lo trae transitivamente `@prisma/adapter-mssql`, que sí lo usa
  internamente para hablar con SQL Server.
- SQL Server no soporta enums nativos en Prisma: `Usuario.rol` y
  `PeriodoQuincenal.estado` se modelan como `String` y se tipan con los enums
  de dominio (`src/domain/enums/`) en la capa de aplicación.
- Varias relaciones tienen `onDelete: NoAction, onUpdate: NoAction` porque
  SQL Server rechaza múltiples rutas de cascada entre las mismas tablas; además
  tiene sentido de negocio: los registros de cálculo/importación son historial
  y no deben borrarse en cascada.
- Las consultas de lectura pesadas/frecuentes pueden resolverse con **vistas
  SQL** (`view` en `schema.prisma`, requiere `previewFeatures = ["views"]`)
  en vez de `include` de Prisma — ver `vw_auditoria` en docs/03. Prisma no
  crea ni gestiona el DDL de una vista vía `db push`/`migrate`: el
  `CREATE VIEW` vive a mano en su carpeta de migración y hay que aplicarlo
  manualmente en cada entorno; el bloque `view` en el schema solo la mapea
  para consultarla (siempre de solo lectura, y su campo "id" debe declararse
  `@unique`, no `@id`, porque Prisma prohíbe PKs en vistas).
- Listas que pueden crecer sin límite (ej. auditoría) usan paginación real
  de servidor (`skip`/`take` + `count` en el repositorio, `pagina`/`porPagina`
  en la API) en vez de devolver el arreglo completo. No todas las listas lo
  necesitan — solo las que no tienen un tope natural bajo (decenas de filas).

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
