import { Empleado } from '../../../domain/entities/empleado.entity';
import { EmpleadoCedulaDuplicadaError } from '../../../domain/errors/empleado-cedula-duplicada.error';
import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import {
  ActualizarEmpleadoDatos,
  EmpleadoRepository,
} from '../../ports/empleado.repository.port';

export class ActualizarEmpleadoUseCase {
  constructor(private readonly empleadoRepository: EmpleadoRepository) {}

  async ejecutar(
    id: string,
    datos: ActualizarEmpleadoDatos,
  ): Promise<Empleado> {
    const empleado = await this.empleadoRepository.buscarPorId(id);
    if (!empleado) {
      throw new EmpleadoNoEncontradoError(id);
    }

    if (datos.cedula && datos.cedula !== empleado.cedula) {
      const cedulaExistente = await this.empleadoRepository.buscarPorCedula(
        datos.cedula,
      );
      if (cedulaExistente) {
        throw new EmpleadoCedulaDuplicadaError(datos.cedula);
      }
    }

    return this.empleadoRepository.actualizar(id, datos);
  }
}
