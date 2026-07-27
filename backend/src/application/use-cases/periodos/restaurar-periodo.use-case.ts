import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoNoEliminadoError } from '../../../domain/errors/periodo-no-eliminado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { PeriodoRestauracionExpiradaError } from '../../../domain/errors/periodo-restauracion-expirada.error';
import { PeriodoRepository } from '../../ports/periodo.repository.port';

export const DIAS_LIMITE_RESTAURACION_PERIODO = 30;

function limiteRestauracion(eliminadoEn: Date): Date {
  const limite = new Date(eliminadoEn);
  limite.setDate(limite.getDate() + DIAS_LIMITE_RESTAURACION_PERIODO);
  return limite;
}

export class RestaurarPeriodoUseCase {
  constructor(private readonly repository: PeriodoRepository) {}

  async ejecutar(id: string): Promise<Periodo> {
    const periodo = await this.repository.buscarPorId(id);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(id);
    }
    if (!periodo.estaEliminado()) {
      throw new PeriodoNoEliminadoError(id);
    }

    if (new Date() > limiteRestauracion(periodo.eliminadoEn as Date)) {
      throw new PeriodoRestauracionExpiradaError(
        id,
        DIAS_LIMITE_RESTAURACION_PERIODO,
      );
    }

    return this.repository.restaurar(id);
  }
}
