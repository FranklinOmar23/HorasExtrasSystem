import { Salario } from '../../../domain/entities/salario.entity';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { CrearSalarioDatos, SalarioRepository } from '../../ports/salario.repository.port';
export declare class CrearSalarioUseCase {
    private readonly empleadoRepository;
    private readonly salarioRepository;
    constructor(empleadoRepository: EmpleadoRepository, salarioRepository: SalarioRepository);
    ejecutar(empleadoId: string, datos: CrearSalarioDatos): Promise<Salario>;
}
