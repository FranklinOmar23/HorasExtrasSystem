import { Module } from '@nestjs/common';
import { PERIODO_REPOSITORY } from '../../application/ports/periodo.repository.port';
import type { PeriodoRepository } from '../../application/ports/periodo.repository.port';
import { CerrarPeriodoUseCase } from '../../application/use-cases/periodos/cerrar-periodo.use-case';
import { CrearPeriodoUseCase } from '../../application/use-cases/periodos/crear-periodo.use-case';
import { ListarPeriodosUseCase } from '../../application/use-cases/periodos/listar-periodos.use-case';
import { ObtenerPeriodoUseCase } from '../../application/use-cases/periodos/obtener-periodo.use-case';
import { PeriodoPrismaRepository } from '../../infrastructure/repositories/periodo.prisma.repository';
import { PeriodosController } from '../controllers/periodos.controller';

@Module({
  controllers: [PeriodosController],
  providers: [
    { provide: PERIODO_REPOSITORY, useClass: PeriodoPrismaRepository },
    {
      provide: ListarPeriodosUseCase,
      useFactory: (repo: PeriodoRepository) => new ListarPeriodosUseCase(repo),
      inject: [PERIODO_REPOSITORY],
    },
    {
      provide: ObtenerPeriodoUseCase,
      useFactory: (repo: PeriodoRepository) => new ObtenerPeriodoUseCase(repo),
      inject: [PERIODO_REPOSITORY],
    },
    {
      provide: CrearPeriodoUseCase,
      useFactory: (repo: PeriodoRepository) => new CrearPeriodoUseCase(repo),
      inject: [PERIODO_REPOSITORY],
    },
    {
      provide: CerrarPeriodoUseCase,
      useFactory: (repo: PeriodoRepository) => new CerrarPeriodoUseCase(repo),
      inject: [PERIODO_REPOSITORY],
    },
  ],
  exports: [PERIODO_REPOSITORY],
})
export class PeriodosModule {}
