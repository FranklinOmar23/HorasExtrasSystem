import { Empleado } from '../../../domain/entities/empleado.entity';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
export declare class ListarEmpleadosUseCase {
    private readonly empleadoRepository;
    constructor(empleadoRepository: EmpleadoRepository);
    ejecutar(): Promise<Empleado[]>;
}
