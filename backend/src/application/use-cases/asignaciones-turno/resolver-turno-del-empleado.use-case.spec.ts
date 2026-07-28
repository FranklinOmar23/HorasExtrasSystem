import Decimal from 'decimal.js';
import { AsignacionTurno } from '../../../domain/entities/asignacion-turno.entity';
import { Turno } from '../../../domain/entities/turno.entity';
import { TurnoNoEncontradoError } from '../../../domain/errors/turno-no-encontrado.error';
import {
  ActualizarAsignacionTurnoDatos,
  AsignacionTurnoRepository,
  CrearAsignacionTurnoDatos,
} from '../../ports/asignacion-turno.repository.port';
import {
  ActualizarTurnoDatos,
  CrearTurnoDatos,
  TurnoRepository,
} from '../../ports/turno.repository.port';
import { ResolverTurnoDelEmpleadoUseCase } from './resolver-turno-del-empleado.use-case';

class TurnoRepositoryFake implements TurnoRepository {
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
  eliminar(): Promise<void> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

class AsignacionTurnoRepositoryFake implements AsignacionTurnoRepository {
  constructor(private asignaciones: AsignacionTurno[] = []) {}

  listarPorEmpleado(empleadoId: string): Promise<AsignacionTurno[]> {
    return Promise.resolve(
      this.asignaciones.filter((a) => a.empleadoId === empleadoId),
    );
  }
  buscarPorId(id: string): Promise<AsignacionTurno | null> {
    return Promise.resolve(this.asignaciones.find((a) => a.id === id) ?? null);
  }
  buscarVigenteEn(empleadoId: string, fecha: Date): Promise<AsignacionTurno | null> {
    const vigente = this.asignaciones.find(
      (a) => a.empleadoId === empleadoId && a.cubre(fecha),
    );
    return Promise.resolve(vigente ?? null);
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
  eliminar(): Promise<void> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

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
const TURNO_SABADO = new Turno(
  'turno-sabado',
  'SABADO',
  'Sábado',
  '09:00',
  '13:00',
  new Decimal('4'),
  false,
  false,
  true,
);
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

describe('ResolverTurnoDelEmpleadoUseCase', () => {
  it('devuelve DIURNO por defecto si no hay asignación (día de semana)', async () => {
    const useCase = new ResolverTurnoDelEmpleadoUseCase(
      new TurnoRepositoryFake([TURNO_DIURNO, TURNO_SABADO]),
      new AsignacionTurnoRepositoryFake([]),
    );

    // 2026-08-04 es martes
    const resolucion = await useCase.ejecutar('empleado-1', new Date('2026-08-04'));

    expect(resolucion.turno.codigo).toBe('DIURNO');
    expect(resolucion.explicita).toBe(false);
  });

  it('devuelve SABADO por defecto si no hay asignación y la fecha cae en sábado', async () => {
    const useCase = new ResolverTurnoDelEmpleadoUseCase(
      new TurnoRepositoryFake([TURNO_DIURNO, TURNO_SABADO]),
      new AsignacionTurnoRepositoryFake([]),
    );

    // 2026-08-08 es sábado
    const resolucion = await useCase.ejecutar('empleado-1', new Date('2026-08-08'));

    expect(resolucion.turno.codigo).toBe('SABADO');
    expect(resolucion.explicita).toBe(false);
  });

  it('devuelve el turno de la asignación vigente si existe, aunque sea sábado', async () => {
    const asignacion = new AsignacionTurno(
      'asignacion-1',
      'empleado-1',
      TURNO_NOCTURNO.id,
      new Date('2026-08-01'),
      new Date('2026-08-31'),
      null,
      'usuario-0',
      new Date(),
    );
    const useCase = new ResolverTurnoDelEmpleadoUseCase(
      new TurnoRepositoryFake([TURNO_DIURNO, TURNO_SABADO, TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake([asignacion]),
    );

    const resolucion = await useCase.ejecutar('empleado-1', new Date('2026-08-08'));

    expect(resolucion.turno.codigo).toBe('NOCTURNO');
    expect(resolucion.explicita).toBe(true);
  });

  it('lanza TurnoNoEncontradoError si el turno por defecto no está seedeado', async () => {
    const useCase = new ResolverTurnoDelEmpleadoUseCase(
      new TurnoRepositoryFake([]),
      new AsignacionTurnoRepositoryFake([]),
    );

    await expect(
      useCase.ejecutar('empleado-1', new Date('2026-08-04')),
    ).rejects.toBeInstanceOf(TurnoNoEncontradoError);
  });
});
