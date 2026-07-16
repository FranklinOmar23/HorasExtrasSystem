import { DomainError } from '../../../domain/errors/domain.error';
import { Empleado } from '../../../domain/entities/empleado.entity';
import {
  CrearEmpleadoDatos,
  EmpleadoRepository,
} from '../../ports/empleado.repository.port';

export class EmpleadoCodigoDuplicadoError extends DomainError {
  readonly code = 'EMPLEADO_CODIGO_DUPLICADO';

  constructor(codigo: string) {
    super(`Ya existe un empleado con el código ${codigo}.`);
  }
}

export class CrearEmpleadoUseCase {
  constructor(private readonly empleadoRepository: EmpleadoRepository) {}

  async ejecutar(datos: CrearEmpleadoDatos): Promise<Empleado> {
    const existente = await this.empleadoRepository.buscarPorCodigo(
      datos.codigo,
    );
    if (existente) {
      throw new EmpleadoCodigoDuplicadoError(datos.codigo);
    }

    return this.empleadoRepository.crear(datos);
  }
}
