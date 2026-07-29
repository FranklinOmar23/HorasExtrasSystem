import Decimal from 'decimal.js';
import { TipoHoraExtra } from '../entities/tipo-hora-extra.entity';
import { TipoHoraExtraCodigo } from '../enums/tipo-hora-extra-codigo.enum';
import {
  MINUTOS_POR_DIA,
  entradaSalidaAjustadas,
  parsearHora,
  solapeMinutos,
} from './hora.util';

const DIA_DOMINGO = 0;
const DIA_SABADO = 6;

export interface ParametrosCalculo {
  /** Solo se usa en el modo "sin asignación explícita" (turno por defecto). */
  horasAlmuerzo: Decimal;
  inicioNocturna: string;
  finNocturna: string;
  toleranciaMinutos: number;
  /**
   * Redondeo "al más cercano" aplicado a la cantidad final de horas de CADA
   * tipo (HE_35, HE_100, FERIADO, NOCTURNA_15), en minutos: 0 = sin redondeo
   * (default), 15 o 30. Reproduce el hábito de la hoja de RRHH de anotar
   * horas en valores "limpios" (16:03→16h, 1:55→2h) — pero SIEMPRE sobre
   * minutos reales convertidos a horas decimales después de redondear, nunca
   * al revés: la hoja manual anota horas.minutos (3.48 = 3h48m) y los
   * multiplica como si fueran decimales (3.48h), pagando de menos. Ese bug
   * no se replica aquí (ver docs/02 §7).
   */
  redondeoMinutos: number;
}

/** Ventana de jornada del turno resuelto para el empleado en la fecha del registro. */
export interface VentanaTurno {
  horaInicio: string;
  horaFin: string;
  cruzaMedianoche: boolean;
  horasJornada: Decimal;
  descuentaAlmuerzo: boolean;
}

