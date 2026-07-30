import Decimal from 'decimal.js';
import { Empleado } from '../../domain/entities/empleado.entity';
import { Periodo } from '../../domain/entities/periodo.entity';
import { RegistroHoras } from '../../domain/entities/registro-horas.entity';
import { Salario } from '../../domain/entities/salario.entity';
import { EstadoFilaImportacion } from '../../domain/enums/estado-fila-importacion.enum';
import { EstadoPeriodo } from '../../domain/enums/estado-periodo.enum';
import { OrigenRegistro } from '../../domain/enums/origen-registro.enum';
import {
  ActualizarEmpleadoDatos,
  CrearEmpleadoDatos,
  EmpleadoRepository,
  EmpleadosPaginados,
  FiltroEmpleados,
} from '../ports/empleado.repository.port';
import { FilaExcelCruda } from '../ports/excel-parser.port';
import {
  ActualizarRegistroDatos,
  CrearRegistroDatos,
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../ports/registro-horas.repository.port';
import {
  CrearPeriodoDatos,
  PeriodoRepository,
} from '../ports/periodo.repository.port';
import {
  CrearSalarioDatos,
  SalarioRepository,
} from '../ports/salario.repository.port';
import { BuscarRegistroDuplicadoService } from './buscar-registro-duplicado.service';
import { ValidarFilasImportacionService } from './validar-filas-importacion.service';

class EmpleadoRepositoryFake implements EmpleadoRepository {
  constructor(private readonly empleados: Empleado[]) {}

  listar(_filtro: FiltroEmpleados): Promise<EmpleadosPaginados> {
    const items = this.empleados.map((e) => ({ ...e, montoMensualVigente: null }));
    return Promise.resolve({ items, total: items.length });
  }

  buscarPorId(id: string): Promise<Empleado | null> {
    return Promise.resolve(this.empleados.find((e) => e.id === id) ?? null);
  }

  buscarPorCodigo(codigo: number): Promise<Empleado | null> {
    return Promise.resolve(
      this.empleados.find((e) => e.codigo === codigo) ?? null,
    );
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

class SalarioRepositoryFake implements SalarioRepository {
  constructor(private readonly salarios: Salario[]) {}

  listarPorEmpleado(empleadoId: string): Promise<Salario[]> {
    return Promise.resolve(
      this.salarios.filter((s) => s.empleadoId === empleadoId),
    );
  }

  crear(
    _empleadoId: string,
    _datos: CrearSalarioDatos,
    _cerrarVigenteAnteriorHasta: Date,
  ): Promise<Salario> {
    return Promise.reject(new Error('no usado en este test'));
  }

  buscarVigenteEn(empleadoId: string, fecha: Date): Promise<Salario | null> {
    return Promise.resolve(
      this.salarios.find(
        (s) => s.empleadoId === empleadoId && s.estaVigenteEn(fecha),
      ) ?? null,
    );
  }
}

class RegistroHorasRepositoryFake implements RegistroHorasRepository {
  constructor(private readonly existentes: RegistroConCalculos[]) {}

  listarPorPeriodo(
    _periodoId: string,
    _empleadoId?: string,
  ): Promise<RegistroConCalculos[]> {
    return Promise.resolve(this.existentes);
  }
  listarPorEmpleadoYRango(): Promise<RegistroConCalculos[]> {
    return Promise.reject(new Error('no usado en este test'));
  }

  buscarPorId(_id: string): Promise<RegistroConCalculos | null> {
    return Promise.reject(new Error('no usado en este test'));
  }

  buscarPorEmpleadoYFecha(
    empleadoId: string,
    fecha: Date,
  ): Promise<RegistroConCalculos | null> {
    return Promise.resolve(
      this.existentes.find(
        (r) =>
          r.registro.empleadoId === empleadoId &&
          r.registro.fecha.getTime() === fecha.getTime(),
      ) ?? null,
    );
  }

  crear(
    _datos: CrearRegistroDatos,
    _filas: never[],
  ): Promise<RegistroConCalculos> {
    return Promise.reject(new Error('no usado en este test'));
  }

  actualizar(
    _id: string,
    _datos: ActualizarRegistroDatos,
    _filas: never[],
  ): Promise<RegistroConCalculos> {
    return Promise.reject(new Error('no usado en este test'));
  }

  eliminar(_id: string): Promise<void> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

class PeriodoRepositoryFake implements PeriodoRepository {
  constructor(private readonly periodos: Periodo[]) {}
  listar(): Promise<Periodo[]> {
    return Promise.resolve(this.periodos);
  }
  listarEliminados(): Promise<Periodo[]> {
    return Promise.resolve([]);
  }
  buscarPorId(id: string): Promise<Periodo | null> {
    return Promise.resolve(this.periodos.find((p) => p.id === id) ?? null);
  }
  buscarPorFechas(): Promise<Periodo | null> {
    return Promise.resolve(null);
  }
  crear(_datos: CrearPeriodoDatos): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }
  cerrar(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }
  eliminar(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }
  restaurar(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }
  eliminarPermanentemente(): Promise<void> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

const PERIODO = new Periodo(
  'periodo-1',
  new Date('2026-08-01T00:00:00.000Z'),
  new Date('2026-08-15T00:00:00.000Z'),
  EstadoPeriodo.ABIERTO,
  null,
  null,
  null,
  null,
);

const PERIODO_ANTERIOR = new Periodo(
  'periodo-anterior',
  new Date('2026-06-16T00:00:00.000Z'),
  new Date('2026-06-30T00:00:00.000Z'),
  EstadoPeriodo.CERRADO,
  new Date('2026-07-01T00:00:00.000Z'),
  'usuario-0',
  null,
  null,
);

const EMPLEADO_ACTIVO = new Empleado(
  'emp-1',
  40,
  'Juana Pérez',
  '001-1234567-8',
  'Supervisora',
  true,
);

const EMPLEADO_INACTIVO = new Empleado(
  'emp-2',
  41,
  'Pedro Gómez',
  '001-7654321-0',
  'Auxiliar',
  false,
);

const SALARIO_VIGENTE = new Salario(
  'salario-1',
  EMPLEADO_ACTIVO.id,
  new Decimal('30000.00'),
  new Date('2026-01-01T00:00:00.000Z'),
  null,
);

function filaBase(overrides: Partial<FilaExcelCruda> = {}): FilaExcelCruda {
  return {
    linea: 2,
    fecha: new Date('2026-08-05T00:00:00.000Z'),
    codigo: EMPLEADO_ACTIVO.codigo,
    nombreCrudo: EMPLEADO_ACTIVO.nombre,
    horaEntrada: '08:30',
    horaSalida: '17:30',
    ...overrides,
  };
}

function crearServicio(
  empleados: Empleado[] = [EMPLEADO_ACTIVO, EMPLEADO_INACTIVO],
  salarios: Salario[] = [SALARIO_VIGENTE],
  registrosExistentes: RegistroConCalculos[] = [],
  periodos: Periodo[] = [PERIODO, PERIODO_ANTERIOR],
): ValidarFilasImportacionService {
  const registroRepo = new RegistroHorasRepositoryFake(registrosExistentes);
  return new ValidarFilasImportacionService(
    new EmpleadoRepositoryFake(empleados),
    new SalarioRepositoryFake(salarios),
    registroRepo,
    new BuscarRegistroDuplicadoService(
      registroRepo,
      new PeriodoRepositoryFake(periodos),
    ),
  );
}

function registroExistente(
  empleadoId: string,
  fecha: string,
  periodoId: string = PERIODO.id,
): RegistroConCalculos {
  return {
    registro: new RegistroHoras(
      'reg-existente',
      periodoId,
      empleadoId,
      new Date(fecha),
      '08:30',
      '17:30',
      OrigenRegistro.MANUAL,
      null,
      null,
      false,
    ),
    calculos: [],
  };
}

describe('ValidarFilasImportacionService', () => {
  it('marca OK una fila válida sin advertencias', async () => {
    const servicio = crearServicio();
    const [resultado] = await servicio.validar([filaBase()], PERIODO);

    expect(resultado.estado).toBe(EstadoFilaImportacion.OK);
    expect(resultado.empleadoId).toBe(EMPLEADO_ACTIVO.id);
    expect(resultado.mensajes).toHaveLength(0);
  });

  it('marca ERROR si el código no corresponde a ningún empleado', async () => {
    const servicio = crearServicio();
    const [resultado] = await servicio.validar(
      [filaBase({ codigo: 999 })],
      PERIODO,
    );

    expect(resultado.estado).toBe(EstadoFilaImportacion.ERROR);
    expect(resultado.mensajes[0]).toMatch(/no existe un empleado/i);
  });

  it('marca ERROR si el empleado está inactivo', async () => {
    const servicio = crearServicio();
    const [resultado] = await servicio.validar(
      [filaBase({ codigo: EMPLEADO_INACTIVO.codigo })],
      PERIODO,
    );

    expect(resultado.estado).toBe(EstadoFilaImportacion.ERROR);
    expect(resultado.mensajes[0]).toMatch(/inactivo/i);
  });

  it('marca ERROR si el empleado no tiene salario vigente en la fecha', async () => {
    const servicio = crearServicio([EMPLEADO_ACTIVO], []);
    const [resultado] = await servicio.validar([filaBase()], PERIODO);

    expect(resultado.estado).toBe(EstadoFilaImportacion.ERROR);
    expect(resultado.mensajes[0]).toMatch(/salario vigente/i);
  });

  it('marca ERROR (fila ignorada) si falta la hora de entrada o salida', async () => {
    const servicio = crearServicio();
    const [resultado] = await servicio.validar(
      [filaBase({ horaSalida: null })],
      PERIODO,
    );

    expect(resultado.estado).toBe(EstadoFilaImportacion.ERROR);
    expect(resultado.mensajes[0]).toMatch(/ignorada/i);
  });

  it('marca RETROACTIVO (no ADVERTENCIA) si la fecha está fuera del rango del periodo y no hay duplicado', async () => {
    const servicio = crearServicio();
    const [resultado] = await servicio.validar(
      [filaBase({ fecha: new Date('2026-09-01T00:00:00.000Z') })],
      PERIODO,
    );

    expect(resultado.estado).toBe(EstadoFilaImportacion.RETROACTIVO);
    expect(resultado.mensajes[0]).toMatch(/retroactivo/i);
  });

  it('marca ERROR (no RETROACTIVO) si la fecha retroactiva ya tiene un registro en otro periodo', async () => {
    const servicio = crearServicio(
      [EMPLEADO_ACTIVO],
      [SALARIO_VIGENTE],
      [registroExistente(EMPLEADO_ACTIVO.id, '2026-06-20', PERIODO_ANTERIOR.id)],
    );
    const [resultado] = await servicio.validar(
      [filaBase({ fecha: new Date('2026-06-20T00:00:00.000Z') })],
      PERIODO,
    );

    expect(resultado.estado).toBe(EstadoFilaImportacion.ERROR);
    expect(resultado.mensajes[0]).toMatch(/no se puede pagar la misma jornada dos veces/i);
  });

  it('marca ADVERTENCIA si ya existe un registro para ese empleado y fecha', async () => {
    const servicio = crearServicio(
      [EMPLEADO_ACTIVO],
      [SALARIO_VIGENTE],
      [registroExistente(EMPLEADO_ACTIVO.id, '2026-08-05')],
    );
    const [resultado] = await servicio.validar([filaBase()], PERIODO);

    expect(resultado.estado).toBe(EstadoFilaImportacion.ADVERTENCIA);
    expect(resultado.mensajes[0]).toMatch(/ya existe un registro/i);
  });

  it('marca ADVERTENCIA en la segunda ocurrencia de una fila duplicada dentro del archivo', async () => {
    const servicio = crearServicio();
    const [primera, segunda] = await servicio.validar(
      [filaBase(), filaBase({ linea: 3 })],
      PERIODO,
    );

    expect(primera.estado).toBe(EstadoFilaImportacion.OK);
    expect(segunda.estado).toBe(EstadoFilaImportacion.ADVERTENCIA);
    expect(segunda.mensajes[0]).toMatch(/duplicada dentro del archivo/i);
  });

  it('acepta un cruce de medianoche razonable sin advertencia', async () => {
    const servicio = crearServicio();
    const [resultado] = await servicio.validar(
      [filaBase({ horaEntrada: '22:00', horaSalida: '06:00' })], // 8h
      PERIODO,
    );

    expect(resultado.estado).toBe(EstadoFilaImportacion.OK);
  });

  it('marca ADVERTENCIA un cruce de medianoche con duración poco razonable', async () => {
    const servicio = crearServicio();
    const [resultado] = await servicio.validar(
      [filaBase({ horaEntrada: '08:00', horaSalida: '07:00' })], // 23h
      PERIODO,
    );

    expect(resultado.estado).toBe(EstadoFilaImportacion.ADVERTENCIA);
    expect(resultado.mensajes[0]).toMatch(/cruce de medianoche inusual/i);
  });
});
