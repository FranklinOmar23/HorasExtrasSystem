import { Body, Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import Decimal from 'decimal.js';
import { RegistrarAuditoriaUseCase } from '../../application/use-cases/auditoria/registrar-auditoria.use-case';
import { ActualizarTipoHoraExtraUseCase } from '../../application/use-cases/tipos-hora-extra/actualizar-tipo-hora-extra.use-case';
import { ListarTiposHoraExtraUseCase } from '../../application/use-cases/tipos-hora-extra/listar-tipos-hora-extra.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { AccionAuditoria } from '../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../domain/enums/entidad-auditoria.enum';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
import { Roles } from '../decorators/roles.decorator';
import { UsuarioActual } from '../decorators/usuario-actual.decorator';
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
    @Inject(RegistrarAuditoriaUseCase)
    private readonly registrarAuditoria: RegistrarAuditoriaUseCase,
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
    @UsuarioActual() usuario: Usuario,
  ): Promise<TipoHoraExtraRespuestaDto> {
    const tipo = await this.actualizarTipo.ejecutar(id, {
      nombre: dto.nombre,
      porcentaje:
        dto.porcentaje !== undefined ? new Decimal(dto.porcentaje) : undefined,
      activo: dto.activo,
    });
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.ACTUALIZAR,
      entidad: EntidadAuditoria.TIPO_HORA_EXTRA,
      entidadId: tipo.id,
      descripcion: `Actualizó el tipo de hora extra ${tipo.codigo}: porcentaje ${tipo.porcentaje.toString()}%, activo=${tipo.activo}.`,
    });
    return aTipoHoraExtraRespuestaDto(tipo);
  }
}
