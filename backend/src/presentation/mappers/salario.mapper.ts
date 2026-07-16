import { Salario } from '../../domain/entities/salario.entity';
import { SalarioRespuestaDto } from '../dtos/salarios/salario-respuesta.dto';

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

export function aSalarioRespuestaDto(salario: Salario): SalarioRespuestaDto {
  return {
    id: salario.id,
    empleadoId: salario.empleadoId,
    montoMensual: salario.montoMensual.toFixed(2),
    vigenteDesde: aFechaISO(salario.vigenteDesde),
    vigenteHasta: salario.vigenteHasta ? aFechaISO(salario.vigenteHasta) : null,
  };
}
