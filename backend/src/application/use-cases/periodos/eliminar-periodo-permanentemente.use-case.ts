import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoNoEliminadoError } from '../../../domain/errors/periodo-no-eliminado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { PeriodoRepository } from '../../ports/periodo.repository.port';

/**
 * Borra físicamente un periodo ya eliminado (soft-delete) y todo su
 * historial asociado (registros, cálculos, importaciones). Irreversible —
 * a diferencia de EliminarPeriodoUseCase, aquí no hay papelera ni plazo de
 * restauración. Solo aplica a periodos que ya están en la papelera: no se
 * puede saltar el soft-delete y borrar un periodo activo de un solo golpe.
 */
export class EliminarPeriodoPermanentementeUseCase {
  constructor(private readonly repository: PeriodoRepository) {}

  async ejecutar(id: string): Promise<Periodo> {
    const periodo = await this.repository.buscarPorId(id);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(id);
    }
    if (!periodo.estaEliminado()) {
      throw new PeriodoNoEliminadoError(id);
    }

    await this.repository.eliminarPermanentemente(id);
    return periodo;
  }
}
