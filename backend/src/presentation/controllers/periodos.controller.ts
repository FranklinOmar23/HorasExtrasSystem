import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegistrarAuditoriaUseCase } from '../../application/use-cases/auditoria/registrar-auditoria.use-case';
import { CerrarPeriodoUseCase } from '../../application/use-cases/periodos/cerrar-periodo.use-case';
import { CrearPeriodoUseCase } from '../../application/use-cases/periodos/crear-periodo.use-case';
import { EliminarPeriodoUseCase } from '../../application/use-cases/periodos/eliminar-periodo.use-case';
import { EliminarPeriodoPermanentementeUseCase } from '../../application/use-cases/periodos/eliminar-periodo-permanentemente.use-case';
import { ListarPeriodosEliminadosUseCase } from '../../application/use-cases/periodos/listar-periodos-eliminados.use-case';
import { ListarPeriodosUseCase } from '../../application/use-cases/periodos/listar-periodos.use-case';
import { ObtenerPeriodoUseCase } from '../../application/use-cases/periodos/obtener-periodo.use-case';
import { RestaurarPeriodoUseCase } from '../../application/use-cases/periodos/restaurar-periodo.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { AccionAuditoria } from '../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../domain/enums/entidad-auditoria.enum';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
import { Roles } from '../decorators/roles.decorator';
import { UsuarioActual } from '../decorators/usuario-actual.decorator';
import { CrearPeriodoDto } from '../dtos/periodos/crear-periodo.dto';
import { PeriodoRespuestaDto } from '../dtos/periodos/periodo-respuesta.dto';
import { aPeriodoRespuestaDto } from '../mappers/periodo.mapper';

function formatRangoPeriodo(fechaInicio: Date, fechaFin: Date): string {
  const aISO = (fecha: Date) => fecha.toISOString().slice(0, 10);
  return `${aISO(fechaInicio)} – ${aISO(fechaFin)}`;
}

