import { Salario } from '../../../domain/entities/salario.entity';
import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import { SalarioRepository } from '../../ports/salario.repository.port';

export class ListarSalariosUseCase {
  constructor(
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly salarioRepository: SalarioRepository,
  ) {}

  async ejecutar(empleadoId: string): Promise<Salario[]> {
    const empleado = await this.empleadoRepository.buscarPorId(empleadoId);
    if (!empleado) {
      throw new EmpleadoNoEncontradoError(empleadoId);
    }
    return this.salarioRepository.listarPorEmpleado(empleadoId);
  }
}
