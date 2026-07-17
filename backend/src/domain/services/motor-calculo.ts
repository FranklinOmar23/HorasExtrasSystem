import Decimal from 'decimal.js';
import { TipoHoraExtra } from '../entities/tipo-hora-extra.entity';
import { TipoHoraExtraCodigo } from '../enums/tipo-hora-extra-codigo.enum';
import {
  duracionMinutos,
  entradaSalidaAjustadas,
  minutosDesdeReferencia,
} from './hora.util';

export interface ParametrosCalculo {
  horasJornada: Decimal;
  horasAlmuerzo: Decimal;
  entradaSabado: string;
  salidaSabado: string;
  inicioNocturna: string;
  toleranciaMinutos: number;
}

export interface EntradaMotorCalculo {
  fecha: Date;
  horaEntrada: string;
  horaSalida: string;
  esFeriado: boolean;
  salarioHoraUsado: Decimal;
}

export interface FilaCalculo {
  tipoHoraId: string;
  tipoHoraCodigo: TipoHoraExtraCodigo;
  cantidadHoras: Decimal;
  porcentajeAplicado: Decimal;
  salarioHoraUsado: Decimal;
  monto: Decimal;
}

/**
 * Motor de cálculo de horas extra: clase pura y sin estado. Recibe un
 * registro (entrada/salida/fecha/si es feriado), los parámetros de cálculo
 * vigentes y el catálogo de tipos de hora extra, y devuelve el desglose a
 * persistir en `calculos`. No consulta ninguna base de datos.
 *
 * Reglas de clasificación (confirmadas explícitamente, no inferidas):
 * - Feriado: todas las horas trabajadas ese día → FERIADO.
 * - Domingo (sin feriado): todas las horas trabajadas → HE_100.
 * - Sábado: horas dentro de [entradaSabado, salidaSabado] no generan fila
 *   (las cubre el salario base); el exceso → HE_100.
 * - Lunes a viernes: horas dentro de horasJornada (tras descontar
 *   horasAlmuerzo) no generan fila; el exceso → HE_35.
 * - Nocturno (desde inicioNocturna): recargo adicional NOCTURNA_15 que se
 *   suma —como fila aparte— sobre las horas que ya se clasificaron arriba,
 *   sin volver a pagar la base (ver `ModoValorizacion.SOLO_RECARGO`).
 *
 * Horas negativas se truncan a 0.
 */
export class MotorCalculo {
  constructor(private readonly tiposHoraExtra: TipoHoraExtra[]) {}

  calcular(
    entrada: EntradaMotorCalculo,
    parametros: ParametrosCalculo,
  ): FilaCalculo[] {
    const filas: FilaCalculo[] = [];
    const { entrada: entradaMin, salida: salidaMin } = entradaSalidaAjustadas(
      entrada.horaEntrada,
      entrada.horaSalida,
    );
    const minutosBrutos = salidaMin - entradaMin;
    if (minutosBrutos <= 0) {
      return filas;
    }

    const diaSemana = entrada.fecha.getUTCDay();

    if (entrada.esFeriado) {
      this.agregarFila(
        filas,
        TipoHoraExtraCodigo.FERIADO,
        minutosBrutos,
        entrada.salarioHoraUsado,
      );
    } else if (diaSemana === 0) {
      this.agregarFila(
        filas,
        TipoHoraExtraCodigo.HE_100,
        minutosBrutos,
        entrada.salarioHoraUsado,
      );
    } else if (diaSemana === 6) {
      const presupuesto =
        duracionMinutos(parametros.entradaSabado, parametros.salidaSabado) +
        parametros.toleranciaMinutos;
      const minutosExtra = Math.max(0, minutosBrutos - presupuesto);
      if (minutosExtra > 0) {
        this.agregarFila(
          filas,
          TipoHoraExtraCodigo.HE_100,
          minutosExtra,
          entrada.salarioHoraUsado,
        );
      }
    } else {
      const minutosAlmuerzo = parametros.horasAlmuerzo.times(60).toNumber();
      const minutosNetos = Math.max(0, minutosBrutos - minutosAlmuerzo);
      const presupuesto =
        parametros.horasJornada.times(60).toNumber() +
        parametros.toleranciaMinutos;
      const minutosExtra = Math.max(0, minutosNetos - presupuesto);
      if (minutosExtra > 0) {
        this.agregarFila(
          filas,
          TipoHoraExtraCodigo.HE_35,
          minutosExtra,
          entrada.salarioHoraUsado,
        );
      }
    }

    const minutosNocturnos = minutosDesdeReferencia(
      entradaMin,
      salidaMin,
      parametros.inicioNocturna,
    );
    if (minutosNocturnos > 0) {
      this.agregarFila(
        filas,
        TipoHoraExtraCodigo.NOCTURNA_15,
        minutosNocturnos,
        entrada.salarioHoraUsado,
      );
    }

    return filas;
  }

  private buscarTipo(codigo: TipoHoraExtraCodigo): TipoHoraExtra {
    const tipo = this.tiposHoraExtra.find(
      (t) => t.codigo === codigo && t.activo,
    );
    if (!tipo) {
      throw new Error(
        `El tipo de hora extra ${codigo} no está configurado o está inactivo.`,
      );
    }
    return tipo;
  }

  private agregarFila(
    filas: FilaCalculo[],
    codigo: TipoHoraExtraCodigo,
    minutos: number,
    salarioHoraUsado: Decimal,
  ): void {
    const tipo = this.buscarTipo(codigo);
    const cantidadHoras = new Decimal(minutos).dividedBy(60);
    const monto = salarioHoraUsado
      .times(cantidadHoras)
      .times(tipo.multiplicador());

    filas.push({
      tipoHoraId: tipo.id,
      tipoHoraCodigo: tipo.codigo,
      cantidadHoras,
      porcentajeAplicado: tipo.porcentaje,
      salarioHoraUsado,
      monto,
    });
  }
}