@ApiTags('periodos')
@ApiBearerAuth()
@Controller('periodos')
export class PeriodosController {
  constructor(
    @Inject(ListarPeriodosUseCase)
    private readonly listarPeriodos: ListarPeriodosUseCase,
    @Inject(ListarPeriodosEliminadosUseCase)
    private readonly listarPeriodosEliminados: ListarPeriodosEliminadosUseCase,
    @Inject(ObtenerPeriodoUseCase)
    private readonly obtenerPeriodo: ObtenerPeriodoUseCase,
    @Inject(CrearPeriodoUseCase)
    private readonly crearPeriodo: CrearPeriodoUseCase,
    @Inject(CerrarPeriodoUseCase)
    private readonly cerrarPeriodo: CerrarPeriodoUseCase,
    @Inject(EliminarPeriodoUseCase)
    private readonly eliminarPeriodo: EliminarPeriodoUseCase,
    @Inject(RestaurarPeriodoUseCase)
    private readonly restaurarPeriodo: RestaurarPeriodoUseCase,
    @Inject(EliminarPeriodoPermanentementeUseCase)
    private readonly eliminarPeriodoPermanentemente: EliminarPeriodoPermanentementeUseCase,
    @Inject(RegistrarAuditoriaUseCase)
    private readonly registrarAuditoria: RegistrarAuditoriaUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista los periodos de nómina (sin los eliminados)' })
  @ApiResponse({ status: 200, type: [PeriodoRespuestaDto] })
  async listar(): Promise<PeriodoRespuestaDto[]> {
    const periodos = await this.listarPeriodos.ejecutar();
    return periodos.map(aPeriodoRespuestaDto);
  }

  @Get('eliminados')
  @ApiOperation({
    summary:
      'Lista los periodos eliminados (soft-delete), para restaurarlos dentro del plazo',
  })
  @ApiResponse({ status: 200, type: [PeriodoRespuestaDto] })
  async listarEliminados(): Promise<PeriodoRespuestaDto[]> {
    const periodos = await this.listarPeriodosEliminados.ejecutar();
    return periodos.map(aPeriodoRespuestaDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un periodo por id' })
  @ApiResponse({ status: 200, type: PeriodoRespuestaDto })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  async obtener(@Param('id') id: string): Promise<PeriodoRespuestaDto> {
    const periodo = await this.obtenerPeriodo.ejecutar(id);
    return aPeriodoRespuestaDto(periodo);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un periodo de nómina' })
  @ApiResponse({ status: 201, type: PeriodoRespuestaDto })
  @ApiResponse({ status: 400, description: 'Rango de fechas inválido' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un periodo con esas fechas',
  })
  async crear(
    @Body() dto: CrearPeriodoDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<PeriodoRespuestaDto> {
    const periodo = await this.crearPeriodo.ejecutar({
      fechaInicio: new Date(dto.fechaInicio),
      fechaFin: new Date(dto.fechaFin),
    });
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.CREAR,
      entidad: EntidadAuditoria.PERIODO,
      entidadId: periodo.id,
      descripcion: `Creó el periodo ${formatRangoPeriodo(periodo.fechaInicio, periodo.fechaFin)}.`,
    });
    return aPeriodoRespuestaDto(periodo);
  }

  @Post(':id/cerrar')
  @ApiOperation({ summary: 'Cierra un periodo (lo vuelve inmutable)' })
  @ApiResponse({ status: 201, type: PeriodoRespuestaDto })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  @ApiResponse({ status: 409, description: 'El periodo ya está cerrado' })
  async cerrar(
    @Param('id') id: string,
    @UsuarioActual() usuario: Usuario,
  ): Promise<PeriodoRespuestaDto> {
    const periodo = await this.cerrarPeriodo.ejecutar(id, usuario.id);
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.CERRAR,
      entidad: EntidadAuditoria.PERIODO,
      entidadId: periodo.id,
      descripcion: `Cerró el periodo ${formatRangoPeriodo(periodo.fechaInicio, periodo.fechaFin)}.`,
    });
    return aPeriodoRespuestaDto(periodo);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @HttpCode(204)
  @ApiOperation({
    summary:
      'Elimina (soft-delete) un periodo abierto; solo ADMIN, restaurable 30 días',
  })
  @ApiResponse({ status: 204, description: 'Periodo eliminado' })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'El periodo está cerrado o ya estaba eliminado',
  })
  async eliminar(
    @Param('id') id: string,
    @UsuarioActual() usuario: Usuario,
  ): Promise<void> {
    const periodo = await this.eliminarPeriodo.ejecutar(id, usuario.id);
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.ELIMINAR,
      entidad: EntidadAuditoria.PERIODO,
      entidadId: periodo.id,
      descripcion: `Eliminó el periodo ${formatRangoPeriodo(periodo.fechaInicio, periodo.fechaFin)}.`,
    });
  }

  @Post(':id/restaurar')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary:
      'Restaura un periodo eliminado dentro de los 30 días; solo ADMIN',
  })
  @ApiResponse({ status: 201, type: PeriodoRespuestaDto })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'El periodo no está eliminado o el plazo de 30 días expiró',
  })
  async restaurar(
    @Param('id') id: string,
    @UsuarioActual() usuario: Usuario,
  ): Promise<PeriodoRespuestaDto> {
    const periodo = await this.restaurarPeriodo.ejecutar(id);
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.RESTAURAR,
      entidad: EntidadAuditoria.PERIODO,
      entidadId: periodo.id,
      descripcion: `Restauró el periodo ${formatRangoPeriodo(periodo.fechaInicio, periodo.fechaFin)}.`,
    });
    return aPeriodoRespuestaDto(periodo);
  }

  @Delete(':id/permanente')
  @Roles(RolUsuario.ADMIN)
  @HttpCode(204)
  @ApiOperation({
    summary:
      'Borra físicamente un periodo ya eliminado (y su historial asociado); irreversible, solo ADMIN',
  })
  @ApiResponse({ status: 204, description: 'Periodo borrado permanentemente' })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'El periodo no está en la papelera (no se eliminó primero)',
  })
  async eliminarPermanente(
    @Param('id') id: string,
    @UsuarioActual() usuario: Usuario,
  ): Promise<void> {
    const periodo = await this.eliminarPeriodoPermanentemente.ejecutar(id);
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.ELIMINAR_PERMANENTE,
      entidad: EntidadAuditoria.PERIODO,
      entidadId: periodo.id,
      descripcion: `Eliminó PERMANENTEMENTE el periodo ${formatRangoPeriodo(periodo.fechaInicio, periodo.fechaFin)} (borrado irreversible de todo su historial).`,
    });
  }
}
