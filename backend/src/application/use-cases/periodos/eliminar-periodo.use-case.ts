import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoCerradoError } from '../../../domain/errors/periodo-cerrado.error';
import { PeriodoEliminadoError } from '../../../domain/errors/periodo-eliminado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { PeriodoRepository } from '../../ports/periodo.repository.port';

/**
 * Soft-delete: nunca borra la fila ni los registros/cálculos/importaciones
 * asociados (es historial de dinero), solo marca `eliminadoEn`/`eliminadoPorId`
 * y oculta el periodo de los listados. Restaurable dentro de 30 días
 * (ver RestaurarPeriodoUseCase).
 */
export class EliminarPeriodoUseCase {
  constructor(private readonly repository: PeriodoRepository) {}

  async ejecutar(id: string, eliminadoPorId: string): Promise<Periodo> {
    const periodo = await this.repository.buscarPorId(id);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(id);
    }
    if (periodo.estaCerrado()) {
      throw new PeriodoCerradoError(id);
    }
    if (periodo.estaEliminado()) {
      throw new PeriodoEliminadoError(id);
    }

    return this.repository.eliminar(id, eliminadoPorId, new Date());
  }
}
