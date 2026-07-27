import {
  AuditoriaConUsuario,
  AuditoriaRepository,
  FiltroAuditoria,
} from '../../ports/auditoria.repository.port';

export class ListarAuditoriaUseCase {
  constructor(private readonly repository: AuditoriaRepository) {}

  async ejecutar(filtro: FiltroAuditoria): Promise<AuditoriaConUsuario[]> {
    return this.repository.listar(filtro);
  }
}
