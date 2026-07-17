import { Empleado } from '../../../domain/entities/empleado.entity';
import { ActualizarEmpleadoDatos, EmpleadoRepository } from '../../ports/empleado.repository.port';
export declare class ActualizarEmpleadoUseCase {
    private readonly empleadoRepository;
    constructor(empleadoRepository: EmpleadoRepository);
    ejecutar(id: string, datos: ActualizarEmpleadoDatos): Promise<Empleado>;
}
