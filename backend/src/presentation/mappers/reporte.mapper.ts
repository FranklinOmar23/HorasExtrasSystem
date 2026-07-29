import Decimal from 'decimal.js';
import { HistoricoPeriodo } from '../../application/use-cases/reportes/obtener-reporte-historico.use-case';
import { ReporteEmpleadoPeriodo } from '../../application/use-cases/reportes/obtener-reporte-empleado.use-case';
import {
  DesgloseTipoHora,
  FilaReportePeriodo,
  ReportePeriodo,
} from '../../application/services/reporte-periodo.service';
import { DesgloseTipoHoraDto } from '../dtos/reportes/desglose-tipo-hora.dto';
import { DiaReporteEmpleadoDto } from '../dtos/reportes/dia-reporte-empleado.dto';
import { FilaReportePeriodoDto } from '../dtos/reportes/fila-reporte-periodo.dto';
import { HistoricoPeriodoDto } from '../dtos/reportes/historico-periodo.dto';
import { ReporteEmpleadoRespuestaDto } from '../dtos/reportes/reporte-empleado-respuesta.dto';
import { ReportePeriodoRespuestaDto } from '../dtos/reportes/reporte-periodo-respuesta.dto';
import { aCalculoRespuestaDto } from './registro-horas.mapper';
import { aPeriodoRespuestaDto } from './periodo.mapper';

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

function aDesgloseDto(desglose: DesgloseTipoHora): DesgloseTipoHoraDto {
  return {
    he35: desglose.he35.toFixed(2),
    he100: desglose.he100.toFixed(2),
    nocturna: desglose.nocturna.toFixed(2),
    feriado: desglose.feriado.toFixed(2),
  };
}

function aFilaDto(fila: FilaReportePeriodo): FilaReportePeriodoDto {
  return {
    empleado: fila.empleado,
    salarioHora: fila.salarioHora.toFixed(4),
    horas: aDesgloseDto(fila.horas),
    montos: aDesgloseDto(fila.montos),
    total: fila.total.toFixed(2),
    retroactivo: {
      dias: fila.retroactivo.dias,
      monto: fila.retroactivo.monto.toFixed(2),
    },
  };
}

export function aReportePeriodoRespuestaDto(
  reporte: ReportePeriodo,
): ReportePeriodoRespuestaDto {
  return {
    periodo: aPeriodoRespuestaDto(reporte.periodo),
    filas: reporte.filas.map(aFilaDto),
    granTotal: reporte.granTotal.toFixed(2),
  };
}

export function aReporteEmpleadoRespuestaDto(
  reporte: ReporteEmpleadoPeriodo,
): ReporteEmpleadoRespuestaDto {
  const dias: DiaReporteEmpleadoDto[] = reporte.registros
    .slice()
    .sort((a, b) => a.registro.fecha.getTime() - b.registro.fecha.getTime())
    .map(({ registro, calculos, turno }) => ({
      fecha: aFechaISO(registro.fecha),
      horaEntrada: registro.horaEntrada,
      horaSalida: registro.horaSalida,
      turnoCodigo: turno.codigo,
      turnoNombre: turno.nombre,
      calculos: calculos.map(aCalculoRespuestaDto),
      total: calculos
        .reduce((acumulado, c) => acumulado.plus(c.monto), new Decimal(0))
        .toFixed(2),
      esRetroactivo: registro.esRetroactivo,
    }));

  return {
    periodo: aPeriodoRespuestaDto(reporte.periodo),
    empleado: reporte.fila.empleado,
    salarioHora: reporte.fila.salarioHora.toFixed(4),
    dias,
    horas: aDesgloseDto(reporte.fila.horas),
    montos: aDesgloseDto(reporte.fila.montos),
    total: reporte.fila.total.toFixed(2),
  };
}

export function aHistoricoPeriodoDto(
  historico: HistoricoPeriodo,
): HistoricoPeriodoDto {
  return {
    periodo: aPeriodoRespuestaDto(historico.periodo),
    granTotal: historico.granTotal.toFixed(2),
  };
}
