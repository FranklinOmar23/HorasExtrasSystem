import { Module } from '@nestjs/common';
import { ASIGNACION_TURNO_REPOSITORY } from '../../application/ports/asignacion-turno.repository.port';
import type { AsignacionTurnoRepository } from '../../application/ports/asignacion-turno.repository.port';
import { CONFIGURACION_REPOSITORY } from '../../application/ports/configuracion.repository.port';
import type { ConfiguracionRepository } from '../../application/ports/configuracion.repository.port';
import { EMPLEADO_REPOSITORY } from '../../application/ports/empleado.repository.port';
import type { EmpleadoRepository } from '../../application/ports/empleado.repository.port';
import { FERIADO_REPOSITORY } from '../../application/ports/feriado.repository.port';
import type { FeriadoRepository } from '../../application/ports/feriado.repository.port';
import { PERIODO_REPOSITORY } from '../../application/ports/periodo.repository.port';
import type { PeriodoRepository } from '../../application/ports/periodo.repository.port';
import { REGISTRO_HORAS_REPOSITORY } from '../../application/ports/registro-horas.repository.port';
import type { RegistroHorasRepository } from '../../application/ports/registro-horas.repository.port';
import { SALARIO_REPOSITORY } from '../../application/ports/salario.repository.port';
import type { SalarioRepository } from '../../application/ports/salario.repository.port';
import { TIPO_HORA_EXTRA_REPOSITORY } from '../../application/ports/tipo-hora-extra.repository.port';
import type { TipoHoraExtraRepository } from '../../application/ports/tipo-hora-extra.repository.port';
import { TURNO_REPOSITORY } from '../../application/ports/turno.repository.port';
import type { TurnoRepository } from '../../application/ports/turno.repository.port';
import { ResolverTurnoDelEmpleadoUseCase } from '../../application/use-cases/asignaciones-turno/resolver-turno-del-empleado.use-case';
import { ActualizarRegistroUseCase } from '../../application/use-cases/registros/actualizar-registro.use-case';
import { CrearRegistroUseCase } from '../../application/use-cases/registros/crear-registro.use-case';
import { EliminarRegistroUseCase } from '../../application/use-cases/registros/eliminar-registro.use-case';
import { ListarRegistrosUseCase } from '../../application/use-cases/registros/listar-registros.use-case';
import { PreviewCalculoUseCase } from '../../application/use-cases/registros/preview-calculo.use-case';
import { CalcularDesgloseService } from '../../application/services/calcular-desglose.service';
import { AsignacionTurnoPrismaRepository } from '../../infrastructure/repositories/asignacion-turno.prisma.repository';
import { RegistroHorasPrismaRepository } from '../../infrastructure/repositories/registro-horas.prisma.repository';
import { TurnoPrismaRepository } from '../../infrastructure/repositories/turno.prisma.repository';
import { RegistrosController } from '../controllers/registros.controller';
import { ConfiguracionModule } from './configuracion.module';
import { EmpleadosModule } from './empleados.module';
import { PeriodosModule } from './periodos.module';

@Module({
  imports: [EmpleadosModule, PeriodosModule, ConfiguracionModule],
  controllers: [RegistrosController],
  providers: [
    {
      provide: REGISTRO_HORAS_REPOSITORY,
      useClass: RegistroHorasPrismaRepository,
    },
    { provide: TURNO_REPOSITORY, useClass: TurnoPrismaRepository },
    {
      provide: ASIGNACION_TURNO_REPOSITORY,
      useClass: AsignacionTurnoPrismaRepository,
    },
    {
      provide: ResolverTurnoDelEmpleadoUseCase,
      useFactory: (
        turnoRepo: TurnoRepository,
        asignacionRepo: AsignacionTurnoRepository,
      ) => new ResolverTurnoDelEmpleadoUseCase(turnoRepo, asignacionRepo),
      inject: [TURNO_REPOSITORY, ASIGNACION_TURNO_REPOSITORY],
    },
    {
      provide: CalcularDesgloseService,
      useFactory: (
        salarioRepo: SalarioRepository,
        feriadoRepo: FeriadoRepository,
        configuracionRepo: ConfiguracionRepository,
        tipoHoraExtraRepo: TipoHoraExtraRepository,
        resolverTurno: ResolverTurnoDelEmpleadoUseCase,
      ) =>
        new CalcularDesgloseService(
          salarioRepo,
          feriadoRepo,
          configuracionRepo,
          tipoHoraExtraRepo,
          resolverTurno,
        ),
      inject: [
        SALARIO_REPOSITORY,
        FERIADO_REPOSITORY,
        CONFIGURACION_REPOSITORY,
        TIPO_HORA_EXTRA_REPOSITORY,
        ResolverTurnoDelEmpleadoUseCase,
      ],
    },
    {
      provide: ListarRegistrosUseCase,
      useFactory: (
        periodoRepo: PeriodoRepository,
        registroRepo: RegistroHorasRepository,
      ) => new ListarRegistrosUseCase(periodoRepo, registroRepo),
      inject: [PERIODO_REPOSITORY, REGISTRO_HORAS_REPOSITORY],
    },
    {
      provide: CrearRegistroUseCase,
      useFactory: (
        periodoRepo: PeriodoRepository,
        empleadoRepo: EmpleadoRepository,
        registroRepo: RegistroHorasRepository,
        calcularDesglose: CalcularDesgloseService,
      ) =>
        new CrearRegistroUseCase(
          periodoRepo,
          empleadoRepo,
          registroRepo,
          calcularDesglose,
        ),
      inject: [
        PERIODO_REPOSITORY,
        EMPLEADO_REPOSITORY,
        REGISTRO_HORAS_REPOSITORY,
        CalcularDesgloseService,
      ],
    },
    {
      provide: ActualizarRegistroUseCase,
      useFactory: (
        periodoRepo: PeriodoRepository,
        registroRepo: RegistroHorasRepository,
        calcularDesglose: CalcularDesgloseService,
      ) =>
        new ActualizarRegistroUseCase(
          periodoRepo,
          registroRepo,
          calcularDesglose,
        ),
      inject: [
        PERIODO_REPOSITORY,
        REGISTRO_HORAS_REPOSITORY,
        CalcularDesgloseService,
      ],
    },
    {
      provide: EliminarRegistroUseCase,
      useFactory: (
        periodoRepo: PeriodoRepository,
        registroRepo: RegistroHorasRepository,
      ) => new EliminarRegistroUseCase(periodoRepo, registroRepo),
      inject: [PERIODO_REPOSITORY, REGISTRO_HORAS_REPOSITORY],
    },
    {
      provide: PreviewCalculoUseCase,
      useFactory: (
        empleadoRepo: EmpleadoRepository,
        calcularDesglose: CalcularDesgloseService,
      ) => new PreviewCalculoUseCase(empleadoRepo, calcularDesglose),
      inject: [EMPLEADO_REPOSITORY, CalcularDesgloseService],
    },
  ],
  exports: [
    REGISTRO_HORAS_REPOSITORY,
    CalcularDesgloseService,
    ResolverTurnoDelEmpleadoUseCase,
  ],
})
export class RegistrosModule {}
