import { Empleado } from '../../../domain/entities/empleado.entity';
import {
  EmpleadoRepository,
  FiltroEmpleados,
} from '../../ports/empleado.repository.port';

export class ListarEmpleadosUseCase {
  constructor(private readonly empleadoRepository: EmpleadoRepository) {}

  async ejecutar(filtro: FiltroEmpleados): Promise<Empleado[]> {
    return this.empleadoRepository.listar(filtro);
  }
}
