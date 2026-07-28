import { Module } from '@nestjs/common';
import { CONFIGURACION_REPOSITORY } from '../../application/ports/configuracion.repository.port';
import type { ConfiguracionRepository } from '../../application/ports/configuracion.repository.port';
import { EMPLEADO_REPOSITORY } from '../../application/ports/empleado.repository.port';
import type { EmpleadoRepository } from '../../application/ports/empleado.repository.port';
import { PERIODO_REPOSITORY } from '../../application/ports/periodo.repository.port';
import type { PeriodoRepository } from '../../application/ports/periodo.repository.port';
import { REGISTRO_HORAS_REPOSITORY } from '../../application/ports/registro-horas.repository.port';
import type { RegistroHorasRepository } from '../../application/ports/registro-horas.repository.port';
import { SALARIO_REPOSITORY } from '../../application/ports/salario.repository.port';
import type { SalarioRepository } from '../../application/ports/salario.repository.port';
import { ReportePeriodoService } from '../../application/services/reporte-periodo.service';
import { ResolverTurnoDelEmpleadoUseCase } from '../../application/use-cases/asignaciones-turno/resolver-turno-del-empleado.use-case';
import { ObtenerReporteEmpleadoUseCase } from '../../application/use-cases/reportes/obtener-reporte-empleado.use-case';
import { ObtenerReporteHistoricoUseCase } from '../../application/use-cases/reportes/obtener-reporte-historico.use-case';
import { ObtenerReportePeriodoUseCase } from '../../application/use-cases/reportes/obtener-reporte-periodo.use-case';
import { ReportesController } from '../controllers/reportes.controller';
import { ConfiguracionModule } from './configuracion.module';
import { EmpleadosModule } from './empleados.module';
import { PeriodosModule } from './periodos.module';
import { RegistrosModule } from './registros.module';

@Module({
  imports: [
    EmpleadosModule,
    PeriodosModule,
    ConfiguracionModule,
    RegistrosModule,
  ],
  controllers: [ReportesController],
  providers: [
    {
      provide: ReportePeriodoService,
      useFactory: (
        registroRepo: RegistroHorasRepository,
        empleadoRepo: EmpleadoRepository,
        salarioRepo: SalarioRepository,
        configuracionRepo: ConfiguracionRepository,
      ) =>
        new ReportePeriodoService(
          registroRepo,
          empleadoRepo,
          salarioRepo,
          configuracionRepo,
        ),
      inject: [
        REGISTRO_HORAS_REPOSITORY,
        EMPLEADO_REPOSITORY,
        SALARIO_REPOSITORY,
        CONFIGURACION_REPOSITORY,
      ],
    },
    {
      provide: ObtenerReportePeriodoUseCase,
      useFactory: (
        periodoRepo: PeriodoRepository,
        reporteService: ReportePeriodoService,
      ) => new ObtenerReportePeriodoUseCase(periodoRepo, reporteService),
      inject: [PERIODO_REPOSITORY, ReportePeriodoService],
    },
    {
      provide: ObtenerReporteEmpleadoUseCase,
      useFactory: (
        periodoRepo: PeriodoRepository,
        empleadoRepo: EmpleadoRepository,
        reporteService: ReportePeriodoService,
        resolverTurno: ResolverTurnoDelEmpleadoUseCase,
      ) =>
        new ObtenerReporteEmpleadoUseCase(
          periodoRepo,
          empleadoRepo,
          reporteService,
          resolverTurno,
        ),
      inject: [
        PERIODO_REPOSITORY,
        EMPLEADO_REPOSITORY,
        ReportePeriodoService,
        ResolverTurnoDelEmpleadoUseCase,
      ],
    },
    {
      provide: ObtenerReporteHistoricoUseCase,
      useFactory: (
        periodoRepo: PeriodoRepository,
        reporteService: ReportePeriodoService,
      ) => new ObtenerReporteHistoricoUseCase(periodoRepo, reporteService),
      inject: [PERIODO_REPOSITORY, ReportePeriodoService],
    },
  ],
})
export class ReportesModule {}
