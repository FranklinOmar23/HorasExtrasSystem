import { Empleado } from '../../../domain/entities/empleado.entity';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
export declare class ObtenerEmpleadoUseCase {
    private readonly empleadoRepository;
    constructor(empleadoRepository: EmpleadoRepository);
    ejecutar(id: string): Promise<Empleado>;
}
