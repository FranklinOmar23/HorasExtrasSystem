import Decimal from 'decimal.js';
import { AsignacionTurno } from '../../../domain/entities/asignacion-turno.entity';
import { Empleado } from '../../../domain/entities/empleado.entity';
import { Turno } from '../../../domain/entities/turno.entity';
import { AsignacionRangoFechasInvalidoError } from '../../../domain/errors/asignacion-rango-fechas-invalido.error';
import { AsignacionSolapadaError } from '../../../domain/errors/asignacion-solapada.error';
import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import { TurnoNoEncontradoError } from '../../../domain/errors/turno-no-encontrado.error';
import {
  ActualizarAsignacionTurnoDatos,
  AsignacionTurnoRepository,
  CrearAsignacionTurnoDatos,
} from '../../ports/asignacion-turno.repository.port';
import {
  ActualizarEmpleadoDatos,
  CrearEmpleadoDatos,
  EmpleadoRepository,
  FiltroEmpleados,
} from '../../ports/empleado.repository.port';
import {
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../../ports/registro-horas.repository.port';
import {
  ActualizarTurnoDatos,
  CrearTurnoDatos,
  TurnoRepository,
} from '../../ports/turno.repository.port';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { RecalcularRegistrosPorCambioDeTurnoService } from '../../services/recalcular-registros-turno.service';
import { CrearAsignacionTurnoUseCase } from './crear-asignacion-turno.use-case';

/** Sin registros afectados: verificarPeriodosAbiertos/recalcular no llegan a
 *  tocar PeriodoRepository ni CalcularDesgloseService. */
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

class EmpleadoRepositoryFake implements EmpleadoRepository {
  constructor(private empleados: Empleado[] = []) {}
  listar(_filtro: FiltroEmpleados): Promise<Empleado[]> {
    return Promise.resolve(this.empleados);
  }
  buscarPorId(id: string): Promise<Empleado | null> {
    return Promise.resolve(this.empleados.find((e) => e.id === id) ?? null);
  }
  buscarPorCodigo(): Promise<Empleado | null> {
    return Promise.resolve(null);
  }
  buscarPorCedula(): Promise<Empleado | null> {
    return Promise.resolve(null);
  }
  crear(_datos: CrearEmpleadoDatos): Promise<Empleado> {
    return Promise.reject(new Error('no usado en este test'));
  }
  actualizar(_id: string, _datos: ActualizarEmpleadoDatos): Promise<Empleado> {
    return Promise.reject(new Error('no usado en este test'));
  }
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
  asignaciones: AsignacionTurno[] = [];

  constructor(iniciales: AsignacionTurno[] = []) {
    this.asignaciones = iniciales;
  }

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
  crear(datos: CrearAsignacionTurnoDatos): Promise<AsignacionTurno> {
    const asignacion = new AsignacionTurno(
      `asignacion-${this.asignaciones.length + 1}`,
      datos.empleadoId,
      datos.turnoId,
      datos.fechaDesde,
      datos.fechaHasta,
      datos.comentario,
      datos.creadoPorId,
      new Date(),
    );
    this.asignaciones.push(asignacion);
    return Promise.resolve(asignacion);
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

const EMPLEADO = new Empleado('empleado-1', 40, 'Juana Pérez', null, 'Operaria', true);
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

function comandoBase(): CrearAsignacionTurnoDatos {
  return {
    empleadoId: EMPLEADO.id,
    turnoId: TURNO_NOCTURNO.id,
    fechaDesde: new Date('2026-08-01'),
    fechaHasta: new Date('2026-08-15'),
    comentario: null,
    creadoPorId: 'usuario-1',
  };
}

describe('CrearAsignacionTurnoUseCase', () => {
  it('crea la asignación cuando no hay solapamiento', async () => {
    const useCase = new CrearAsignacionTurnoUseCase(
      new EmpleadoRepositoryFake([EMPLEADO]),
      new TurnoRepositoryFake([TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake(),
      recalcularServiceSinRegistros(),
    );

    const asignacion = await useCase.ejecutar(comandoBase());

    expect(asignacion.turnoId).toBe(TURNO_NOCTURNO.id);
  });

  it('lanza EmpleadoNoEncontradoError si el empleado no existe', async () => {
    const useCase = new CrearAsignacionTurnoUseCase(
      new EmpleadoRepositoryFake([]),
      new TurnoRepositoryFake([TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake(),
      recalcularServiceSinRegistros(),
    );

    await expect(useCase.ejecutar(comandoBase())).rejects.toBeInstanceOf(
      EmpleadoNoEncontradoError,
    );
  });

  it('lanza TurnoNoEncontradoError si el turno no existe', async () => {
    const useCase = new CrearAsignacionTurnoUseCase(
      new EmpleadoRepositoryFake([EMPLEADO]),
      new TurnoRepositoryFake([]),
      new AsignacionTurnoRepositoryFake(),
      recalcularServiceSinRegistros(),
    );

    await expect(useCase.ejecutar(comandoBase())).rejects.toBeInstanceOf(
      TurnoNoEncontradoError,
    );
  });

  it('lanza AsignacionRangoFechasInvalidoError si fechaHasta es anterior a fechaDesde', async () => {
    const useCase = new CrearAsignacionTurnoUseCase(
      new EmpleadoRepositoryFake([EMPLEADO]),
      new TurnoRepositoryFake([TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake(),
      recalcularServiceSinRegistros(),
    );

    await expect(
      useCase.ejecutar({
        ...comandoBase(),
        fechaDesde: new Date('2026-08-15'),
        fechaHasta: new Date('2026-08-01'),
      }),
    ).rejects.toBeInstanceOf(AsignacionRangoFechasInvalidoError);
  });

  it('lanza AsignacionSolapadaError si el rango se solapa con una asignación existente', async () => {
    const existente = new AsignacionTurno(
      'asignacion-existente',
      EMPLEADO.id,
      TURNO_NOCTURNO.id,
      new Date('2026-08-10'),
      new Date('2026-08-20'),
      null,
      'usuario-0',
      new Date(),
    );
    const useCase = new CrearAsignacionTurnoUseCase(
      new EmpleadoRepositoryFake([EMPLEADO]),
      new TurnoRepositoryFake([TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake([existente]),
      recalcularServiceSinRegistros(),
    );

    await expect(useCase.ejecutar(comandoBase())).rejects.toBeInstanceOf(
      AsignacionSolapadaError,
    );
  });

  it('permite crear una asignación consecutiva que no se solapa (termina un día antes)', async () => {
    const existente = new AsignacionTurno(
      'asignacion-existente',
      EMPLEADO.id,
      TURNO_NOCTURNO.id,
      new Date('2026-07-01'),
      new Date('2026-07-31'),
      null,
      'usuario-0',
      new Date(),
    );
    const useCase = new CrearAsignacionTurnoUseCase(
      new EmpleadoRepositoryFake([EMPLEADO]),
      new TurnoRepositoryFake([TURNO_NOCTURNO]),
      new AsignacionTurnoRepositoryFake([existente]),
      recalcularServiceSinRegistros(),
    );

    const asignacion = await useCase.ejecutar(comandoBase());

    expect(asignacion.fechaDesde).toEqual(new Date('2026-08-01'));
  });
});
