import Decimal from 'decimal.js';
import { TipoHoraExtra } from '../../../domain/entities/tipo-hora-extra.entity';
import { ModoValorizacion } from '../../../domain/enums/modo-valorizacion.enum';
import { TipoHoraExtraCodigo } from '../../../domain/enums/tipo-hora-extra-codigo.enum';
import { TipoHoraExtraNoEncontradoError } from '../../../domain/errors/tipo-hora-extra-no-encontrado.error';
import {
  ActualizarTipoHoraExtraDatos,
  TipoHoraExtraRepository,
} from '../../ports/tipo-hora-extra.repository.port';
import { ActualizarTipoHoraExtraUseCase } from './actualizar-tipo-hora-extra.use-case';

const TIPO = new TipoHoraExtra(
  'tipo-1',
  TipoHoraExtraCodigo.HE_35,
  'Hora extra 35%',
  new Decimal('35.00'),
  ModoValorizacion.COMPLETA,
  true,
);

class TipoHoraExtraRepositoryFake implements TipoHoraExtraRepository {
  constructor(private readonly tipos: TipoHoraExtra[] = []) {}

  listar(): Promise<TipoHoraExtra[]> {
    return Promise.resolve(this.tipos);
  }

  buscarPorId(id: string): Promise<TipoHoraExtra | null> {
    return Promise.resolve(this.tipos.find((t) => t.id === id) ?? null);
  }

  actualizar(
    id: string,
    datos: ActualizarTipoHoraExtraDatos,
  ): Promise<TipoHoraExtra> {
    const actual = this.tipos.find((t) => t.id === id);
    if (!actual) {
      return Promise.reject(new Error('no encontrado'));
    }
    return Promise.resolve(
      new TipoHoraExtra(
        actual.id,
        actual.codigo,
        datos.nombre ?? actual.nombre,
        datos.porcentaje ?? actual.porcentaje,
        datos.modoValorizacion ?? actual.modoValorizacion,
        datos.activo ?? actual.activo,
      ),
    );
  }
}

describe('ActualizarTipoHoraExtraUseCase', () => {
  it('actualiza el porcentaje de un tipo existente', async () => {
    const useCase = new ActualizarTipoHoraExtraUseCase(
      new TipoHoraExtraRepositoryFake([TIPO]),
    );

    const actualizado = await useCase.ejecutar(TIPO.id, {
      porcentaje: new Decimal('40.00'),
    });

    expect(actualizado.porcentaje.toString()).toBe('40');
  });

  it('lanza TipoHoraExtraNoEncontradoError si el id no existe', async () => {
    const useCase = new ActualizarTipoHoraExtraUseCase(
      new TipoHoraExtraRepositoryFake([]),
    );

    await expect(
      useCase.ejecutar('inexistente', { activo: false }),
    ).rejects.toBeInstanceOf(TipoHoraExtraNoEncontradoError);
  });
});