export interface EntradaMotorCalculo {
  /** Día de la entrada — el registro "pertenece" a este día (regla de negocio). */
  fecha: Date;
  horaEntrada: string;
  horaSalida: string;
  turno: VentanaTurno;
  /**
   * true si el turno viene de una AsignacionTurno vigente puesta por RRHH;
   * false si es el turno por defecto (DIURNO/SABADO) por no haber ninguna
   * asignación cubriendo la fecha. Cambia el mecanismo de exceso: ver
   * ResolucionTurno en resolver-turno-del-empleado.use-case.ts.
   */
  turnoAsignadoExplicitamente: boolean;
  esFeriadoDiaEntrada: boolean;
  /** Solo relevante si el trabajo cruza medianoche. */
  esFeriadoDiaSiguiente: boolean;
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

interface SegmentoDia {
  inicio: number;
  fin: number;
  diaSemana: number;
  esFeriado: boolean;
}

/**
 * Motor de cálculo de horas extra: clase pura y sin estado. Recibe un
 * registro, la ventana del turno vigente del empleado ese día y los
 * parámetros de cálculo, y devuelve el desglose a persistir en `calculos`.
 * No consulta ninguna base de datos.
 *
 * Dos mecanismos de exceso, según si el turno viene de una asignación
 * explícita o es el turno por defecto (ver `turnoAsignadoExplicitamente`):
 *
 * - SIN asignación explícita (DIURNO/SABADO por defecto): se preserva el
 *   cálculo histórico — total de horas NETAS trabajadas (descontado el
 *   almuerzo si aplica) contra el presupuesto del turno (`horasJornada`).
 *   El exceso no depende de EN QUÉ MOMENTO del día se trabajó, solo de
 *   cuánto en total. Domingo/feriado: todas las horas trabajadas ese día
 *   son HE_100/FERIADO (sin presupuesto).
 *
 * - CON asignación explícita (ej. NOCTURNO puesto por RRHH): el exceso se
 *   mide por POSICIÓN DE RELOJ contra el inicio/fin exacto de la ventana
 *   [horaInicio, horaFin] (si `cruzaMedianoche`, horaFin es del día
 *   siguiente). Horas dentro de la ventana = jornada normal, sin importar
 *   si caen en domingo/feriado (el cambio de turno ya es la compensación).
 *   Horas fuera de la ventana (antes del inicio o después del fin) = HE_35
 *   (laboral) o HE_100 (sábado), salvo que ese día calendario específico
 *   sea domingo o feriado, en cuyo caso TODAS las horas de ese día
 *   (dentro o fuera de la ventana) son HE_100/FERIADO — el domingo/feriado
 *   siempre lleva su recargo, incluso dentro de un turno asignado.
 *   Si el trabajo cruza medianoche, cada día calendario se clasifica por
 *   separado (regla 6): el día de la entrada y, si aplica, el siguiente.
 *
 * En ambos casos, el recargo nocturno (NOCTURNA_15) se calcula aparte y de
 * forma aditiva: toda hora trabajada dentro de la banda
 * [inicioNocturna, finNocturna) —que cruza medianoche— genera el recargo,
 * sea jornada normal o extra.
 *
 * Horas negativas se truncan a 0.
 *
 * Redondeo (`parametros.redondeoMinutos`, ver `ParametrosCalculo`): la
 * cantidad final de minutos de CADA fila (HE_35, HE_100, FERIADO,
 * NOCTURNA_15) se redondea "al más cercano" antes de convertir a horas
 * decimales y valorizar. Por defecto es 0 (sin redondeo, minutos exactos).
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

    if (entrada.turnoAsignadoExplicitamente) {
      this.clasificarConVentanaDeReloj(
        filas,
        entrada,
        parametros,
        entradaMin,
        salidaMin,
      );
    } else {
      this.clasificarConPresupuestoTotal(
        filas,
        entrada,
        parametros,
        minutosBrutos,
      );
    }

    this.agregarRecargoNocturno(filas, entrada, parametros, entradaMin, salidaMin);

    return filas;
  }

  /** Turno por defecto: total de horas netas contra presupuesto (cálculo histórico). */
  private clasificarConPresupuestoTotal(
    filas: FilaCalculo[],
    entrada: EntradaMotorCalculo,
    parametros: ParametrosCalculo,
    minutosBrutos: number,
  ): void {
    const diaSemana = entrada.fecha.getUTCDay();

    if (entrada.esFeriadoDiaEntrada) {
      this.agregarFila(
        filas,
        TipoHoraExtraCodigo.FERIADO,
        minutosBrutos,
        entrada.salarioHoraUsado,
        parametros,
      );
      return;
    }
    if (diaSemana === DIA_DOMINGO) {
      this.agregarFila(
        filas,
        TipoHoraExtraCodigo.HE_100,
        minutosBrutos,
        entrada.salarioHoraUsado,
        parametros,
      );
      return;
    }

    const minutosAlmuerzo = entrada.turno.descuentaAlmuerzo
      ? parametros.horasAlmuerzo.times(60).toNumber()
      : 0;
    const minutosNetos = Math.max(0, minutosBrutos - minutosAlmuerzo);
    const presupuesto =
      entrada.turno.horasJornada.times(60).toNumber() +
      parametros.toleranciaMinutos;
    const minutosExtra = Math.max(0, minutosNetos - presupuesto);
    if (minutosExtra > 0) {
      const codigo =
        diaSemana === DIA_SABADO
          ? TipoHoraExtraCodigo.HE_100
          : TipoHoraExtraCodigo.HE_35;
      this.agregarFila(
        filas,
        codigo,
        minutosExtra,
        entrada.salarioHoraUsado,
        parametros,
      );
    }
  }

