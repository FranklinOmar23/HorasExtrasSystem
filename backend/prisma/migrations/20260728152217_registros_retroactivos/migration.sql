BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[importaciones] ADD [filasRetroactivas] INT NOT NULL CONSTRAINT [importaciones_filasRetroactivas_df] DEFAULT 0;

-- AlterTable
ALTER TABLE [dbo].[registros_horas] ADD [esRetroactivo] BIT NOT NULL CONSTRAINT [registros_horas_esRetroactivo_df] DEFAULT 0;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
