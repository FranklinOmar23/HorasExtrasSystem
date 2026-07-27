import { Global, Module } from '@nestjs/common';
import {
  AUDITORIA_REPOSITORY,
  AuditoriaRepository,
} from '../../application/ports/auditoria.repository.port';
import { ListarAuditoriaUseCase } from '../../application/use-cases/auditoria/listar-auditoria.use-case';
import { RegistrarAuditoriaUseCase } from '../../application/use-cases/auditoria/registrar-auditoria.use-case';
import { AuditoriaPrismaRepository } from '../../infrastructure/repositories/auditoria.prisma.repository';
import { AuditoriaController } from '../controllers/auditoria.controller';

/**
 * Global: RegistrarAuditoriaUseCase se inyecta desde los controladores de
 * casi todos los demás módulos (empleados, periodos, registros, etc.) para
 * dejar constancia de cada mutación; declararlo global evita que cada uno
 * tenga que importar este módulo explícitamente.
 */
@Global()
@Module({
  controllers: [AuditoriaController],
  providers: [
    { provide: AUDITORIA_REPOSITORY, useClass: AuditoriaPrismaRepository },
    {
      provide: RegistrarAuditoriaUseCase,
      useFactory: (repo: AuditoriaRepository) =>
        new RegistrarAuditoriaUseCase(repo),
      inject: [AUDITORIA_REPOSITORY],
    },
    {
      provide: ListarAuditoriaUseCase,
      useFactory: (repo: AuditoriaRepository) =>
        new ListarAuditoriaUseCase(repo),
      inject: [AUDITORIA_REPOSITORY],
    },
  ],
  exports: [RegistrarAuditoriaUseCase],
})
export class AuditoriaModule {}
