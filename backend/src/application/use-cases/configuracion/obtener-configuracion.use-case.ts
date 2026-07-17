import { ConfiguracionRepository } from '../../ports/configuracion.repository.port';

export class ObtenerConfiguracionUseCase {
  constructor(private readonly repository: ConfiguracionRepository) {}

  async ejecutar(): Promise<Record<string, string>> {
    return this.repository.obtenerTodos();
  }
}
