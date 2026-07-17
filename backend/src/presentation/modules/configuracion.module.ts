import { Module } from '@nestjs/common';
import { CONFIGURACION_REPOSITORY } from '../../application/ports/configuracion.repository.port';
import type { ConfiguracionRepository } from '../../application/ports/configuracion.repository.port';
import { FERIADO_REPOSITORY } from '../../application/ports/feriado.repository.port';
import type { FeriadoRepository } from '../../application/ports/feriado.repository.port';
import { TIPO_HORA_EXTRA_REPOSITORY } from '../../application/ports/tipo-hora-extra.repository.port';
import type { TipoHoraExtraRepository } from '../../application/ports/tipo-hora-extra.repository.port';
import { ActualizarConfiguracionUseCase } from '../../application/use-cases/configuracion/actualizar-configuracion.use-case';
import { ObtenerConfiguracionUseCase } from '../../application/use-cases/configuracion/obtener-configuracion.use-case';
import { CrearFeriadoUseCase } from '../../application/use-cases/feriados/crear-feriado.use-case';
import { EliminarFeriadoUseCase } from '../../application/use-cases/feriados/eliminar-feriado.use-case';
import { ListarFeriadosUseCase } from '../../application/use-cases/feriados/listar-feriados.use-case';
import { ActualizarTipoHoraExtraUseCase } from '../../application/use-cases/tipos-hora-extra/actualizar-tipo-hora-extra.use-case';
import { ListarTiposHoraExtraUseCase } from '../../application/use-cases/tipos-hora-extra/listar-tipos-hora-extra.use-case';
import { ConfiguracionPrismaRepository } from '../../infrastructure/repositories/configuracion.prisma.repository';
import { FeriadoPrismaRepository } from '../../infrastructure/repositories/feriado.prisma.repository';
import { TipoHoraExtraPrismaRepository } from '../../infrastructure/repositories/tipo-hora-extra.prisma.repository';
import { ConfiguracionController } from '../controllers/configuracion.controller';
import { FeriadosController } from '../controllers/feriados.controller';
import { TiposHoraExtraController } from '../controllers/tipos-hora-extra.controller';

@Module({
  controllers: [
    ConfiguracionController,
    TiposHoraExtraController,
    FeriadosController,
  ],
  providers: [
    {
      provide: CONFIGURACION_REPOSITORY,
      useClass: ConfiguracionPrismaRepository,
    },
    {
      provide: TIPO_HORA_EXTRA_REPOSITORY,
      useClass: TipoHoraExtraPrismaRepository,
    },
    { provide: FERIADO_REPOSITORY, useClass: FeriadoPrismaRepository },
    {
      provide: ObtenerConfiguracionUseCase,
      useFactory: (repo: ConfiguracionRepository) =>
        new ObtenerConfiguracionUseCase(repo),
      inject: [CONFIGURACION_REPOSITORY],
    },
    {
      provide: ActualizarConfiguracionUseCase,
      useFactory: (repo: ConfiguracionRepository) =>
        new ActualizarConfiguracionUseCase(repo),
      inject: [CONFIGURACION_REPOSITORY],
    },
    {
      provide: ListarTiposHoraExtraUseCase,
      useFactory: (repo: TipoHoraExtraRepository) =>
        new ListarTiposHoraExtraUseCase(repo),
      inject: [TIPO_HORA_EXTRA_REPOSITORY],
    },
    {
      provide: ActualizarTipoHoraExtraUseCase,
      useFactory: (repo: TipoHoraExtraRepository) =>
        new ActualizarTipoHoraExtraUseCase(repo),
      inject: [TIPO_HORA_EXTRA_REPOSITORY],
    },
    {
      provide: ListarFeriadosUseCase,
      useFactory: (repo: FeriadoRepository) => new ListarFeriadosUseCase(repo),
      inject: [FERIADO_REPOSITORY],
    },
    {
      provide: CrearFeriadoUseCase,
      useFactory: (repo: FeriadoRepository) => new CrearFeriadoUseCase(repo),
      inject: [FERIADO_REPOSITORY],
    },
    {
      provide: EliminarFeriadoUseCase,
      useFactory: (repo: FeriadoRepository) => new EliminarFeriadoUseCase(repo),
      inject: [FERIADO_REPOSITORY],
    },
  ],
  exports: [CONFIGURACION_REPOSITORY, TIPO_HORA_EXTRA_REPOSITORY, FERIADO_REPOSITORY],
})
export class ConfiguracionModule {}
