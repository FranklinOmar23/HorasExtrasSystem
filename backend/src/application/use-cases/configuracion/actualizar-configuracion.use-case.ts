import { ConfiguracionRepository } from '../../ports/configuracion.repository.port';

export class ActualizarConfiguracionUseCase {
  constructor(private readonly repository: ConfiguracionRepository) {}

  async ejecutar(
    cambios: Record<string, string>,
  ): Promise<Record<string, string>> {
    return this.repository.actualizar(cambios);
  }
}
