import { Salario } from '../../../domain/entities/salario.entity';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { SalarioRepository } from '../../ports/salario.repository.port';
export declare class ListarSalariosUseCase {
    private readonly empleadoRepository;
    private readonly salarioRepository;
    constructor(empleadoRepository: EmpleadoRepository, salarioRepository: SalarioRepository);
    ejecutar(empleadoId: string): Promise<Salario[]>;
}
