BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[historial_salarios] DROP CONSTRAINT [historial_salarios_empleadoId_fkey];

-- DropIndex
ALTER TABLE [dbo].[empleados] DROP CONSTRAINT [empleados_codigo_key];

-- AlterTable
ALTER TABLE [dbo].[empleados] ALTER COLUMN [codigo] INT NOT NULL;
ALTER TABLE [dbo].[empleados] DROP COLUMN [cargo];
ALTER TABLE [dbo].[empleados] ADD [cedula] NVARCHAR(1000),
[posicion] NVARCHAR(1000) NOT NULL;

-- DropTable
DROP TABLE [dbo].[historial_salarios];

-- CreateTable
CREATE TABLE [dbo].[salarios] (
    [id] NVARCHAR(1000) NOT NULL,
    [empleadoId] NVARCHAR(1000) NOT NULL,
    [montoMensual] DECIMAL(12,2) NOT NULL,
    [vigenteDesde] DATE NOT NULL,
    [vigenteHasta] DATE,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [salarios_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [salarios_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[empleados] ADD CONSTRAINT [empleados_codigo_key] UNIQUE NONCLUSTERED ([codigo]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [salarios_empleadoId_vigenteDesde_idx] ON [dbo].[salarios]([empleadoId], [vigenteDesde]);

-- CreateIndex
ALTER TABLE [dbo].[empleados] ADD CONSTRAINT [empleados_cedula_key] UNIQUE NONCLUSTERED ([cedula]);

-- AddForeignKey
ALTER TABLE [dbo].[salarios] ADD CONSTRAINT [salarios_empleadoId_fkey] FOREIGN KEY ([empleadoId]) REFERENCES [dbo].[empleados]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

