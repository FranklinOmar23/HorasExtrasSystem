import { Salario } from '../../../domain/entities/salario.entity';
import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import { diaAnterior } from '../../../domain/services/fecha.util';
import { EmpleadoRepository } from '../../ports/empleado.repository.port';
import {
  CrearSalarioDatos,
  SalarioRepository,
} from '../../ports/salario.repository.port';

export class CrearSalarioUseCase {
  constructor(
    private readonly empleadoRepository: EmpleadoRepository,
    private readonly salarioRepository: SalarioRepository,
  ) {}

  async ejecutar(
    empleadoId: string,
    datos: CrearSalarioDatos,
  ): Promise<Salario> {
    const empleado = await this.empleadoRepository.buscarPorId(empleadoId);
    if (!empleado) {
      throw new EmpleadoNoEncontradoError(empleadoId);
    }

    return this.salarioRepository.crear(
      empleadoId,
      datos,
      diaAnterior(datos.vigenteDesde),
    );
  }
}
