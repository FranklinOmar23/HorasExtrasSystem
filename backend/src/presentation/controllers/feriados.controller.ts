import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegistrarAuditoriaUseCase } from '../../application/use-cases/auditoria/registrar-auditoria.use-case';
import { CrearFeriadoUseCase } from '../../application/use-cases/feriados/crear-feriado.use-case';
import { EliminarFeriadoUseCase } from '../../application/use-cases/feriados/eliminar-feriado.use-case';
import { ListarFeriadosUseCase } from '../../application/use-cases/feriados/listar-feriados.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { AccionAuditoria } from '../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../domain/enums/entidad-auditoria.enum';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
import { Roles } from '../decorators/roles.decorator';
import { UsuarioActual } from '../decorators/usuario-actual.decorator';
import { CrearFeriadoDto } from '../dtos/feriados/crear-feriado.dto';
import { FeriadoRespuestaDto } from '../dtos/feriados/feriado-respuesta.dto';
import { ListarFeriadosQueryDto } from '../dtos/feriados/listar-feriados-query.dto';
import { aFeriadoRespuestaDto } from '../mappers/feriado.mapper';

@ApiTags('feriados')
@ApiBearerAuth()
@Controller('feriados')
export class FeriadosController {
  constructor(
    @Inject(ListarFeriadosUseCase)
    private readonly listarFeriados: ListarFeriadosUseCase,
    @Inject(CrearFeriadoUseCase)
    private readonly crearFeriado: CrearFeriadoUseCase,
    @Inject(EliminarFeriadoUseCase)
    private readonly eliminarFeriado: EliminarFeriadoUseCase,
    @Inject(RegistrarAuditoriaUseCase)
    private readonly registrarAuditoria: RegistrarAuditoriaUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista feriados, opcionalmente filtrados por año' })
  @ApiResponse({ status: 200, type: [FeriadoRespuestaDto] })
  async listar(
    @Query() query: ListarFeriadosQueryDto,
  ): Promise<FeriadoRespuestaDto[]> {
    const feriados = await this.listarFeriados.ejecutar(query.anio);
    return feriados.map(aFeriadoRespuestaDto);
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Crea un feriado (solo ADMIN)' })
  @ApiResponse({ status: 201, type: FeriadoRespuestaDto })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un feriado en esa fecha',
  })
  async crear(
    @Body() dto: CrearFeriadoDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<FeriadoRespuestaDto> {
    const feriado = await this.crearFeriado.ejecutar({
      fecha: new Date(dto.fecha),
      descripcion: dto.descripcion,
    });
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.CREAR,
      entidad: EntidadAuditoria.FERIADO,
      entidadId: feriado.id,
      descripcion: `Creó el feriado "${feriado.descripcion}" (${dto.fecha}).`,
    });
    return aFeriadoRespuestaDto(feriado);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina un feriado (solo ADMIN)' })
  @ApiResponse({ status: 204, description: 'Eliminado' })
  @ApiResponse({ status: 404, description: 'Feriado no encontrado' })
  async eliminar(
    @Param('id') id: string,
    @UsuarioActual() usuario: Usuario,
  ): Promise<void> {
    const feriado = await this.eliminarFeriado.ejecutar(id);
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.ELIMINAR,
      entidad: EntidadAuditoria.FERIADO,
      entidadId: feriado.id,
      descripcion: `Eliminó el feriado "${feriado.descripcion}" (${feriado.fecha.toISOString().slice(0, 10)}).`,
    });
  }
}
