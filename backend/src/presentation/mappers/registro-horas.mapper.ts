import { Calculo } from '../../domain/entities/calculo.entity';
import { RegistroConCalculos } from '../../application/ports/registro-horas.repository.port';
import { FilaCalculo } from '../../domain/services/motor-calculo';
import { CalculoRespuestaDto } from '../dtos/registros/calculo-respuesta.dto';
import { RegistroRespuestaDto } from '../dtos/registros/registro-respuesta.dto';

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

export function aCalculoRespuestaDto(calculo: Calculo): CalculoRespuestaDto {
  return {
    tipoHoraCodigo: calculo.tipoHoraCodigo,
    cantidadHoras: calculo.cantidadHoras.toFixed(4),
    porcentajeAplicado: calculo.porcentajeAplicado.toFixed(2),
    salarioHoraUsado: calculo.salarioHoraUsado.toFixed(4),
    monto: calculo.monto.toFixed(2),
  };
}

export function aFilaCalculoRespuestaDto(
  fila: FilaCalculo,
): CalculoRespuestaDto {
  return {
    tipoHoraCodigo: fila.tipoHoraCodigo,
    cantidadHoras: fila.cantidadHoras.toFixed(4),
    porcentajeAplicado: fila.porcentajeAplicado.toFixed(2),
    salarioHoraUsado: fila.salarioHoraUsado.toFixed(4),
    monto: fila.monto.toFixed(2),
  };
}

export function aRegistroRespuestaDto(
  registroConCalculos: RegistroConCalculos,
): RegistroRespuestaDto {
  const { registro, calculos } = registroConCalculos;
  return {
    id: registro.id,
    periodoId: registro.periodoId,
    empleadoId: registro.empleadoId,
    fecha: aFechaISO(registro.fecha),
    horaEntrada: registro.horaEntrada,
    horaSalida: registro.horaSalida,
    origen: registro.origen,
    comentario: registro.comentario,
    calculos: calculos.map(aCalculoRespuestaDto),
  };
}
