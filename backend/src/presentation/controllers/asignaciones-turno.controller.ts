import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegistrarAuditoriaUseCase } from '../../application/use-cases/auditoria/registrar-auditoria.use-case';
import { ActualizarAsignacionTurnoUseCase } from '../../application/use-cases/asignaciones-turno/actualizar-asignacion-turno.use-case';
import { CrearAsignacionTurnoUseCase } from '../../application/use-cases/asignaciones-turno/crear-asignacion-turno.use-case';
import { EliminarAsignacionTurnoUseCase } from '../../application/use-cases/asignaciones-turno/eliminar-asignacion-turno.use-case';
import { ListarAsignacionesPorEmpleadoUseCase } from '../../application/use-cases/asignaciones-turno/listar-asignaciones-por-empleado.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { AccionAuditoria } from '../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../domain/enums/entidad-auditoria.enum';
import { UsuarioActual } from '../decorators/usuario-actual.decorator';
import { ActualizarAsignacionTurnoDto } from '../dtos/asignaciones-turno/actualizar-asignacion-turno.dto';
import { AsignacionTurnoRespuestaDto } from '../dtos/asignaciones-turno/asignacion-turno-respuesta.dto';
import { CrearAsignacionTurnoDto } from '../dtos/asignaciones-turno/crear-asignacion-turno.dto';
import { aAsignacionTurnoRespuestaDto } from '../mappers/asignacion-turno.mapper';

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

@ApiTags('asignaciones-turno')
@ApiBearerAuth()
@Controller()
export class AsignacionesTurnoController {
  constructor(
    @Inject(ListarAsignacionesPorEmpleadoUseCase)
    private readonly listarAsignaciones: ListarAsignacionesPorEmpleadoUseCase,
    @Inject(CrearAsignacionTurnoUseCase)
    private readonly crearAsignacion: CrearAsignacionTurnoUseCase,
    @Inject(ActualizarAsignacionTurnoUseCase)
    private readonly actualizarAsignacion: ActualizarAsignacionTurnoUseCase,
    @Inject(EliminarAsignacionTurnoUseCase)
    private readonly eliminarAsignacion: EliminarAsignacionTurnoUseCase,
    @Inject(RegistrarAuditoriaUseCase)
    private readonly registrarAuditoria: RegistrarAuditoriaUseCase,
  ) {}

  @Get('empleados/:id/asignaciones-turno')
  @ApiOperation({ summary: 'Lista las asignaciones de turno de un empleado' })
  @ApiResponse({ status: 200, type: [AsignacionTurnoRespuestaDto] })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  async listarPorEmpleado(
    @Param('id') id: string,
  ): Promise<AsignacionTurnoRespuestaDto[]> {
    const asignaciones = await this.listarAsignaciones.ejecutar(id);
    return asignaciones.map(aAsignacionTurnoRespuestaDto);
  }

  @Post('asignaciones-turno')
  @ApiOperation({
    summary:
      'Asigna un turno a un empleado durante un rango de fechas; recalcula los registros ya calculados dentro del rango',
  })
  @ApiResponse({ status: 201, type: AsignacionTurnoRespuestaDto })
  @ApiResponse({ status: 404, description: 'Empleado o turno no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Se solapa con otra asignación o afecta un periodo cerrado',
  })
  async crear(
    @Body() dto: CrearAsignacionTurnoDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<AsignacionTurnoRespuestaDto> {
    const asignacion = await this.crearAsignacion.ejecutar({
      empleadoId: dto.empleadoId,
      turnoId: dto.turnoId,
      fechaDesde: new Date(dto.fechaDesde),
      fechaHasta: dto.fechaHasta ? new Date(dto.fechaHasta) : null,
      comentario: dto.comentario ?? null,
      creadoPorId: usuario.id,
    });
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.CREAR,
      entidad: EntidadAuditoria.ASIGNACION_TURNO,
      entidadId: asignacion.id,
      descripcion: `Asignó el turno ${asignacion.turnoId} al empleado ${asignacion.empleadoId} desde ${aFechaISO(asignacion.fechaDesde)}${asignacion.fechaHasta ? ` hasta ${aFechaISO(asignacion.fechaHasta)}` : ' (indefinido)'}.`,
    });
    return aAsignacionTurnoRespuestaDto(asignacion);
  }

  @Patch('asignaciones-turno/:id')
  @ApiOperation({
    summary:
      'Actualiza una asignación de turno; recalcula los registros del rango afectado (viejo y nuevo)',
  })
  @ApiResponse({ status: 200, type: AsignacionTurnoRespuestaDto })
  @ApiResponse({ status: 404, description: 'Asignación o turno no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Se solapa con otra asignación o afecta un periodo cerrado',
  })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarAsignacionTurnoDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<AsignacionTurnoRespuestaDto> {
    const asignacion = await this.actualizarAsignacion.ejecutar(id, {
      turnoId: dto.turnoId,
      fechaDesde: dto.fechaDesde ? new Date(dto.fechaDesde) : undefined,
      fechaHasta:
        dto.fechaHasta === undefined
          ? undefined
          : dto.fechaHasta === null
            ? null
            : new Date(dto.fechaHasta),
      comentario: dto.comentario,
    });
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.ACTUALIZAR,
      entidad: EntidadAuditoria.ASIGNACION_TURNO,
      entidadId: asignacion.id,
      descripcion: `Actualizó la asignación de turno del empleado ${asignacion.empleadoId} (desde ${aFechaISO(asignacion.fechaDesde)}${asignacion.fechaHasta ? ` hasta ${aFechaISO(asignacion.fechaHasta)}` : ' (indefinido)'}).`,
    });
    return aAsignacionTurnoRespuestaDto(asignacion);
  }

  @Delete('asignaciones-turno/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Elimina una asignación de turno; recalcula los registros que quedaron dentro de su rango',
  })
  @ApiResponse({ status: 204, description: 'Eliminada' })
  @ApiResponse({ status: 404, description: 'Asignación no encontrada' })
  @ApiResponse({ status: 409, description: 'Afecta un periodo cerrado' })
  async eliminar(
    @Param('id') id: string,
    @UsuarioActual() usuario: Usuario,
  ): Promise<void> {
    const asignacion = await this.eliminarAsignacion.ejecutar(id);
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.ELIMINAR,
      entidad: EntidadAuditoria.ASIGNACION_TURNO,
      entidadId: asignacion.id,
      descripcion: `Eliminó la asignación de turno del empleado ${asignacion.empleadoId} (desde ${aFechaISO(asignacion.fechaDesde)}).`,
    });
  }
}
