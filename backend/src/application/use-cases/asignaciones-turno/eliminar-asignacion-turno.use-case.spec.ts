import { AsignacionTurno } from '../../../domain/entities/asignacion-turno.entity';
import { AsignacionTurnoNoEncontradaError } from '../../../domain/errors/asignacion-turno-no-encontrada.error';
import {
  ActualizarAsignacionTurnoDatos,
  AsignacionTurnoRepository,
  CrearAsignacionTurnoDatos,
} from '../../ports/asignacion-turno.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import {
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../../ports/registro-horas.repository.port';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
import { RecalcularRegistrosPorCambioDeTurnoService } from '../../services/recalcular-registros-turno.service';
import { EliminarAsignacionTurnoUseCase } from './eliminar-asignacion-turno.use-case';

class RegistroHorasRepositoryVacioFake
  implements Pick<RegistroHorasRepository, 'listarPorEmpleadoYRango'>
{
  listarPorEmpleadoYRango(): Promise<RegistroConCalculos[]> {
    return Promise.resolve([]);
  }
}

function recalcularServiceSinRegistros(): RecalcularRegistrosPorCambioDeTurnoService {
  return new RecalcularRegistrosPorCambioDeTurnoService(
    new RegistroHorasRepositoryVacioFake() as unknown as RegistroHorasRepository,
    {} as unknown as PeriodoRepository,
    {} as unknown as CalcularDesgloseService,
  );
}

class AsignacionTurnoRepositoryFake implements AsignacionTurnoRepository {
  eliminados: string[] = [];

  constructor(private asignaciones: AsignacionTurno[] = []) {}

  listarPorEmpleado(empleadoId: string): Promise<AsignacionTurno[]> {
    return Promise.resolve(
      this.asignaciones.filter((a) => a.empleadoId === empleadoId),
    );
  }
  buscarPorId(id: string): Promise<AsignacionTurno | null> {
    return Promise.resolve(this.asignaciones.find((a) => a.id === id) ?? null);
  }
  buscarVigenteEn(): Promise<AsignacionTurno | null> {
    return Promise.resolve(null);
  }
  existeAlgunaConTurno(): Promise<boolean> {
    return Promise.reject(new Error('no usado en este test'));
  }
  crear(_datos: CrearAsignacionTurnoDatos): Promise<AsignacionTurno> {
    return Promise.reject(new Error('no usado en este test'));
  }
  actualizar(
    _id: string,
    _datos: ActualizarAsignacionTurnoDatos,
  ): Promise<AsignacionTurno> {
    return Promise.reject(new Error('no usado en este test'));
  }
  eliminar(id: string): Promise<void> {
    this.eliminados.push(id);
    this.asignaciones = this.asignaciones.filter((a) => a.id !== id);
    return Promise.resolve();
  }
}

const ASIGNACION = new AsignacionTurno(
  'asignacion-1',
  'empleado-1',
  'turno-1',
  new Date('2026-08-01'),
  new Date('2026-08-15'),
  null,
  'usuario-0',
  new Date(),
);

describe('EliminarAsignacionTurnoUseCase', () => {
  it('elimina la asignación cuando existe', async () => {
    const repo = new AsignacionTurnoRepositoryFake([ASIGNACION]);
    const useCase = new EliminarAsignacionTurnoUseCase(
      repo,
      recalcularServiceSinRegistros(),
    );

    const eliminada = await useCase.ejecutar(ASIGNACION.id);

    expect(repo.eliminados).toEqual([ASIGNACION.id]);
    expect(eliminada.id).toBe(ASIGNACION.id);
  });

  it('lanza AsignacionTurnoNoEncontradaError si no existe', async () => {
    const useCase = new EliminarAsignacionTurnoUseCase(
      new AsignacionTurnoRepositoryFake([]),
      recalcularServiceSinRegistros(),
    );

    await expect(useCase.ejecutar('inexistente')).rejects.toBeInstanceOf(
      AsignacionTurnoNoEncontradaError,
    );
  });
});
