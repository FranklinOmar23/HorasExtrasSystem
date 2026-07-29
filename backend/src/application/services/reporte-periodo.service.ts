import Decimal from 'decimal.js';
import { Empleado } from '../../domain/entities/empleado.entity';
import { Periodo } from '../../domain/entities/periodo.entity';
import { TipoHoraExtraCodigo } from '../../domain/enums/tipo-hora-extra-codigo.enum';
import { ConfiguracionRepository } from '../ports/configuracion.repository.port';
import { EmpleadoRepository } from '../ports/empleado.repository.port';
import {
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../ports/registro-horas.repository.port';
import { SalarioRepository } from '../ports/salario.repository.port';
import { parsearConfiguracionCalculo } from './configuracion-calculo.mapper';

export interface DesgloseTipoHora {
  he35: Decimal;
  he100: Decimal;
  nocturna: Decimal;
  feriado: Decimal;
}

export interface RetroactivoResumen {
  dias: number;
  monto: Decimal;
}

export interface FilaReportePeriodo {
  empleado: { id: string; codigo: number; nombre: string };
  salarioHora: Decimal;
  horas: DesgloseTipoHora;
  montos: DesgloseTipoHora;
  total: Decimal;
  retroactivo: RetroactivoResumen;
}

export interface ReportePeriodo {
  periodo: Periodo;
  filas: FilaReportePeriodo[];
  granTotal: Decimal;
}

export interface ReporteFilaEmpleado {
  fila: FilaReportePeriodo;
  registros: RegistroConCalculos[];
}

const CLAVE_POR_CODIGO: Record<TipoHoraExtraCodigo, keyof DesgloseTipoHora> = {
  [TipoHoraExtraCodigo.HE_35]: 'he35',
  [TipoHoraExtraCodigo.HE_100]: 'he100',
  [TipoHoraExtraCodigo.NOCTURNA_15]: 'nocturna',
  [TipoHoraExtraCodigo.FERIADO]: 'feriado',
};

function desgloseCero(): DesgloseTipoHora {
  return {
    he35: new Decimal(0),
    he100: new Decimal(0),
    nocturna: new Decimal(0),
    feriado: new Decimal(0),
  };
}

/**
 * Agrega los `calculos` ya congelados de los registros de horas de un
 * periodo, por empleado. Es de solo lectura: no recalcula nada con el motor,
 * solo suma lo que ya se guardó al crear/actualizar/importar cada registro.
 */
export class ReportePeriodoService {
  constructor(
    private readonly registroHorasRepository: RegistroHorasRepository,
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly salarioRepository: SalarioRepository,
    private readonly configuracionRepository: ConfiguracionRepository,
  ) {}

  async generar(periodo: Periodo): Promise<ReportePeriodo> {
    const registros = await this.registroHorasRepository.listarPorPeriodo(
      periodo.id,
    );

    const registrosPorEmpleado = new Map<string, RegistroConCalculos[]>();
    for (const registroConCalculos of registros) {
      const empleadoId = registroConCalculos.registro.empleadoId;
      const lista = registrosPorEmpleado.get(empleadoId) ?? [];
      lista.push(registroConCalculos);
      registrosPorEmpleado.set(empleadoId, lista);
    }

    const parametrosSalario = await this.obtenerParametrosSalario();

    const filas: FilaReportePeriodo[] = [];
    for (const [empleadoId, registrosEmpleado] of registrosPorEmpleado) {
      const empleado = await this.empleadoRepository.buscarPorId(empleadoId);
      if (!empleado) {
        continue;
      }
      filas.push(
        await this.agregarFilaEmpleado(
          empleado,
          registrosEmpleado,
          parametrosSalario,
        ),
      );
    }

    filas.sort((a, b) => a.empleado.codigo - b.empleado.codigo);
    const granTotal = filas.reduce(
      (acumulado, fila) => acumulado.plus(fila.total),
      new Decimal(0),
    );

    return { periodo, filas, granTotal };
  }

  /** Igual que `generar`, pero acotado a un solo empleado; incluye sus
   *  registros crudos para armar un detalle día por día. Devuelve una fila
   *  en ceros (con el salario/hora vigente) si el empleado no tiene
   *  registros en este periodo. */
  async generarFilaEmpleado(
    periodo: Periodo,
    empleado: Empleado,
  ): Promise<ReporteFilaEmpleado> {
    const registros = await this.registroHorasRepository.listarPorPeriodo(
      periodo.id,
      empleado.id,
    );
    const parametrosSalario = await this.obtenerParametrosSalario();
    const fila = await this.agregarFilaEmpleado(
      empleado,
      registros,
      parametrosSalario,
    );
    return { fila, registros };
  }

  private async obtenerParametrosSalario(): Promise<{
    divisorSalario: Decimal;
    horasJornada: Decimal;
  }> {
    const configuracion = await this.configuracionRepository.obtenerTodos();
    const { divisorSalario, horasJornadaGlobal } =
      parsearConfiguracionCalculo(configuracion);
    return { divisorSalario, horasJornada: horasJornadaGlobal };
  }

  private async agregarFilaEmpleado(
    empleado: Empleado,
    registros: RegistroConCalculos[],
    parametrosSalario: { divisorSalario: Decimal; horasJornada: Decimal },
  ): Promise<FilaReportePeriodo> {
    const horas = desgloseCero();
    const montos = desgloseCero();
    let salarioHora: Decimal | null = null;
    let ultimaFecha: Date | null = null;
    let diasRetroactivos = 0;
    let montoRetroactivo = new Decimal(0);

    for (const { registro, calculos } of registros) {
      if (!ultimaFecha || registro.fecha > ultimaFecha) {
        ultimaFecha = registro.fecha;
      }
      let totalRegistro = new Decimal(0);
      for (const calculo of calculos) {
        const clave = CLAVE_POR_CODIGO[calculo.tipoHoraCodigo];
        horas[clave] = horas[clave].plus(calculo.cantidadHoras);
        montos[clave] = montos[clave].plus(calculo.monto);
        salarioHora = calculo.salarioHoraUsado;
        totalRegistro = totalRegistro.plus(calculo.monto);
      }
      if (registro.esRetroactivo) {
        diasRetroactivos += 1;
        montoRetroactivo = montoRetroactivo.plus(totalRegistro);
      }
    }

    if (salarioHora === null) {
      const salario = await this.salarioRepository.buscarVigenteEn(
        empleado.id,
        ultimaFecha ?? new Date(),
      );
      // divisorSalario (23.83) convierte el salario mensual a DIARIO; hay
      // que dividir ese diario entre las horas de la jornada para llegar
      // al salario/hora (misma fórmula que CalcularDesgloseService).
      salarioHora = salario
        ? salario.montoMensual
            .dividedBy(parametrosSalario.divisorSalario)
            .dividedBy(parametrosSalario.horasJornada)
        : new Decimal(0);
    }

    const total = montos.he35
      .plus(montos.he100)
      .plus(montos.nocturna)
      .plus(montos.feriado);

    return {
      empleado: {
        id: empleado.id,
        codigo: empleado.codigo,
        nombre: empleado.nombre,
      },
      salarioHora,
      horas,
      montos,
      total,
      retroactivo: { dias: diasRetroactivos, monto: montoRetroactivo },
    };
  }
}
