import { Empleado } from '../../../domain/entities/empleado.entity';
import { CrearEmpleadoDatos, EmpleadoRepository } from '../../ports/empleado.repository.port';
export declare class CrearEmpleadoUseCase {
    private readonly empleadoRepository;
    constructor(empleadoRepository: EmpleadoRepository);
    ejecutar(datos: CrearEmpleadoDatos): Promise<Empleado>;
}
