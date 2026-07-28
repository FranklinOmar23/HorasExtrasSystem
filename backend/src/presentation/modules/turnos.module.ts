import { Module } from '@nestjs/common';
import { ASIGNACION_TURNO_REPOSITORY } from '../../application/ports/asignacion-turno.repository.port';
import type { AsignacionTurnoRepository } from '../../application/ports/asignacion-turno.repository.port';
import { EMPLEADO_REPOSITORY } from '../../application/ports/empleado.repository.port';
import type { EmpleadoRepository } from '../../application/ports/empleado.repository.port';
import { PERIODO_REPOSITORY } from '../../application/ports/periodo.repository.port';
import type { PeriodoRepository } from '../../application/ports/periodo.repository.port';
import { REGISTRO_HORAS_REPOSITORY } from '../../application/ports/registro-horas.repository.port';
import type { RegistroHorasRepository } from '../../application/ports/registro-horas.repository.port';
import { TURNO_REPOSITORY } from '../../application/ports/turno.repository.port';
import type { TurnoRepository } from '../../application/ports/turno.repository.port';
import { ActualizarAsignacionTurnoUseCase } from '../../application/use-cases/asignaciones-turno/actualizar-asignacion-turno.use-case';
import { CrearAsignacionTurnoUseCase } from '../../application/use-cases/asignaciones-turno/crear-asignacion-turno.use-case';
import { EliminarAsignacionTurnoUseCase } from '../../application/use-cases/asignaciones-turno/eliminar-asignacion-turno.use-case';
import { ListarAsignacionesPorEmpleadoUseCase } from '../../application/use-cases/asignaciones-turno/listar-asignaciones-por-empleado.use-case';
import { ActualizarTurnoUseCase } from '../../application/use-cases/turnos/actualizar-turno.use-case';
import { CrearTurnoUseCase } from '../../application/use-cases/turnos/crear-turno.use-case';
import { EliminarTurnoUseCase } from '../../application/use-cases/turnos/eliminar-turno.use-case';
import { ListarTurnosUseCase } from '../../application/use-cases/turnos/listar-turnos.use-case';
import { CalcularDesgloseService } from '../../application/services/calcular-desglose.service';
import { RecalcularRegistrosPorCambioDeTurnoService } from '../../application/services/recalcular-registros-turno.service';
import { AsignacionTurnoPrismaRepository } from '../../infrastructure/repositories/asignacion-turno.prisma.repository';
import { TurnoPrismaRepository } from '../../infrastructure/repositories/turno.prisma.repository';
import { AsignacionesTurnoController } from '../controllers/asignaciones-turno.controller';
import { TurnosController } from '../controllers/turnos.controller';
import { EmpleadosModule } from './empleados.module';
import { PeriodosModule } from './periodos.module';
import { RegistrosModule } from './registros.module';

@Module({
  imports: [EmpleadosModule, PeriodosModule, RegistrosModule],
  controllers: [TurnosController, AsignacionesTurnoController],
  providers: [
    { provide: TURNO_REPOSITORY, useClass: TurnoPrismaRepository },
    {
      provide: ASIGNACION_TURNO_REPOSITORY,
      useClass: AsignacionTurnoPrismaRepository,
    },
    {
      provide: RecalcularRegistrosPorCambioDeTurnoService,
      useFactory: (
        registroRepo: RegistroHorasRepository,
        periodoRepo: PeriodoRepository,
        calcularDesglose: CalcularDesgloseService,
      ) =>
        new RecalcularRegistrosPorCambioDeTurnoService(
          registroRepo,
          periodoRepo,
          calcularDesglose,
        ),
      inject: [REGISTRO_HORAS_REPOSITORY, PERIODO_REPOSITORY, CalcularDesgloseService],
    },
    {
      provide: ListarTurnosUseCase,
      useFactory: (repo: TurnoRepository) => new ListarTurnosUseCase(repo),
      inject: [TURNO_REPOSITORY],
    },
    {
      provide: CrearTurnoUseCase,
      useFactory: (repo: TurnoRepository) => new CrearTurnoUseCase(repo),
      inject: [TURNO_REPOSITORY],
    },
    {
      provide: ActualizarTurnoUseCase,
      useFactory: (repo: TurnoRepository) => new ActualizarTurnoUseCase(repo),
      inject: [TURNO_REPOSITORY],
    },
    {
      provide: EliminarTurnoUseCase,
      useFactory: (
        turnoRepo: TurnoRepository,
        asignacionRepo: AsignacionTurnoRepository,
      ) => new EliminarTurnoUseCase(turnoRepo, asignacionRepo),
      inject: [TURNO_REPOSITORY, ASIGNACION_TURNO_REPOSITORY],
    },
    {
      provide: ListarAsignacionesPorEmpleadoUseCase,
      useFactory: (
        empleadoRepo: EmpleadoRepository,
        asignacionRepo: AsignacionTurnoRepository,
      ) => new ListarAsignacionesPorEmpleadoUseCase(empleadoRepo, asignacionRepo),
      inject: [EMPLEADO_REPOSITORY, ASIGNACION_TURNO_REPOSITORY],
    },
    {
      provide: CrearAsignacionTurnoUseCase,
      useFactory: (
        empleadoRepo: EmpleadoRepository,
        turnoRepo: TurnoRepository,
        asignacionRepo: AsignacionTurnoRepository,
        recalcularService: RecalcularRegistrosPorCambioDeTurnoService,
      ) =>
        new CrearAsignacionTurnoUseCase(
          empleadoRepo,
          turnoRepo,
          asignacionRepo,
          recalcularService,
        ),
      inject: [
        EMPLEADO_REPOSITORY,
        TURNO_REPOSITORY,
        ASIGNACION_TURNO_REPOSITORY,
        RecalcularRegistrosPorCambioDeTurnoService,
      ],
    },
    {
      provide: ActualizarAsignacionTurnoUseCase,
      useFactory: (
        turnoRepo: TurnoRepository,
        asignacionRepo: AsignacionTurnoRepository,
        recalcularService: RecalcularRegistrosPorCambioDeTurnoService,
      ) =>
        new ActualizarAsignacionTurnoUseCase(
          turnoRepo,
          asignacionRepo,
          recalcularService,
        ),
      inject: [
        TURNO_REPOSITORY,
        ASIGNACION_TURNO_REPOSITORY,
        RecalcularRegistrosPorCambioDeTurnoService,
      ],
    },
    {
      provide: EliminarAsignacionTurnoUseCase,
      useFactory: (
        asignacionRepo: AsignacionTurnoRepository,
        recalcularService: RecalcularRegistrosPorCambioDeTurnoService,
      ) => new EliminarAsignacionTurnoUseCase(asignacionRepo, recalcularService),
      inject: [
        ASIGNACION_TURNO_REPOSITORY,
        RecalcularRegistrosPorCambioDeTurnoService,
      ],
    },
  ],
  exports: [TURNO_REPOSITORY, ASIGNACION_TURNO_REPOSITORY],
})
export class TurnosModule {}
