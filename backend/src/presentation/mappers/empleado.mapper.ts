import { Empleado } from '../../domain/entities/empleado.entity';
import { EmpleadoConSalario } from '../../application/ports/empleado.repository.port';
import { ResultadoListarEmpleados } from '../../application/use-cases/empleados/listar-empleados.use-case';
import {
  EmpleadoListaRespuestaDto,
  EmpleadosPaginadosRespuestaDto,
} from '../dtos/empleados/empleado-lista-respuesta.dto';
import { EmpleadoRespuestaDto } from '../dtos/empleados/empleado-respuesta.dto';

export function aEmpleadoRespuestaDto(
  empleado: Empleado,
): EmpleadoRespuestaDto {
  return {
    id: empleado.id,
    codigo: empleado.codigo,
    nombre: empleado.nombre,
    cedula: empleado.cedula,
    posicion: empleado.posicion,
    activo: empleado.activo,
  };
}

function aEmpleadoListaRespuestaDto(
  fila: EmpleadoConSalario,
): EmpleadoListaRespuestaDto {
  return {
    id: fila.id,
    codigo: fila.codigo,
    nombre: fila.nombre,
    cedula: fila.cedula,
    posicion: fila.posicion,
    activo: fila.activo,
    montoMensualVigente: fila.montoMensualVigente?.toFixed(2) ?? null,
  };
}

export function aEmpleadosPaginadosRespuestaDto(
  resultado: ResultadoListarEmpleados,
): EmpleadosPaginadosRespuestaDto {
  return {
    items: resultado.items.map(aEmpleadoListaRespuestaDto),
    total: resultado.total,
    pagina: resultado.pagina,
    porPagina: resultado.porPagina,
    totalPaginas: resultado.totalPaginas,
  };
}
