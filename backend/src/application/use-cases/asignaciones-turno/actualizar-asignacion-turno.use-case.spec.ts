import Decimal from 'decimal.js';
import { AsignacionTurno } from '../../../domain/entities/asignacion-turno.entity';
import { Turno } from '../../../domain/entities/turno.entity';
import { AsignacionRangoFechasInvalidoError } from '../../../domain/errors/asignacion-rango-fechas-invalido.error';
import { AsignacionSolapadaError } from '../../../domain/errors/asignacion-solapada.error';
import { AsignacionTurnoNoEncontradaError } from '../../../domain/errors/asignacion-turno-no-encontrada.error';
import { TurnoNoEncontradoError } from '../../../domain/errors/turno-no-encontrado.error';
import {
  ActualizarAsignacionTurnoDatos,
  AsignacionTurnoRepository,
  CrearAsignacionTurnoDatos,
} from '../../ports/asignacion-turno.repository.port';
import {
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../../ports/registro-horas.repository.port';
import {
  ActualizarTurnoDatos,
  CrearTurnoDatos,
  TurnoRepository,
} from '../../ports/turno.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
import { RecalcularRegistrosPorCambioDeTurnoService } from '../../services/recalcular-registros-turno.service';
import { ActualizarAsignacionTurnoUseCase } from './actualizar-asignacion-turno.use-case';

class RegistroHorasRepositoryVacioFake implements Pick<RegistroHorasRepository, 'listarPorEmpleadoYRango'> {
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
    id: string,
    datos: ActualizarAsignacionTurnoDatos,
  ): Promise<AsignacionTurno> {
    const actual = this.asignaciones.find((a) => a.id === id);
    if (!actual) return Promise.reject(new Error('no encontrado'));
    const actualizada = new AsignacionTurno(
      actual.id,
      actual.empleadoId,
      datos.turnoId ?? actual.turnoId,
      datos.fechaDesde ?? actual.fechaDesde,
      datos.fechaHasta !== undefined ? datos.fechaHasta : actual.fechaHasta,
      datos.comentario !== undefined ? datos.comentario : actual.comentario,
      actual.creadoPorId,
      actual.createdAt,
    );
    this.asignaciones = this.asignaciones.map((a) => (a.id === id ? actualizada : a));
    return Promise.resolve(actualizada);
  }
  eliminar(): Promise<void> {
    return Promise.reject(new Error('no usado en este test'));
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

const ASIGNACION = new AsignacionTurno(
  'asignacion-1',
  'empleado-1',
  TURNO_NOCTURNO.id,
  new Date('2026-08-01'),
  new Date('2026-08-15'),
  null,
  'usuario-0',
  new Date(),
);

describe('ActualizarAsignacionTurnoUseCase', () => {
  it('actualiza el rango cuando no hay solapamiento', async () => {
    const useCase = new ActualizarAsignacionTurnoUseCase(
      new TurnoRepositoryFake([TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake([ASIGNACION]),
      recalcularServiceSinRegistros(),
    );

    const actualizada = await useCase.ejecutar(ASIGNACION.id, {
      fechaHasta: new Date('2026-08-20'),
    });

    expect(actualizada.fechaHasta).toEqual(new Date('2026-08-20'));
  });

  it('lanza AsignacionTurnoNoEncontradaError si no existe', async () => {
    const useCase = new ActualizarAsignacionTurnoUseCase(
      new TurnoRepositoryFake([TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake([]),
      recalcularServiceSinRegistros(),
    );

    await expect(
      useCase.ejecutar('inexistente', { comentario: 'x' }),
    ).rejects.toBeInstanceOf(AsignacionTurnoNoEncontradaError);
  });

  it('lanza TurnoNoEncontradoError si el nuevo turno no existe', async () => {
    const useCase = new ActualizarAsignacionTurnoUseCase(
      new TurnoRepositoryFake([TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake([ASIGNACION]),
      recalcularServiceSinRegistros(),
    );

    await expect(
      useCase.ejecutar(ASIGNACION.id, { turnoId: 'turno-inexistente' }),
    ).rejects.toBeInstanceOf(TurnoNoEncontradoError);
  });

  it('lanza AsignacionRangoFechasInvalidoError si el nuevo rango es inválido', async () => {
    const useCase = new ActualizarAsignacionTurnoUseCase(
      new TurnoRepositoryFake([TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake([ASIGNACION]),
      recalcularServiceSinRegistros(),
    );

    await expect(
      useCase.ejecutar(ASIGNACION.id, { fechaHasta: new Date('2026-07-01') }),
    ).rejects.toBeInstanceOf(AsignacionRangoFechasInvalidoError);
  });

  it('lanza AsignacionSolapadaError si el nuevo rango se solapa con otra asignación del mismo empleado', async () => {
    const otra = new AsignacionTurno(
      'asignacion-2',
      ASIGNACION.empleadoId,
      TURNO_DIURNO.id,
      new Date('2026-09-01'),
      new Date('2026-09-30'),
      null,
      'usuario-0',
      new Date(),
    );
    const useCase = new ActualizarAsignacionTurnoUseCase(
      new TurnoRepositoryFake([TURNO_NOCTURNO, TURNO_DIURNO]),
      new AsignacionTurnoRepositoryFake([ASIGNACION, otra]),
      recalcularServiceSinRegistros(),
    );

    await expect(
      useCase.ejecutar(ASIGNACION.id, { fechaHasta: new Date('2026-09-10') }),
    ).rejects.toBeInstanceOf(AsignacionSolapadaError);
  });

  it('no se solapa consigo misma al no cambiar el rango', async () => {
    const useCase = new ActualizarAsignacionTurnoUseCase(
      new TurnoRepositoryFake([TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake([ASIGNACION]),
      recalcularServiceSinRegistros(),
    );

    const actualizada = await useCase.ejecutar(ASIGNACION.id, {
      comentario: 'refuerzo por temporada alta',
    });

    expect(actualizada.comentario).toBe('refuerzo por temporada alta');
  });
});