  /** Turno asignado explícitamente: exceso por posición de reloj contra la ventana. */
  private clasificarConVentanaDeReloj(
    filas: FilaCalculo[],
    entrada: EntradaMotorCalculo,
    parametros: ParametrosCalculo,
    entradaMin: number,
    salidaMin: number,
  ): void {
    const diaSemanaEntrada = entrada.fecha.getUTCDay();
    const ventanaInicio = parsearHora(entrada.turno.horaInicio);
    let ventanaFin = parsearHora(entrada.turno.horaFin);
    if (entrada.turno.cruzaMedianoche) {
      ventanaFin += MINUTOS_POR_DIA;
    }

    const segmentos: SegmentoDia[] = [
      {
        inicio: entradaMin,
        fin: Math.min(salidaMin, MINUTOS_POR_DIA),
        diaSemana: diaSemanaEntrada,
        esFeriado: entrada.esFeriadoDiaEntrada,
      },
    ];
    if (salidaMin > MINUTOS_POR_DIA) {
      segmentos.push({
        inicio: MINUTOS_POR_DIA,
        fin: salidaMin,
        diaSemana: (diaSemanaEntrada + 1) % 7,
        esFeriado: entrada.esFeriadoDiaSiguiente,
      });
    }

    let excesoLaboralMinutos = 0;
    let tipoExcesoLaboral: TipoHoraExtraCodigo | null = null;

    for (const segmento of segmentos) {
      if (segmento.fin <= segmento.inicio) continue;

      if (segmento.esFeriado) {
        this.agregarFila(
          filas,
          TipoHoraExtraCodigo.FERIADO,
          segmento.fin - segmento.inicio,
          entrada.salarioHoraUsado,
          parametros,
        );
        continue;
      }
      if (segmento.diaSemana === DIA_DOMINGO) {
        this.agregarFila(
          filas,
          TipoHoraExtraCodigo.HE_100,
          segmento.fin - segmento.inicio,
          entrada.salarioHoraUsado,
          parametros,
        );
        continue;
      }

      const excesoAntes = Math.max(
        0,
        Math.min(segmento.fin, ventanaInicio) - segmento.inicio,
      );
      const excesoDespues = Math.max(
        0,
        segmento.fin - Math.max(segmento.inicio, ventanaFin),
      );
      const excesoSegmento = excesoAntes + excesoDespues;
      if (excesoSegmento > 0) {
        excesoLaboralMinutos += excesoSegmento;
        tipoExcesoLaboral ??=
          segmento.diaSemana === DIA_SABADO
            ? TipoHoraExtraCodigo.HE_100
            : TipoHoraExtraCodigo.HE_35;
      }
    }

    if (excesoLaboralMinutos > 0 && tipoExcesoLaboral) {
      const minutosConTolerancia = Math.max(
        0,
        excesoLaboralMinutos - parametros.toleranciaMinutos,
      );
      if (minutosConTolerancia > 0) {
        this.agregarFila(
          filas,
          tipoExcesoLaboral,
          minutosConTolerancia,
          entrada.salarioHoraUsado,
          parametros,
        );
      }
    }
  }

  /**
   * Banda nocturna [inicioNocturna, finNocturna) cruzando medianoche.
   * Se comprueba tanto la banda "de esta noche" (día de la entrada → día
   * siguiente) como la "de anoche" (día anterior → día de la entrada), para
   * cubrir turnos que empiezan de madrugada dentro de la cola de la banda
   * de la noche anterior (ej. entrar 03:00 sigue siendo nocturno).
   */
  private agregarRecargoNocturno(
    filas: FilaCalculo[],
    entrada: EntradaMotorCalculo,
    parametros: ParametrosCalculo,
    entradaMin: number,
    salidaMin: number,
  ): void {
    const bandaInicio = parsearHora(parametros.inicioNocturna);
    const bandaFin = parsearHora(parametros.finNocturna) + MINUTOS_POR_DIA;
    const minutosNocturnos =
      solapeMinutos(entradaMin, salidaMin, bandaInicio, bandaFin) +
      solapeMinutos(
        entradaMin,
        salidaMin,
        bandaInicio - MINUTOS_POR_DIA,
        bandaFin - MINUTOS_POR_DIA,
      );
    if (minutosNocturnos > 0) {
      this.agregarFila(
        filas,
        TipoHoraExtraCodigo.NOCTURNA_15,
        minutosNocturnos,
        entrada.salarioHoraUsado,
        parametros,
      );
    }
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

  /**
   * Redondea minutos "al más cercano" a un múltiplo de `redondeoMinutos"
   * (0 = sin redondeo). Se aplica siempre a MINUTOS, antes de convertir a
   * horas decimales — nunca sobre una cifra ya mezclada horas.minutos como
   * hace la hoja de RRHH (ver docs/02 §7).
   */
  private redondearMinutos(minutos: number, redondeoMinutos: number): number {
    if (redondeoMinutos <= 0) {
      return minutos;
    }
    return Math.round(minutos / redondeoMinutos) * redondeoMinutos;
  }

  private agregarFila(
    filas: FilaCalculo[],
    codigo: TipoHoraExtraCodigo,
    minutosCrudos: number,
    salarioHoraUsado: Decimal,
    parametros: ParametrosCalculo,
  ): void {
    const minutos = this.redondearMinutos(
      minutosCrudos,
      parametros.redondeoMinutos,
    );
    if (minutos <= 0) {
      return;
    }

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
