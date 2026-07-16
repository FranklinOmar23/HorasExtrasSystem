import { DomainError } from '../../../domain/errors/domain.error';
import { Empleado } from '../../../domain/entities/empleado.entity';
import { CrearEmpleadoDatos, EmpleadoRepository } from '../../ports/empleado.repository.port';
export declare class EmpleadoCodigoDuplicadoError extends DomainError {
    readonly code = "EMPLEADO_CODIGO_DUPLICADO";
    constructor(codigo: string);
}
export declare class CrearEmpleadoUseCase {
    private readonly empleadoRepository;
    constructor(empleadoRepository: EmpleadoRepository);
    ejecutar(datos: CrearEmpleadoDatos): Promise<Empleado>;
}
