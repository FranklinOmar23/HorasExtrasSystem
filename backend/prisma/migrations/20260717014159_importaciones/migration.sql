BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[importaciones] (
    [id] NVARCHAR(1000) NOT NULL,
    [periodoId] NVARCHAR(1000) NOT NULL,
    [usuarioId] NVARCHAR(1000) NOT NULL,
    [archivo] NVARCHAR(1000) NOT NULL,
    [contenido] VARBINARY(max) NOT NULL,
    [filasOk] INT NOT NULL,
    [filasAdvertencia] INT NOT NULL,
    [filasError] INT NOT NULL,
    [importadoEn] DATETIME2 NOT NULL CONSTRAINT [importaciones_importadoEn_df] DEFAULT CURRENT_TIMESTAMP,
    [confirmadaEn] DATETIME2,
    CONSTRAINT [importaciones_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [importaciones_periodoId_idx] ON [dbo].[importaciones]([periodoId]);

-- AddForeignKey
ALTER TABLE [dbo].[registros_horas] ADD CONSTRAINT [registros_horas_importacionId_fkey] FOREIGN KEY ([importacionId]) REFERENCES [dbo].[importaciones]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[importaciones] ADD CONSTRAINT [importaciones_periodoId_fkey] FOREIGN KEY ([periodoId]) REFERENCES [dbo].[periodos]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[importaciones] ADD CONSTRAINT [importaciones_usuarioId_fkey] FOREIGN KEY ([usuarioId]) REFERENCES [dbo].[usuarios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
