BEGIN TRY

BEGIN TRAN;

-- AlterTable
-- DEFAULT temporal para no romper las 4 filas ya sembradas; el seed
-- (prisma/seed.ts) corrige NOCTURNA_15/FERIADO a SOLO_RECARGO justo después.
ALTER TABLE [dbo].[tipos_hora_extra] ADD [modoValorizacion] VARCHAR(20) NOT NULL CONSTRAINT [tipos_hora_extra_modoValorizacion_df] DEFAULT 'COMPLETA';

-- CreateTable
CREATE TABLE [dbo].[registros_horas] (
    [id] NVARCHAR(1000) NOT NULL,
    [periodoId] NVARCHAR(1000) NOT NULL,
    [empleadoId] NVARCHAR(1000) NOT NULL,
    [fecha] DATE NOT NULL,
    [horaEntrada] VARCHAR(5) NOT NULL,
    [horaSalida] VARCHAR(5) NOT NULL,
    [origen] VARCHAR(10) NOT NULL,
    [importacionId] NVARCHAR(1000),
    [comentario] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [registros_horas_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [registros_horas_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[calculos] (
    [id] NVARCHAR(1000) NOT NULL,
    [registroId] NVARCHAR(1000) NOT NULL,
    [tipoHoraId] NVARCHAR(1000) NOT NULL,
    [cantidadHoras] DECIMAL(8,4) NOT NULL,
    [porcentajeAplicado] DECIMAL(6,2) NOT NULL,
    [salarioHoraUsado] DECIMAL(12,4) NOT NULL,
    [monto] DECIMAL(12,2) NOT NULL,
    [calculadoEn] DATETIME2 NOT NULL CONSTRAINT [calculos_calculadoEn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [calculos_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [registros_horas_periodoId_empleadoId_idx] ON [dbo].[registros_horas]([periodoId], [empleadoId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [calculos_registroId_idx] ON [dbo].[calculos]([registroId]);

-- AddForeignKey
ALTER TABLE [dbo].[registros_horas] ADD CONSTRAINT [registros_horas_periodoId_fkey] FOREIGN KEY ([periodoId]) REFERENCES [dbo].[periodos]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[registros_horas] ADD CONSTRAINT [registros_horas_empleadoId_fkey] FOREIGN KEY ([empleadoId]) REFERENCES [dbo].[empleados]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[calculos] ADD CONSTRAINT [calculos_registroId_fkey] FOREIGN KEY ([registroId]) REFERENCES [dbo].[registros_horas]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[calculos] ADD CONSTRAINT [calculos_tipoHoraId_fkey] FOREIGN KEY ([tipoHoraId]) REFERENCES [dbo].[tipos_hora_extra]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

