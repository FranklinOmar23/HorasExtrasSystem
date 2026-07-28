import Decimal from 'decimal.js';
import { Turno } from '../../../domain/entities/turno.entity';
import { TurnoConAsignacionesError } from '../../../domain/errors/turno-con-asignaciones.error';
import { TurnoNoEncontradoError } from '../../../domain/errors/turno-no-encontrado.error';
import { TurnoPorDefectoNoEliminableError } from '../../../domain/errors/turno-por-defecto-no-eliminable.error';
import { AsignacionTurnoRepository } from '../../ports/asignacion-turno.repository.port';
import {
  ActualizarTurnoDatos,
  CrearTurnoDatos,
  TurnoRepository,
} from '../../ports/turno.repository.port';
import { EliminarTurnoUseCase } from './eliminar-turno.use-case';

class TurnoRepositoryFake implements TurnoRepository {
  eliminados: string[] = [];
  constructor(private turnos: Turno[] = []) {}

  listar(): Promise<Turno[]> {
    return Promise.resolve(this.turnos);
  }
  buscarPorId(id: string): Promise<Turno | null> {
    return Promise.resolve(this.turnos.find((t) => t.id === id) ?? null);
  }
  buscarPorCodigo(codigo: string): Promise<Turno | null> {
    return Promise.resolve(this.turnos.find((t) => t.codigo === codigo) ?? null);
  }
  crear(_datos: CrearTurnoDatos): Promise<Turno> {
    return Promise.reject(new Error('no usado en este test'));
  }
  actualizar(_id: string, _datos: ActualizarTurnoDatos): Promise<Turno> {
    return Promise.reject(new Error('no usado en este test'));
  }
  eliminar(id: string): Promise<void> {
    this.eliminados.push(id);
    this.turnos = this.turnos.filter((t) => t.id !== id);
    return Promise.resolve();
  }
}

class AsignacionTurnoRepositoryFake
  implements Pick<AsignacionTurnoRepository, 'existeAlgunaConTurno'>
{
  constructor(private turnosConAsignaciones: Set<string> = new Set()) {}
  existeAlgunaConTurno(turnoId: string): Promise<boolean> {
    return Promise.resolve(this.turnosConAsignaciones.has(turnoId));
  }
}

const TURNO_NOCTURNO = new Turno(
  'turno-nocturno',
  'NOCTURNO',
  'Nocturno',
  '22:00',
  '08:00',
  new Decimal('8'),
  true,
  true,
  true,
);
const TURNO_DIURNO = new Turno(
  'turno-diurno',
  'DIURNO',
  'Diurno',
  '08:30',
  '17:30',
  new Decimal('8'),
  false,
  true,
  true,
);

describe('EliminarTurnoUseCase', () => {
  it('elimina un turno sin asignaciones que no es DIURNO/SABADO', async () => {
    const turnoRepo = new TurnoRepositoryFake([TURNO_NOCTURNO]);
    const useCase = new EliminarTurnoUseCase(
      turnoRepo,
      new AsignacionTurnoRepositoryFake() as unknown as AsignacionTurnoRepository,
    );

    const eliminado = await useCase.ejecutar(TURNO_NOCTURNO.id);

    expect(turnoRepo.eliminados).toEqual([TURNO_NOCTURNO.id]);
    expect(eliminado.codigo).toBe('NOCTURNO');
  });

  it('lanza TurnoNoEncontradoError si no existe', async () => {
    const useCase = new EliminarTurnoUseCase(
      new TurnoRepositoryFake([]),
      new AsignacionTurnoRepositoryFake() as unknown as AsignacionTurnoRepository,
    );

    await expect(useCase.ejecutar('inexistente')).rejects.toBeInstanceOf(
      TurnoNoEncontradoError,
    );
  });

  it('lanza TurnoPorDefectoNoEliminableError para DIURNO', async () => {
    const useCase = new EliminarTurnoUseCase(
      new TurnoRepositoryFake([TURNO_DIURNO]),
      new AsignacionTurnoRepositoryFake() as unknown as AsignacionTurnoRepository,
    );

    await expect(useCase.ejecutar(TURNO_DIURNO.id)).rejects.toBeInstanceOf(
      TurnoPorDefectoNoEliminableError,
    );
  });

  it('lanza TurnoConAsignacionesError si alguna asignación usa el turno', async () => {
    const useCase = new EliminarTurnoUseCase(
      new TurnoRepositoryFake([TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake(
        new Set([TURNO_NOCTURNO.id]),
      ) as unknown as AsignacionTurnoRepository,
    );

    await expect(useCase.ejecutar(TURNO_NOCTURNO.id)).rejects.toBeInstanceOf(
      TurnoConAsignacionesError,
    );
  });
});
