import { PeriodoRepository } from '../ports/periodo.repository.port';
import { RegistroHorasRepository } from '../ports/registro-horas.repository.port';

export interface RegistroDuplicado {
  registroId: string;
  periodoId: string;
  periodoFechaInicio: Date;
  periodoFechaFin: Date;
}

/**
 * Busca si ya existe un registro del mismo empleado en la misma fecha real,
 * en CUALQUIER otro periodo (incluidos cerrados). Usado exclusivamente para
 * registros retroactivos (fecha fuera del rango del periodo al que se
 * adjuntan): un registro con fecha dentro de su propio periodo ya está
 * cubierto por la validación de duplicados dentro del mismo periodo.
 */
export class BuscarRegistroDuplicadoService {
  constructor(
    private readonly registroHorasRepository: RegistroHorasRepository,
    private readonly periodoRepository: PeriodoRepository,
  ) {}

  async buscar(
    empleadoId: string,
    fecha: Date,
    excluirRegistroId?: string,
  ): Promise<RegistroDuplicado | null> {
    const existente = await this.registroHorasRepository.buscarPorEmpleadoYFecha(
      empleadoId,
      fecha,
    );
    if (!existente || existente.registro.id === excluirRegistroId) {
      return null;
    }

    const periodo = await this.periodoRepository.buscarPorId(
      existente.registro.periodoId,
    );
    if (!periodo) {
      return null;
    }

    return {
      registroId: existente.registro.id,
      periodoId: periodo.id,
      periodoFechaInicio: periodo.fechaInicio,
      periodoFechaFin: periodo.fechaFin,
    };
  }
}
