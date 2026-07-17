import { Periodo } from '../../../domain/entities/periodo.entity';
import { PeriodoFechasDuplicadasError } from '../../../domain/errors/periodo-fechas-duplicadas.error';
import { PeriodoRangoFechasInvalidoError } from '../../../domain/errors/periodo-rango-fechas-invalido.error';
import {
  CrearPeriodoDatos,
  PeriodoRepository,
} from '../../ports/periodo.repository.port';

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

export class CrearPeriodoUseCase {
  constructor(private readonly repository: PeriodoRepository) {}

  async ejecutar(datos: CrearPeriodoDatos): Promise<Periodo> {
    if (datos.fechaFin < datos.fechaInicio) {
      throw new PeriodoRangoFechasInvalidoError();
    }

    const existente = await this.repository.buscarPorFechas(
      datos.fechaInicio,
      datos.fechaFin,
    );
    if (existente) {
      throw new PeriodoFechasDuplicadasError(
        aFechaISO(datos.fechaInicio),
        aFechaISO(datos.fechaFin),
      );
    }

    return this.repository.crear(datos);
  }
}
