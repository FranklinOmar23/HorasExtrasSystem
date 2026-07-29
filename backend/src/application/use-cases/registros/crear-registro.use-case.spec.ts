import Decimal from 'decimal.js';
import { Empleado } from '../../../domain/entities/empleado.entity';
import { Feriado } from '../../../domain/entities/feriado.entity';
import { Periodo } from '../../../domain/entities/periodo.entity';
import { RegistroHoras } from '../../../domain/entities/registro-horas.entity';
import { Salario } from '../../../domain/entities/salario.entity';
import { TipoHoraExtra } from '../../../domain/entities/tipo-hora-extra.entity';
import { Turno } from '../../../domain/entities/turno.entity';
import { EstadoPeriodo } from '../../../domain/enums/estado-periodo.enum';
import { ModoValorizacion } from '../../../domain/enums/modo-valorizacion.enum';
import { OrigenRegistro } from '../../../domain/enums/origen-registro.enum';
import { TipoHoraExtraCodigo } from '../../../domain/enums/tipo-hora-extra-codigo.enum';
import { RegistroDuplicadoEnOtroPeriodoError } from '../../../domain/errors/registro-duplicado-en-otro-periodo.error';
import {
  ActualizarEmpleadoDatos,
  CrearEmpleadoDatos,
  EmpleadoRepository,
  FiltroEmpleados,
} from '../../ports/empleado.repository.port';
import {
  CrearFeriadoDatos,
  FeriadoRepository,
} from '../../ports/feriado.repository.port';
import { ConfiguracionRepository } from '../../ports/configuracion.repository.port';
import {
  CrearPeriodoDatos,
  PeriodoRepository,
} from '../../ports/periodo.repository.port';
import {
  ActualizarRegistroDatos,
  CrearRegistroDatos,
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../../ports/registro-horas.repository.port';
import {
  CrearSalarioDatos,
  SalarioRepository,
} from '../../ports/salario.repository.port';
import {
  ActualizarTipoHoraExtraDatos,
  TipoHoraExtraRepository,
} from '../../ports/tipo-hora-extra.repository.port';
import { FilaCalculo } from '../../../domain/services/motor-calculo';
import { ResolverTurnoDelEmpleadoUseCase } from '../asignaciones-turno/resolver-turno-del-empleado.use-case';
import { BuscarRegistroDuplicadoService } from '../../services/buscar-registro-duplicado.service';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
import { CrearRegistroUseCase } from './crear-registro.use-case';

class EmpleadoRepositoryFake implements EmpleadoRepository {
  constructor(private readonly empleados: Empleado[]) {}
  listar(_filtro: FiltroEmpleados): Promise<Empleado[]> {
    return Promise.resolve(this.empleados);
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

class FeriadoRepositoryFake implements FeriadoRepository {
  constructor(private readonly feriados: Feriado[] = []) {}
  listar(_anio?: number): Promise<Feriado[]> {
    return Promise.resolve(this.feriados);
  }
  buscarPorId(_id: string): Promise<Feriado | null> {
    return Promise.resolve(null);
  }
  buscarPorFecha(fecha: Date): Promise<Feriado | null> {
    return Promise.resolve(
      this.feriados.find((f) => f.fecha.getTime() === fecha.getTime()) ??
        null,
    );
  }
  crear(_datos: CrearFeriadoDatos): Promise<Feriado> {
    return Promise.reject(new Error('no usado en este test'));
  }
  eliminar(_id: string): Promise<void> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

const CONFIGURACION_FIJA: Record<string, string> = {
  divisor_salario: '23.83',
  horas_jornada: '8',
  horas_almuerzo: '1',
  entrada_semana: '08:30',
  salida_semana: '17:30',
  entrada_sabado: '09:00',
  salida_sabado: '13:00',
  inicio_nocturna: '21:00',
  fin_nocturna: '07:00',
  tolerancia_minutos: '0',
};

class ConfiguracionRepositoryFake implements ConfiguracionRepository {
  obtenerTodos(): Promise<Record<string, string>> {
    return Promise.resolve(CONFIGURACION_FIJA);
  }
  actualizar(
    _cambios: Record<string, string>,
  ): Promise<Record<string, string>> {
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

/** Todos los empleados de este test usan el turno DIURNO por defecto (sin asignación). */
const resolverTurnoFake = {
  ejecutar: () => Promise.resolve({ turno: TURNO_DIURNO, explicita: false }),
};

const TIPOS_HORA_EXTRA = [
  new TipoHoraExtra(
    'tipo-he35',
    TipoHoraExtraCodigo.HE_35,
    'Hora extra 35%',
    new Decimal('35.00'),
    ModoValorizacion.COMPLETA,
    true,
  ),
  new TipoHoraExtra(
    'tipo-he100',
    TipoHoraExtraCodigo.HE_100,
    'Hora extra 100%',
    new Decimal('100.00'),
    ModoValorizacion.COMPLETA,
    true,
  ),
  new TipoHoraExtra(
    'tipo-nocturna',
    TipoHoraExtraCodigo.NOCTURNA_15,
    'Recargo nocturno 15%',
    new Decimal('15.00'),
    ModoValorizacion.SOLO_RECARGO,
    true,
  ),
  new TipoHoraExtra(
    'tipo-feriado',
    TipoHoraExtraCodigo.FERIADO,
    'Hora feriado',
    new Decimal('100.00'),
    ModoValorizacion.SOLO_RECARGO,
    true,
  ),
];

class TipoHoraExtraRepositoryFake implements TipoHoraExtraRepository {
  listar(): Promise<TipoHoraExtra[]> {
    return Promise.resolve(TIPOS_HORA_EXTRA);
  }
  buscarPorId(_id: string): Promise<TipoHoraExtra | null> {
    return Promise.reject(new Error('no usado en este test'));
  }
  actualizar(
    _id: string,
    _datos: ActualizarTipoHoraExtraDatos,
  ): Promise<TipoHoraExtra> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

class RegistroHorasRepositoryFake implements RegistroHorasRepository {
  registrosCreados: CrearRegistroDatos[] = [];

  constructor(private readonly existentes: RegistroConCalculos[] = []) {}

  listarPorPeriodo(): Promise<RegistroConCalculos[]> {
    return Promise.reject(new Error('no usado en este test'));
  }
  listarPorEmpleadoYRango(): Promise<RegistroConCalculos[]> {
    return Promise.reject(new Error('no usado en este test'));
  }
  buscarPorId(): Promise<RegistroConCalculos | null> {
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
    datos: CrearRegistroDatos,
    filas: FilaCalculo[],
  ): Promise<RegistroConCalculos> {
    this.registrosCreados.push(datos);
    return Promise.resolve({
      registro: new RegistroHoras(
        `reg-${this.registrosCreados.length}`,
        datos.periodoId,
        datos.empleadoId,
        datos.fecha,
        datos.horaEntrada,
        datos.horaSalida,
        datos.origen,
        datos.importacionId,
        datos.comentario,
        datos.esRetroactivo,
      ),
      calculos: filas.map((f, i) => ({
        id: `calc-${i}`,
        registroId: `reg-${this.registrosCreados.length}`,
        tipoHoraId: f.tipoHoraId,
        tipoHoraCodigo: f.tipoHoraCodigo,
        cantidadHoras: f.cantidadHoras,
        porcentajeAplicado: f.porcentajeAplicado,
        salarioHoraUsado: f.salarioHoraUsado,
        monto: f.monto,
        calculadoEn: new Date(),
      })),
    });
  }
  actualizar(
    _id: string,
    _datos: ActualizarRegistroDatos,
    _filas: FilaCalculo[],
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

const EMPLEADO = new Empleado(
  'emp-1',
  40,
  'Edwin Fernández',
  '001-1234567-8',
  'Operario',
  true,
);

// Periodo actual: 16-30 julio. Se le paga a Edwin, retroactivamente, horas
// pendientes del 9-10 de junio (quincena ya cerrada).
const PERIODO_ACTUAL = new Periodo(
  'periodo-actual',
  new Date('2026-07-16T00:00:00.000Z'),
  new Date('2026-07-30T00:00:00.000Z'),
  EstadoPeriodo.ABIERTO,
  null,
  null,
  null,
  null,
);

const PERIODO_JUNIO_CERRADO = new Periodo(
  'periodo-junio',
  new Date('2026-06-01T00:00:00.000Z'),
  new Date('2026-06-15T00:00:00.000Z'),
  EstadoPeriodo.CERRADO,
  new Date('2026-06-16T00:00:00.000Z'),
  'usuario-0',
  null,
  null,
);

function construirUseCase(opciones: {
  salarios: Salario[];
  feriados?: Feriado[];
  registrosExistentes?: RegistroConCalculos[];
  periodos?: Periodo[];
}) {
  const empleadoRepo = new EmpleadoRepositoryFake([EMPLEADO]);
  const salarioRepo = new SalarioRepositoryFake(opciones.salarios);
  const registroRepo = new RegistroHorasRepositoryFake(
    opciones.registrosExistentes ?? [],
  );
  const periodoRepo = new PeriodoRepositoryFake(
    opciones.periodos ?? [PERIODO_ACTUAL, PERIODO_JUNIO_CERRADO],
  );
  const calcularDesglose = new CalcularDesgloseService(
    salarioRepo,
    new FeriadoRepositoryFake(opciones.feriados ?? []),
    new ConfiguracionRepositoryFake(),
    new TipoHoraExtraRepositoryFake(),
    resolverTurnoFake as unknown as ResolverTurnoDelEmpleadoUseCase,
  );
  const buscarDuplicado = new BuscarRegistroDuplicadoService(
    registroRepo,
    periodoRepo,
  );

  const useCase = new CrearRegistroUseCase(
    periodoRepo,
    empleadoRepo,
    registroRepo,
    calcularDesglose,
    buscarDuplicado,
  );

  return { useCase, registroRepo };
}

describe('CrearRegistroUseCase — registros retroactivos', () => {
  it('no marca esRetroactivo si la fecha cae dentro del rango del periodo', async () => {
    const { useCase, registroRepo } = construirUseCase({
      salarios: [
        new Salario(
          'sal-1',
          EMPLEADO.id,
          new Decimal('23830.00'),
          new Date('2026-01-01T00:00:00.000Z'),
          null,
        ),
      ],
    });

    const resultado = await useCase.ejecutar({
      periodoId: PERIODO_ACTUAL.id,
      empleadoId: EMPLEADO.id,
      fecha: new Date('2026-07-20T00:00:00.000Z'),
      horaEntrada: '08:30',
      horaSalida: '17:30',
      comentario: null,
    });

    expect(resultado.registro.esRetroactivo).toBe(false);
    expect(registroRepo.registrosCreados[0].esRetroactivo).toBe(false);
  });

  it('marca esRetroactivo y calcula con el salario vigente en la fecha real (no el actual)', async () => {
    const salarioViejo = new Salario(
      'sal-junio',
      EMPLEADO.id,
      new Decimal('20000.00'),
      new Date('2026-01-01T00:00:00.000Z'),
      new Date('2026-07-01T00:00:00.000Z'),
    );
    const salarioActual = new Salario(
      'sal-julio',
      EMPLEADO.id,
      new Decimal('30000.00'),
      new Date('2026-07-01T00:00:00.000Z'),
      null,
    );
    const { useCase, registroRepo } = construirUseCase({
      salarios: [salarioViejo, salarioActual],
    });

    // Martes 9 de junio, jornada larga (9:00-19:00, con 1h de almuerzo -> 9h netas, 1h de exceso).
    const resultado = await useCase.ejecutar({
      periodoId: PERIODO_ACTUAL.id,
      empleadoId: EMPLEADO.id,
      fecha: new Date('2026-06-09T00:00:00.000Z'),
      horaEntrada: '09:00',
      horaSalida: '19:00',
      comentario: null,
    });

    expect(resultado.registro.esRetroactivo).toBe(true);
    expect(resultado.registro.periodoId).toBe(PERIODO_ACTUAL.id);
    // salario/hora = 20000 / 23.83 / 8 (el vigente en junio, NO los 30000 actuales)
    const salarioHoraEsperado = new Decimal('20000.00')
      .dividedBy('23.83')
      .dividedBy(8);
    const calculoHe35 = resultado.calculos.find(
      (c) => c.tipoHoraCodigo === TipoHoraExtraCodigo.HE_35,
    );
    expect(calculoHe35?.salarioHoraUsado.toString()).toBe(
      salarioHoraEsperado.toString(),
    );
    expect(registroRepo.registrosCreados[0].esRetroactivo).toBe(true);
  });

  it('un retroactivo en domingo usa la clasificación de su fecha real (HE_100), aunque el periodo actual no incluya domingos especiales', async () => {
    const { useCase } = construirUseCase({
      salarios: [
        new Salario(
          'sal-1',
          EMPLEADO.id,
          new Decimal('23830.00'),
          new Date('2026-01-01T00:00:00.000Z'),
          null,
        ),
      ],
    });

    // 2026-06-14 es domingo.
    const resultado = await useCase.ejecutar({
      periodoId: PERIODO_ACTUAL.id,
      empleadoId: EMPLEADO.id,
      fecha: new Date('2026-06-14T00:00:00.000Z'),
      horaEntrada: '08:00',
      horaSalida: '12:00',
      comentario: null,
    });

    expect(resultado.registro.esRetroactivo).toBe(true);
    expect(resultado.calculos).toHaveLength(1);
    expect(resultado.calculos[0].tipoHoraCodigo).toBe(
      TipoHoraExtraCodigo.HE_100,
    );
  });

  it('rechaza el retroactivo si ya existe un registro de esa fecha en otro periodo, aunque esté cerrado', async () => {
    const registroExistente: RegistroConCalculos = {
      registro: new RegistroHoras(
        'reg-junio-existente',
        PERIODO_JUNIO_CERRADO.id,
        EMPLEADO.id,
        new Date('2026-06-09T00:00:00.000Z'),
        '08:30',
        '17:30',
        OrigenRegistro.EXCEL,
        null,
        null,
        false,
      ),
      calculos: [],
    };
    const { useCase, registroRepo } = construirUseCase({
      salarios: [
        new Salario(
          'sal-1',
          EMPLEADO.id,
          new Decimal('23830.00'),
          new Date('2026-01-01T00:00:00.000Z'),
          null,
        ),
      ],
      registrosExistentes: [registroExistente],
    });

    await expect(
      useCase.ejecutar({
        periodoId: PERIODO_ACTUAL.id,
        empleadoId: EMPLEADO.id,
        fecha: new Date('2026-06-09T00:00:00.000Z'),
        horaEntrada: '08:30',
        horaSalida: '17:30',
        comentario: null,
      }),
    ).rejects.toBeInstanceOf(RegistroDuplicadoEnOtroPeriodoError);

    expect(registroRepo.registrosCreados).toHaveLength(0);
  });
});
