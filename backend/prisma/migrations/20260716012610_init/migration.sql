BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[usuarios] (
    [id] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [passwordHash] NVARCHAR(1000) NOT NULL,
    [rol] VARCHAR(10) NOT NULL,
    [activo] BIT NOT NULL CONSTRAINT [usuarios_activo_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [usuarios_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [usuarios_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [usuarios_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[empleados] (
    [id] NVARCHAR(1000) NOT NULL,
    [codigo] NVARCHAR(1000) NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [cargo] NVARCHAR(1000),
    [activo] BIT NOT NULL CONSTRAINT [empleados_activo_df] DEFAULT 1,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [empleados_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [empleados_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [empleados_codigo_key] UNIQUE NONCLUSTERED ([codigo])
);

-- CreateTable
CREATE TABLE [dbo].[historial_salarios] (
    [id] NVARCHAR(1000) NOT NULL,
    [empleadoId] NVARCHAR(1000) NOT NULL,
    [salarioMensual] DECIMAL(12,2) NOT NULL,
    [vigenteDesde] DATETIME2 NOT NULL,
    [vigenteHasta] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [historial_salarios_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [historial_salarios_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[configuraciones_calculo] (
    [id] NVARCHAR(1000) NOT NULL,
    [porcentajeHoraExtra35] DECIMAL(5,2) NOT NULL,
    [porcentajeHoraExtra100] DECIMAL(5,2) NOT NULL,
    [porcentajeRecargoNocturno15] DECIMAL(5,2) NOT NULL,
    [divisorSalarioMensual] DECIMAL(6,2) NOT NULL,
    [horasJornadaDiaria] DECIMAL(4,2) NOT NULL,
    [horaInicioJornada] NVARCHAR(1000) NOT NULL,
    [horaFinJornada] NVARCHAR(1000) NOT NULL,
    [minutosDescuentoAlmuerzo] INT NOT NULL,
    [horaInicioNocturna] NVARCHAR(1000) NOT NULL,
    [toleranciaMinutos] INT NOT NULL,
    [decimalesRedondeo] INT NOT NULL CONSTRAINT [configuraciones_calculo_decimalesRedondeo_df] DEFAULT 2,
    [vigenteDesde] DATETIME2 NOT NULL,
    [vigenteHasta] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [configuraciones_calculo_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [configuraciones_calculo_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[feriados] (
    [id] NVARCHAR(1000) NOT NULL,
    [fecha] DATE NOT NULL,
    [nombre] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [feriados_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [feriados_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [feriados_fecha_key] UNIQUE NONCLUSTERED ([fecha])
);

-- CreateTable
CREATE TABLE [dbo].[periodos_quincenales] (
    [id] NVARCHAR(1000) NOT NULL,
    [anio] INT NOT NULL,
    [mes] INT NOT NULL,
    [quincena] INT NOT NULL,
    [fechaInicio] DATE NOT NULL,
    [fechaFin] DATE NOT NULL,
    [estado] VARCHAR(10) NOT NULL CONSTRAINT [periodos_quincenales_estado_df] DEFAULT 'ABIERTO',
    [cerradoEn] DATETIME2,
    [cerradoPorId] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [periodos_quincenales_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [periodos_quincenales_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [periodos_quincenales_anio_mes_quincena_key] UNIQUE NONCLUSTERED ([anio],[mes],[quincena])
);

-- CreateTable
CREATE TABLE [dbo].[importaciones_excel] (
    [id] NVARCHAR(1000) NOT NULL,
    [periodoId] NVARCHAR(1000) NOT NULL,
    [nombreArchivo] NVARCHAR(1000) NOT NULL,
    [importadoPorId] NVARCHAR(1000) NOT NULL,
    [cantidadRegistros] INT NOT NULL,
    [importadoEn] DATETIME2 NOT NULL CONSTRAINT [importaciones_excel_importadoEn_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [importaciones_excel_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[registros_horas] (
    [id] NVARCHAR(1000) NOT NULL,
    [periodoId] NVARCHAR(1000) NOT NULL,
    [empleadoId] NVARCHAR(1000) NOT NULL,
    [importacionId] NVARCHAR(1000) NOT NULL,
    [fecha] DATE NOT NULL,
    [horaEntrada] DATETIME2,
    [horaSalida] DATETIME2,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [registros_horas_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [registros_horas_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[calculos_horas_extra] (
    [id] NVARCHAR(1000) NOT NULL,
    [registroHorasId] NVARCHAR(1000) NOT NULL,
    [periodoId] NVARCHAR(1000) NOT NULL,
    [empleadoId] NVARCHAR(1000) NOT NULL,
    [horasNormales] DECIMAL(6,2) NOT NULL,
    [horasExtra35] DECIMAL(6,2) NOT NULL,
    [horasExtra100] DECIMAL(6,2) NOT NULL,
    [horasRecargoNocturno15] DECIMAL(6,2) NOT NULL,
    [salarioHoraUsado] DECIMAL(12,4) NOT NULL,
    [porcentajeExtra35Usado] DECIMAL(5,2) NOT NULL,
    [porcentajeExtra100Usado] DECIMAL(5,2) NOT NULL,
    [porcentajeRecargo15Usado] DECIMAL(5,2) NOT NULL,
    [montoNormal] DECIMAL(12,2) NOT NULL,
    [montoExtra35] DECIMAL(12,2) NOT NULL,
    [montoExtra100] DECIMAL(12,2) NOT NULL,
    [montoRecargoNocturno] DECIMAL(12,2) NOT NULL,
    [montoTotal] DECIMAL(12,2) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [calculos_horas_extra_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [calculos_horas_extra_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [calculos_horas_extra_registroHorasId_key] UNIQUE NONCLUSTERED ([registroHorasId])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [historial_salarios_empleadoId_vigenteDesde_idx] ON [dbo].[historial_salarios]([empleadoId], [vigenteDesde]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [configuraciones_calculo_vigenteDesde_idx] ON [dbo].[configuraciones_calculo]([vigenteDesde]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [registros_horas_periodoId_empleadoId_idx] ON [dbo].[registros_horas]([periodoId], [empleadoId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [calculos_horas_extra_periodoId_empleadoId_idx] ON [dbo].[calculos_horas_extra]([periodoId], [empleadoId]);

-- AddForeignKey
ALTER TABLE [dbo].[historial_salarios] ADD CONSTRAINT [historial_salarios_empleadoId_fkey] FOREIGN KEY ([empleadoId]) REFERENCES [dbo].[empleados]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[periodos_quincenales] ADD CONSTRAINT [periodos_quincenales_cerradoPorId_fkey] FOREIGN KEY ([cerradoPorId]) REFERENCES [dbo].[usuarios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[importaciones_excel] ADD CONSTRAINT [importaciones_excel_periodoId_fkey] FOREIGN KEY ([periodoId]) REFERENCES [dbo].[periodos_quincenales]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[importaciones_excel] ADD CONSTRAINT [importaciones_excel_importadoPorId_fkey] FOREIGN KEY ([importadoPorId]) REFERENCES [dbo].[usuarios]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[registros_horas] ADD CONSTRAINT [registros_horas_periodoId_fkey] FOREIGN KEY ([periodoId]) REFERENCES [dbo].[periodos_quincenales]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[registros_horas] ADD CONSTRAINT [registros_horas_empleadoId_fkey] FOREIGN KEY ([empleadoId]) REFERENCES [dbo].[empleados]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[registros_horas] ADD CONSTRAINT [registros_horas_importacionId_fkey] FOREIGN KEY ([importacionId]) REFERENCES [dbo].[importaciones_excel]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[calculos_horas_extra] ADD CONSTRAINT [calculos_horas_extra_registroHorasId_fkey] FOREIGN KEY ([registroHorasId]) REFERENCES [dbo].[registros_horas]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[calculos_horas_extra] ADD CONSTRAINT [calculos_horas_extra_periodoId_fkey] FOREIGN KEY ([periodoId]) REFERENCES [dbo].[periodos_quincenales]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[calculos_horas_extra] ADD CONSTRAINT [calculos_horas_extra_empleadoId_fkey] FOREIGN KEY ([empleadoId]) REFERENCES [dbo].[empleados]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
