BEGIN TRY

BEGIN TRAN;

-- SQL Server trata NULL como un valor que debe ser único bajo un UNIQUE
-- CONSTRAINT normal (a diferencia de Postgres/MySQL, que permiten múltiples
-- NULL). Como `cedula` es opcional y muchos empleados reales todavía no la
-- tienen registrada, la constraint original bloqueaba desde el segundo
-- empleado sin cédula. Se reemplaza por un índice único FILTRADO que solo
-- exige unicidad cuando `cedula` no es NULL.
ALTER TABLE [dbo].[empleados] DROP CONSTRAINT [empleados_cedula_key];

CREATE UNIQUE NONCLUSTERED INDEX [empleados_cedula_key]
  ON [dbo].[empleados]([cedula])
  WHERE [cedula] IS NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
