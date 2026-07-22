BEGIN TRY

BEGIN TRAN;

-- Se detectaron 2 empleados con más de un salario "vigente" (vigenteHasta
-- IS NULL) a la vez — un estado inconsistente que no debería ser posible
-- (probablemente una condición de carrera entre dos POST /empleados/:id/salarios
-- casi simultáneos: ambos leyeron "no hay nada que cerrar" antes de que
-- cualquiera terminara de escribir). Se agrega un índice único FILTRADO
-- (mismo patrón que `empleados_cedula_key`) para que la base de datos lo
-- impida estructuralmente: como máximo un salario sin `vigenteHasta` por
-- empleado. Una segunda inserción concurrente ahora falla con un error de
-- constraint en vez de corromper el historial silenciosamente.
CREATE UNIQUE NONCLUSTERED INDEX [salarios_empleadoId_vigente_key]
  ON [dbo].[salarios]([empleadoId])
  WHERE [vigenteHasta] IS NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
