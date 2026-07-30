-- Vista de solo lectura: pre-une empleados con su salario VIGENTE (vigenteHasta
-- IS NULL). Antes, la pantalla de Empleados hacía una petición GET
-- /empleados/:id/salarios POR CADA fila para pintar la columna "Salario
-- mensual" (N+1 a nivel de HTTP, ~150 requests para listar la plantilla).
-- Esta vista resuelve el salario vigente en la base, una sola vez por
-- consulta. Prisma no puede crear/alterar vistas vía `db push`/`migrate` —
-- esta migración es la única fuente de verdad de su DDL; el bloque
-- `view VwEmpleado` en schema.prisma solo la mapea para poder consultarla.
CREATE VIEW [dbo].[vw_empleados] AS
SELECT
    e.[id],
    e.[codigo],
    e.[nombre],
    e.[cedula],
    e.[posicion],
    e.[activo],
    s.[montoMensual] AS [montoMensualVigente],
    s.[vigenteDesde]  AS [salarioVigenteDesde]
FROM [dbo].[empleados] e
LEFT JOIN [dbo].[salarios] s
    ON s.[empleadoId] = e.[id] AND s.[vigenteHasta] IS NULL;
