BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[feriados] DROP COLUMN [nombre];
ALTER TABLE [dbo].[feriados] ADD [descripcion] NVARCHAR(1000) NOT NULL;

-- DropTable
DROP TABLE [dbo].[configuraciones_calculo];

-- CreateTable
CREATE TABLE [dbo].[tipos_hora_extra] (
    [id] NVARCHAR(1000) NOT NULL,
    [codigo] VARCHAR(20) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [porcentaje] DECIMAL(6,2) NOT NULL,
    [activo] BIT NOT NULL CONSTRAINT [tipos_hora_extra_activo_df] DEFAULT 1,
    CONSTRAINT [tipos_hora_extra_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [tipos_hora_extra_codigo_key] UNIQUE NONCLUSTERED ([codigo])
);

-- CreateTable
CREATE TABLE [dbo].[configuracion] (
    [clave] VARCHAR(50) NOT NULL,
    [valor] NVARCHAR(1000) NOT NULL,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [configuracion_pkey] PRIMARY KEY CLUSTERED ([clave])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

