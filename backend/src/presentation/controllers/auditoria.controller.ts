import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ListarAuditoriaUseCase } from '../../application/use-cases/auditoria/listar-auditoria.use-case';
import { AuditoriaRespuestaDto } from '../dtos/auditoria/auditoria-respuesta.dto';
import { ListarAuditoriaQueryDto } from '../dtos/auditoria/listar-auditoria-query.dto';
import { aAuditoriaRespuestaDto } from '../mappers/auditoria.mapper';

@ApiTags('auditoria')
@ApiBearerAuth()
@Controller('auditoria')
export class AuditoriaController {
  constructor(
    @Inject(ListarAuditoriaUseCase)
    private readonly listarAuditoria: ListarAuditoriaUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Lista la bitácora de auditoría (quién hizo qué cambio y cuándo), con filtros opcionales',
  })
  @ApiResponse({ status: 200, type: [AuditoriaRespuestaDto] })
  async listar(
    @Query() query: ListarAuditoriaQueryDto,
  ): Promise<AuditoriaRespuestaDto[]> {
    const auditorias = await this.listarAuditoria.ejecutar({
      entidad: query.entidad,
      usuarioId: query.usuarioId,
      desde: query.desde ? new Date(query.desde) : undefined,
      hasta: query.hasta ? new Date(query.hasta) : undefined,
    });
    return auditorias.map(aAuditoriaRespuestaDto);
  }
}
