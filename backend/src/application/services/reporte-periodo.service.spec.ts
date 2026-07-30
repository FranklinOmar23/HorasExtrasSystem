import Decimal from 'decimal.js';
import { Calculo } from '../../domain/entities/calculo.entity';
import { Empleado } from '../../domain/entities/empleado.entity';
import { Periodo } from '../../domain/entities/periodo.entity';
import { RegistroHoras } from '../../domain/entities/registro-horas.entity';
import { Salario } from '../../domain/entities/salario.entity';
import { EstadoPeriodo } from '../../domain/enums/estado-periodo.enum';
import { OrigenRegistro } from '../../domain/enums/origen-registro.enum';
import { TipoHoraExtraCodigo } from '../../domain/enums/tipo-hora-extra-codigo.enum';
import { ConfiguracionRepository } from '../ports/configuracion.repository.port';
import {
  ActualizarEmpleadoDatos,
  CrearEmpleadoDatos,
  EmpleadoRepository,
  EmpleadosPaginados,
  FiltroEmpleados,
} from '../ports/empleado.repository.port';
import {
  ActualizarRegistroDatos,
  CrearRegistroDatos,
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../ports/registro-horas.repository.port';
import {
  CrearSalarioDatos,
  SalarioRepository,
} from '../ports/salario.repository.port';
import { FilaCalculo } from '../../domain/services/motor-calculo';
import { ReportePeriodoService } from './reporte-periodo.service';

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

const CONFIGURACION_FIJA: Record<string, string> = {
  divisor_salario: '24.00',
  horas_jornada: '8',
  horas_almuerzo: '1',
  entrada_semana: '08:30',
  salida_semana: '17:30',
  entrada_sabado: '09:00',
  salida_sabado: '13:00',
  inicio_nocturna: '21:00',
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

class RegistroHorasRepositoryFake implements RegistroHorasRepository {
  constructor(private readonly registros: RegistroConCalculos[]) {}
  listarPorPeriodo(
    _periodoId: string,
    empleadoId?: string,
  ): Promise<RegistroConCalculos[]> {
    const filtrados = empleadoId
      ? this.registros.filter((r) => r.registro.empleadoId === empleadoId)
      : this.registros;
    return Promise.resolve(filtrados);
  }
  listarPorEmpleadoYRango(): Promise<RegistroConCalculos[]> {
    return Promise.reject(new Error('no usado en este test'));
  }
  buscarPorId(_id: string): Promise<RegistroConCalculos | null> {
    return Promise.reject(new Error('no usado en este test'));
  }
  buscarPorEmpleadoYFecha(): Promise<RegistroConCalculos | null> {
    return Promise.reject(new Error('no usado en este test'));
  }
  crear(
    _datos: CrearRegistroDatos,
    _filas: FilaCalculo[],
  ): Promise<RegistroConCalculos> {
    return Promise.reject(new Error('no usado en este test'));
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

const EMPLEADO_40 = new Empleado(
  'emp-40',
  40,
  'Juana Pérez',
  '001-1234567-8',
  'Supervisora',
  true,
);

const EMPLEADO_10 = new Empleado(
  'emp-10',
  10,
  'Pedro Ramírez',
  '001-9999999-1',
  'Operario',
  true,
);

let contadorCalculo = 0;
function calculo(
  registroId: string,
  codigo: TipoHoraExtraCodigo,
  horas: string,
  monto: string,
  salarioHora: string,
): Calculo {
  contadorCalculo += 1;
  return new Calculo(
    `calc-${contadorCalculo}`,
    registroId,
    `tipo-${codigo}`,
    codigo,
    new Decimal(horas),
    new Decimal('35.00'),
    new Decimal(salarioHora),
    new Decimal(monto),
    new Date(),
  );
}

function registro(
  id: string,
  empleadoId: string,
  fecha: string,
  calculos: Calculo[],
  esRetroactivo = false,
): RegistroConCalculos {
  return {
    registro: new RegistroHoras(
      id,
      PERIODO.id,
      empleadoId,
      new Date(fecha),
      '08:30',
      '19:30',
      OrigenRegistro.MANUAL,
      null,
      null,
      esRetroactivo,
    ),
    calculos,
  };
}

describe('ReportePeriodoService', () => {
  it('suma horas y montos por tipo para un empleado con varios registros', async () => {
    const registros: RegistroConCalculos[] = [
      registro('reg-1', EMPLEADO_40.id, '2026-08-05', [
        calculo('reg-1', TipoHoraExtraCodigo.HE_35, '2', '270.00', '100.00'),
      ]),
      registro('reg-2', EMPLEADO_40.id, '2026-08-06', [
        calculo('reg-2', TipoHoraExtraCodigo.HE_35, '1', '135.00', '100.00'),
        calculo(
          'reg-2',
          TipoHoraExtraCodigo.NOCTURNA_15,
          '3',
          '45.00',
          '100.00',
        ),
      ]),
    ];

    const servicio = new ReportePeriodoService(
      new RegistroHorasRepositoryFake(registros),
      new EmpleadoRepositoryFake([EMPLEADO_40]),
      new SalarioRepositoryFake([]),
      new ConfiguracionRepositoryFake(),
    );

    const reporte = await servicio.generar(PERIODO);

    expect(reporte.filas).toHaveLength(1);
    const [fila] = reporte.filas;
    expect(fila.empleado.codigo).toBe(40);
    expect(fila.horas.he35.toString()).toBe('3');
    expect(fila.horas.nocturna.toString()).toBe('3');
    expect(fila.montos.he35.toString()).toBe('405');
    expect(fila.montos.nocturna.toString()).toBe('45');
    expect(fila.total.toString()).toBe('450');
    expect(fila.salarioHora.toString()).toBe('100');
    expect(reporte.granTotal.toString()).toBe('450');
  });

  it('ordena las filas por código de empleado y suma el gran total entre empleados', async () => {
    const registros: RegistroConCalculos[] = [
      registro('reg-1', EMPLEADO_40.id, '2026-08-05', [
        calculo('reg-1', TipoHoraExtraCodigo.HE_35, '2', '270.00', '100.00'),
      ]),
      registro('reg-2', EMPLEADO_10.id, '2026-08-05', [
        calculo('reg-2', TipoHoraExtraCodigo.HE_100, '4', '800.00', '100.00'),
      ]),
    ];

    const servicio = new ReportePeriodoService(
      new RegistroHorasRepositoryFake(registros),
      new EmpleadoRepositoryFake([EMPLEADO_40, EMPLEADO_10]),
      new SalarioRepositoryFake([]),
      new ConfiguracionRepositoryFake(),
    );

    const reporte = await servicio.generar(PERIODO);

    expect(reporte.filas.map((f) => f.empleado.codigo)).toEqual([10, 40]);
    expect(reporte.granTotal.toString()).toBe('1070');
  });

  it('resuelve el salario/hora vía SalarioRepository si el empleado no tiene calculos en el periodo', async () => {
    const registros: RegistroConCalculos[] = [
      registro('reg-1', EMPLEADO_40.id, '2026-08-05', []), // día normal, sin exceso
    ];
    const salario = new Salario(
      'salario-1',
      EMPLEADO_40.id,
      new Decimal('24000.00'),
      new Date('2026-01-01T00:00:00.000Z'),
      null,
    );

    const servicio = new ReportePeriodoService(
      new RegistroHorasRepositoryFake(registros),
      new EmpleadoRepositoryFake([EMPLEADO_40]),
      new SalarioRepositoryFake([salario]),
      new ConfiguracionRepositoryFake(),
    );

    const reporte = await servicio.generar(PERIODO);

    expect(reporte.filas[0].salarioHora.toString()).toBe('125'); // 24000/24/8
    expect(reporte.filas[0].total.toString()).toBe('0');
  });

  it('suma por separado los registros retroactivos dentro del total del periodo', async () => {
    const registros: RegistroConCalculos[] = [
      registro('reg-1', EMPLEADO_40.id, '2026-08-05', [
        calculo('reg-1', TipoHoraExtraCodigo.HE_35, '2', '270.00', '100.00'),
      ]),
      registro(
        'reg-2',
        EMPLEADO_40.id,
        '2026-06-09',
        [calculo('reg-2', TipoHoraExtraCodigo.HE_35, '3', '405.00', '100.00')],
        true,
      ),
    ];

    const servicio = new ReportePeriodoService(
      new RegistroHorasRepositoryFake(registros),
      new EmpleadoRepositoryFake([EMPLEADO_40]),
      new SalarioRepositoryFake([]),
      new ConfiguracionRepositoryFake(),
    );

    const reporte = await servicio.generar(PERIODO);

    const [fila] = reporte.filas;
    expect(fila.total.toString()).toBe('675');
    expect(fila.retroactivo.dias).toBe(1);
    expect(fila.retroactivo.monto.toString()).toBe('405');
  });

  it('generarFilaEmpleado devuelve una fila en ceros si el empleado no tiene registros en el periodo', async () => {
    const servicio = new ReportePeriodoService(
      new RegistroHorasRepositoryFake([]),
      new EmpleadoRepositoryFake([EMPLEADO_40]),
      new SalarioRepositoryFake([]),
      new ConfiguracionRepositoryFake(),
    );

    const { fila, registros } = await servicio.generarFilaEmpleado(
      PERIODO,
      EMPLEADO_40,
    );

    expect(registros).toHaveLength(0);
    expect(fila.total.toString()).toBe('0');
    expect(fila.salarioHora.toString()).toBe('0'); // sin salario registrado
  });
});
