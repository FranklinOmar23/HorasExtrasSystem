import { Feriado } from '../../../domain/entities/feriado.entity';
import { FeriadoFechaDuplicadaError } from '../../../domain/errors/feriado-fecha-duplicada.error';
import {
  CrearFeriadoDatos,
  FeriadoRepository,
} from '../../ports/feriado.repository.port';

export class CrearFeriadoUseCase {
  constructor(private readonly repository: FeriadoRepository) {}

  async ejecutar(datos: CrearFeriadoDatos): Promise<Feriado> {
    const existente = await this.repository.buscarPorFecha(datos.fecha);
    if (existente) {
      throw new FeriadoFechaDuplicadaError(
        datos.fecha.toISOString().slice(0, 10),
      );
    }
    return this.repository.crear(datos);
  }
}
