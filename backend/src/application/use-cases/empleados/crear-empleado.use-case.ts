import { Empleado } from '../../../domain/entities/empleado.entity';
import { EmpleadoCedulaDuplicadaError } from '../../../domain/errors/empleado-cedula-duplicada.error';
import { EmpleadoCodigoDuplicadoError } from '../../../domain/errors/empleado-codigo-duplicado.error';
import {
  CrearEmpleadoDatos,
  EmpleadoRepository,
} from '../../ports/empleado.repository.port';

export class CrearEmpleadoUseCase {
  constructor(private readonly empleadoRepository: EmpleadoRepository) {}

  async ejecutar(datos: CrearEmpleadoDatos): Promise<Empleado> {
    const codigoExistente = await this.empleadoRepository.buscarPorCodigo(
      datos.codigo,
    );
    if (codigoExistente) {
      throw new EmpleadoCodigoDuplicadoError(datos.codigo);
    }

    if (datos.cedula) {
      const cedulaExistente = await this.empleadoRepository.buscarPorCedula(
        datos.cedula,
      );
      if (cedulaExistente) {
        throw new EmpleadoCedulaDuplicadaError(datos.cedula);
      }
    }

    return this.empleadoRepository.crear(datos);
  }
}
