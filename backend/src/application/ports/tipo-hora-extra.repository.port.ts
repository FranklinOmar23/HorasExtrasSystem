import Decimal from 'decimal.js';
import { TipoHoraExtra } from '../../domain/entities/tipo-hora-extra.entity';
import { ModoValorizacion } from '../../domain/enums/modo-valorizacion.enum';

export const TIPO_HORA_EXTRA_REPOSITORY = Symbol('TIPO_HORA_EXTRA_REPOSITORY');

export interface ActualizarTipoHoraExtraDatos {
  nombre?: string;
  porcentaje?: Decimal;
  modoValorizacion?: ModoValorizacion;
  activo?: boolean;
}

export interface TipoHoraExtraRepository {
  listar(): Promise<TipoHoraExtra[]>;
  buscarPorId(id: string): Promise<TipoHoraExtra | null>;
  actualizar(
    id: string,
    datos: ActualizarTipoHoraExtraDatos,
  ): Promise<TipoHoraExtra>;
}
