import { Empleado } from '../../../domain/entities/empleado.entity';
import { EmpleadoRepository, FiltroEmpleados } from '../../ports/empleado.repository.port';
export declare class ListarEmpleadosUseCase {
    private readonly empleadoRepository;
    constructor(empleadoRepository: EmpleadoRepository);
    ejecutar(filtro: FiltroEmpleados): Promise<Empleado[]>;
}
