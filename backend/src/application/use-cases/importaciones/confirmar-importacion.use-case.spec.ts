import Decimal from 'decimal.js';
import { Empleado } from '../../../domain/entities/empleado.entity';
import { Feriado } from '../../../domain/entities/feriado.entity';
import { Importacion } from '../../../domain/entities/importacion.entity';
import { Periodo } from '../../../domain/entities/periodo.entity';
import { RegistroHoras } from '../../../domain/entities/registro-horas.entity';
import { Salario } from '../../../domain/entities/salario.entity';
import { TipoHoraExtra } from '../../../domain/entities/tipo-hora-extra.entity';
import { EstadoPeriodo } from '../../../domain/enums/estado-periodo.enum';
import { ImportacionNoEncontradaError } from '../../../domain/errors/importacion-no-encontrada.error';
import { ImportacionYaConfirmadaError } from '../../../domain/errors/importacion-ya-confirmada.error';
import { ModoValorizacion } from '../../../domain/enums/modo-valorizacion.enum';
import { OrigenRegistro } from '../../../domain/enums/origen-registro.enum';
import { PeriodoCerradoError } from '../../../domain/errors/periodo-cerrado.error';
import { TipoHoraExtraCodigo } from '../../../domain/enums/tipo-hora-extra-codigo.enum';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
import {
  ActualizarEmpleadoDatos,
  CrearEmpleadoDatos,
  EmpleadoRepository,
  FiltroEmpleados,
} from '../../ports/empleado.repository.port';
import { ExcelParserPort, FilaExcelCruda } from '../../ports/excel-parser.port';
import {
  CrearFeriadoDatos,
  FeriadoRepository,
} from '../../ports/feriado.repository.port';
import { ConfiguracionRepository } from '../../ports/configuracion.repository.port';
import {
  CrearImportacionDatos,
  ImportacionRepository,
} from '../../ports/importacion.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
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
import { ValidarFilasImportacionService } from '../../services/validar-filas-importacion.service';
import { ConfirmarImportacionUseCase } from './confirmar-importacion.use-case';

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
  listar(_anio?: number): Promise<Feriado[]> {
    return Promise.resolve([]);
  }
  buscarPorId(_id: string): Promise<Feriado | null> {
    return Promise.resolve(null);
  }
  buscarPorFecha(_fecha: Date): Promise<Feriado | null> {
    return Promise.resolve(null);
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
  private readonly existentes: RegistroConCalculos[];

  constructor(existentes: RegistroConCalculos[] = []) {
    this.existentes = existentes;
  }

  listarPorPeriodo(
    _periodoId: string,
    _empleadoId?: string,
  ): Promise<RegistroConCalculos[]> {
    return Promise.resolve(this.existentes);
  }
  buscarPorId(_id: string): Promise<RegistroConCalculos | null> {
    return Promise.reject(new Error('no usado en este test'));
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
  constructor(private periodo: Periodo | null) {}
  listar(): Promise<Periodo[]> {
    return Promise.resolve(this.periodo ? [this.periodo] : []);
  }
  buscarPorId(id: string): Promise<Periodo | null> {
    return Promise.resolve(
      this.periodo && this.periodo.id === id ? this.periodo : null,
    );
  }
  buscarPorFechas(): Promise<Periodo | null> {
    return Promise.resolve(null);
  }
  crear(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }
  cerrar(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

class ImportacionRepositoryFake implements ImportacionRepository {
  importacion: Importacion;
  contenido: Buffer | null;

  constructor(
    importacion: Importacion,
    contenido: Buffer | null = Buffer.from('x'),
  ) {
    this.importacion = importacion;
    this.contenido = contenido;
  }

  crear(_datos: CrearImportacionDatos): Promise<Importacion> {
    return Promise.reject(new Error('no usado en este test'));
  }
  buscarPorId(id: string): Promise<Importacion | null> {
    return Promise.resolve(
      this.importacion.id === id ? this.importacion : null,
    );
  }
  obtenerContenido(_id: string): Promise<Buffer | null> {
    return Promise.resolve(this.contenido);
  }
  listarPorPeriodo(_periodoId: string): Promise<Importacion[]> {
    return Promise.resolve([this.importacion]);
  }
  marcarConfirmada(id: string, confirmadaEn: Date): Promise<Importacion> {
    this.importacion = new Importacion(
      this.importacion.id,
      this.importacion.periodoId,
      this.importacion.usuarioId,
      this.importacion.archivo,
      this.importacion.filasOk,
      this.importacion.filasAdvertencia,
      this.importacion.filasError,
      this.importacion.importadoEn,
      confirmadaEn,
    );
    return Promise.resolve(this.importacion);
  }
}

class ExcelParserFake implements ExcelParserPort {
  constructor(private readonly filas: FilaExcelCruda[]) {}
  parsear(_contenido: Buffer): FilaExcelCruda[] {
    return this.filas;
  }
}

const EMPLEADO = new Empleado(
  'emp-1',
  40,
  'Juana Pérez',
  '001-1234567-8',
  'Supervisora',
  true,
);

const SALARIO = new Salario(
  'salario-1',
  EMPLEADO.id,
  new Decimal('23830.00'), // salario/hora = 125.00 (23830/23.83/8)
  new Date('2026-01-01T00:00:00.000Z'),
  null,
);

const PERIODO_ABIERTO = new Periodo(
  'periodo-1',
  new Date('2026-08-01T00:00:00.000Z'),
  new Date('2026-08-15T00:00:00.000Z'),
  EstadoPeriodo.ABIERTO,
  null,
  null,
);

const PERIODO_CERRADO = new Periodo(
  'periodo-2',
  new Date('2026-08-01T00:00:00.000Z'),
  new Date('2026-08-15T00:00:00.000Z'),
  EstadoPeriodo.CERRADO,
  new Date(),
  'usuario-1',
);

function filaCruda(overrides: Partial<FilaExcelCruda> = {}): FilaExcelCruda {
  return {
    linea: 2,
    fecha: new Date('2026-08-05T00:00:00.000Z'),
    codigo: EMPLEADO.codigo,
    nombreCrudo: EMPLEADO.nombre,
    horaEntrada: '08:30',
    horaSalida: '17:30', // día normal, sin exceso -> 0 filas de cálculo, pero registro válido
    ...overrides,
  };
}

function construirUseCase(opciones: {
  periodo?: Periodo | null;
  importacion: Importacion;
  filasExcel: FilaExcelCruda[];
  registrosExistentes?: RegistroConCalculos[];
}) {
  const empleadoRepo = new EmpleadoRepositoryFake([EMPLEADO]);
  const salarioRepo = new SalarioRepositoryFake([SALARIO]);
  const registroRepo = new RegistroHorasRepositoryFake(
    opciones.registrosExistentes ?? [],
  );
  const periodoRepo = new PeriodoRepositoryFake(
    opciones.periodo === undefined ? PERIODO_ABIERTO : opciones.periodo,
  );
  const importacionRepo = new ImportacionRepositoryFake(opciones.importacion);
  const excelParser = new ExcelParserFake(opciones.filasExcel);
  const validarFilas = new ValidarFilasImportacionService(
    empleadoRepo,
    salarioRepo,
    registroRepo,
  );
  const calcularDesglose = new CalcularDesgloseService(
    salarioRepo,
    new FeriadoRepositoryFake(),
    new ConfiguracionRepositoryFake(),
    new TipoHoraExtraRepositoryFake(),
  );

  const useCase = new ConfirmarImportacionUseCase(
    importacionRepo,
    periodoRepo,
    excelParser,
    validarFilas,
    registroRepo,
    calcularDesglose,
  );

  return { useCase, registroRepo, importacionRepo };
}

function importacionPendiente(periodoId = PERIODO_ABIERTO.id): Importacion {
  return new Importacion(
    'importacion-1',
    periodoId,
    'usuario-1',
    'reporte-abril.xlsx',
    0,
    0,
    0,
    new Date('2026-08-05T00:00:00.000Z'),
    null,
  );
}

describe('ConfirmarImportacionUseCase', () => {
  it('persiste solo las filas OK cuando incluirAdvertencias es false', async () => {
    const { useCase, registroRepo } = construirUseCase({
      importacion: importacionPendiente(),
      filasExcel: [
        filaCruda(), // OK
        filaCruda({
          linea: 3,
          fecha: new Date('2026-09-01T00:00:00.000Z'), // fuera del periodo -> ADVERTENCIA
        }),
      ],
    });

    await useCase.ejecutar({
      importacionId: 'importacion-1',
      incluirAdvertencias: false,
    });

    expect(registroRepo.registrosCreados).toHaveLength(1);
    expect(registroRepo.registrosCreados[0].origen).toBe(OrigenRegistro.EXCEL);
    expect(registroRepo.registrosCreados[0].importacionId).toBe(
      'importacion-1',
    );
  });

  it('persiste OK y ADVERTENCIA cuando incluirAdvertencias es true', async () => {
    const { useCase, registroRepo } = construirUseCase({
      importacion: importacionPendiente(),
      filasExcel: [
        filaCruda(),
        filaCruda({
          linea: 3,
          fecha: new Date('2026-09-01T00:00:00.000Z'),
        }),
      ],
    });

    await useCase.ejecutar({
      importacionId: 'importacion-1',
      incluirAdvertencias: true,
    });

    expect(registroRepo.registrosCreados).toHaveLength(2);
  });

  it('nunca persiste filas ERROR aunque incluirAdvertencias sea true', async () => {
    const { useCase, registroRepo } = construirUseCase({
      importacion: importacionPendiente(),
      filasExcel: [
        filaCruda(),
        filaCruda({ linea: 3, codigo: 999 }), // código inexistente -> ERROR
      ],
    });

    await useCase.ejecutar({
      importacionId: 'importacion-1',
      incluirAdvertencias: true,
    });

    expect(registroRepo.registrosCreados).toHaveLength(1);
  });

  it('marca la importación como confirmada', async () => {
    const { useCase, importacionRepo } = construirUseCase({
      importacion: importacionPendiente(),
      filasExcel: [filaCruda()],
    });

    const resultado = await useCase.ejecutar({
      importacionId: 'importacion-1',
      incluirAdvertencias: false,
    });

    expect(resultado.confirmadaEn).not.toBeNull();
    expect(importacionRepo.importacion.confirmadaEn).not.toBeNull();
  });

  it('lanza ImportacionNoEncontradaError si la importación no existe', async () => {
    const { useCase } = construirUseCase({
      importacion: importacionPendiente(),
      filasExcel: [filaCruda()],
    });

    await expect(
      useCase.ejecutar({
        importacionId: 'no-existe',
        incluirAdvertencias: false,
      }),
    ).rejects.toBeInstanceOf(ImportacionNoEncontradaError);
  });

  it('lanza ImportacionYaConfirmadaError si ya fue confirmada', async () => {
    const importacionConfirmada = new Importacion(
      'importacion-1',
      PERIODO_ABIERTO.id,
      'usuario-1',
      'reporte-abril.xlsx',
      1,
      0,
      0,
      new Date(),
      new Date(),
    );
    const { useCase } = construirUseCase({
      importacion: importacionConfirmada,
      filasExcel: [filaCruda()],
    });

    await expect(
      useCase.ejecutar({
        importacionId: 'importacion-1',
        incluirAdvertencias: false,
      }),
    ).rejects.toBeInstanceOf(ImportacionYaConfirmadaError);
  });

  it('lanza PeriodoCerradoError si el periodo ya está cerrado', async () => {
    const { useCase } = construirUseCase({
      periodo: PERIODO_CERRADO,
      importacion: importacionPendiente(PERIODO_CERRADO.id),
      filasExcel: [filaCruda()],
    });

    await expect(
      useCase.ejecutar({
        importacionId: 'importacion-1',
        incluirAdvertencias: false,
      }),
    ).rejects.toBeInstanceOf(PeriodoCerradoError);
  });
});
