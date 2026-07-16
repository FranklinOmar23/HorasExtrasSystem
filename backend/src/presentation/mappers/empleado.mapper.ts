import { Empleado } from '../../domain/entities/empleado.entity';
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
