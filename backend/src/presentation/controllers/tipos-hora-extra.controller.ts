import { Body, Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import Decimal from 'decimal.js';
import { ActualizarTipoHoraExtraUseCase } from '../../application/use-cases/tipos-hora-extra/actualizar-tipo-hora-extra.use-case';
import { ListarTiposHoraExtraUseCase } from '../../application/use-cases/tipos-hora-extra/listar-tipos-hora-extra.use-case';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
import { Roles } from '../decorators/roles.decorator';
import { ActualizarTipoHoraExtraDto } from '../dtos/tipos-hora-extra/actualizar-tipo-hora-extra.dto';
import { TipoHoraExtraRespuestaDto } from '../dtos/tipos-hora-extra/tipo-hora-extra-respuesta.dto';
import { aTipoHoraExtraRespuestaDto } from '../mappers/tipo-hora-extra.mapper';

@ApiTags('tipos-hora-extra')
@ApiBearerAuth()
@Controller('tipos-hora-extra')
export class TiposHoraExtraController {
  constructor(
    @Inject(ListarTiposHoraExtraUseCase)
    private readonly listarTipos: ListarTiposHoraExtraUseCase,
    @Inject(ActualizarTipoHoraExtraUseCase)
    private readonly actualizarTipo: ActualizarTipoHoraExtraUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista los tipos de hora extra y su porcentaje' })
  @ApiResponse({ status: 200, type: [TipoHoraExtraRespuestaDto] })
  async listar(): Promise<TipoHoraExtraRespuestaDto[]> {
    const tipos = await this.listarTipos.ejecutar();
    return tipos.map(aTipoHoraExtraRespuestaDto);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Actualiza un tipo de hora extra (solo ADMIN)' })
  @ApiResponse({ status: 200, type: TipoHoraExtraRespuestaDto })
  @ApiResponse({ status: 404, description: 'Tipo de hora extra no encontrado' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarTipoHoraExtraDto,
  ): Promise<TipoHoraExtraRespuestaDto> {
    const tipo = await this.actualizarTipo.ejecutar(id, {
      nombre: dto.nombre,
      porcentaje:
        dto.porcentaje !== undefined ? new Decimal(dto.porcentaje) : undefined,
      activo: dto.activo,
    });
    return aTipoHoraExtraRespuestaDto(tipo);
  }
}
