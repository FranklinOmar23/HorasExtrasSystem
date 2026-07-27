import { Auditoria } from '../../../domain/entities/auditoria.entity';
import {
  AuditoriaRepository,
  RegistrarAuditoriaDatos,
} from '../../ports/auditoria.repository.port';

export class RegistrarAuditoriaUseCase {
  constructor(private readonly repository: AuditoriaRepository) {}

  async ejecutar(datos: RegistrarAuditoriaDatos): Promise<Auditoria> {
    return this.repository.registrar(datos);
  }
}
