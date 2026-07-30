-- Vista de solo lectura: pre-une auditorias con el nombre del usuario, para
-- que la pantalla de Auditoría (y cualquier otro consumidor) no tenga que
-- resolverlo en cada consulta de la aplicación. Prisma no puede crear/alterar
-- vistas vía `db push`/`migrate` — esta migración es la única fuente de
-- verdad de su DDL; el bloque `view VwAuditoria` en schema.prisma solo la
-- mapea para poder consultarla.
CREATE VIEW [dbo].[vw_auditoria] AS
SELECT
    a.[id],
    a.[usuarioId],
    u.[nombre] AS [usuarioNombre],
    a.[accion],
    a.[entidad],
    a.[entidadId],
    a.[descripcion],
    a.[creadoEn]
FROM [dbo].[auditorias] a
INNER JOIN [dbo].[usuarios] u ON u.[id] = a.[usuarioId];
