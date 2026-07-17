BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[calculos_horas_extra] DROP CONSTRAINT [calculos_horas_extra_empleadoId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[calculos_horas_extra] DROP CONSTRAINT [calculos_horas_extra_periodoId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[calculos_horas_extra] DROP CONSTRAINT [calculos_horas_extra_registroHorasId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[importaciones_excel] DROP CONSTRAINT [importaciones_excel_importadoPorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[importaciones_excel] DROP CONSTRAINT [importaciones_excel_periodoId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[periodos_quincenales] DROP CONSTRAINT [periodos_quincenales_cerradoPorId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[registros_horas] DROP CONSTRAINT [registros_horas_empleadoId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[registros_horas] DROP CONSTRAINT [registros_horas_importacionId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[registros_horas] DROP CONSTRAINT [registros_horas_periodoId_fkey];

-- DropTable
DROP TABLE [dbo].[calculos_horas_extra];

-- DropTable
DROP TABLE [dbo].[importaciones_excel];

-- DropTable
DROP TABLE [dbo].[periodos_quincenales];

-- DropTable
DROP TABLE [dbo].[registros_horas];

-- CreateTable
CREATE TABLE [dbo].[periodos] (
    [id] NVARCHAR(1000) NOT NULL,
    [fechaInicio] DATE NOT NULL,
    [fechaFin] DATE NOT NULL,
    [estado] VARCHAR(10) NOT NULL CONSTRAINT [periodos_estado_df] DEFAULT 'ABIERTO',
    [cerradoEn] DATETIME2,
    [cerradoPorId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [periodos_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [periodos_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [periodos_fechaInicio_fechaFin_key] UNIQUE NONCLUSTERED ([fechaInicio],[fechaFin])
);

-- AddForeignKey
ALTER TABLE [dbo].[periodos] ADD CONSTRAINT [periodos_cerradoPorId_fkey] FOREIGN KEY ([cerradoPorId]) REFERENCES [dbo].[usuarios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

