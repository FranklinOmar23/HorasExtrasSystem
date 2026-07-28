import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import Decimal from 'decimal.js';
import { RegistrarAuditoriaUseCase } from '../../application/use-cases/auditoria/registrar-auditoria.use-case';
import { ActualizarTurnoUseCase } from '../../application/use-cases/turnos/actualizar-turno.use-case';
import { CrearTurnoUseCase } from '../../application/use-cases/turnos/crear-turno.use-case';
import { EliminarTurnoUseCase } from '../../application/use-cases/turnos/eliminar-turno.use-case';
import { ListarTurnosUseCase } from '../../application/use-cases/turnos/listar-turnos.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { AccionAuditoria } from '../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../domain/enums/entidad-auditoria.enum';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
import { Roles } from '../decorators/roles.decorator';
import { UsuarioActual } from '../decorators/usuario-actual.decorator';
import { ActualizarTurnoDto } from '../dtos/turnos/actualizar-turno.dto';
import { CrearTurnoDto } from '../dtos/turnos/crear-turno.dto';
import { TurnoRespuestaDto } from '../dtos/turnos/turno-respuesta.dto';
import { aTurnoRespuestaDto } from '../mappers/turno.mapper';

@ApiTags('turnos')
@ApiBearerAuth()
@Controller('turnos')
export class TurnosController {
  constructor(
    @Inject(ListarTurnosUseCase)
    private readonly listarTurnos: ListarTurnosUseCase,
    @Inject(CrearTurnoUseCase)
    private readonly crearTurno: CrearTurnoUseCase,
    @Inject(ActualizarTurnoUseCase)
    private readonly actualizarTurno: ActualizarTurnoUseCase,
    @Inject(EliminarTurnoUseCase)
    private readonly eliminarTurno: EliminarTurnoUseCase,
    @Inject(RegistrarAuditoriaUseCase)
    private readonly registrarAuditoria: RegistrarAuditoriaUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista el catálogo de turnos' })
  @ApiResponse({ status: 200, type: [TurnoRespuestaDto] })
  async listar(): Promise<TurnoRespuestaDto[]> {
    const turnos = await this.listarTurnos.ejecutar();
    return turnos.map(aTurnoRespuestaDto);
  }

  @Post()
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Crea un turno (solo ADMIN)' })
  @ApiResponse({ status: 201, type: TurnoRespuestaDto })
  @ApiResponse({ status: 409, description: 'Ya existe un turno con ese código' })
  async crear(
    @Body() dto: CrearTurnoDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<TurnoRespuestaDto> {
    const turno = await this.crearTurno.ejecutar({
      codigo: dto.codigo,
      nombre: dto.nombre,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      horasJornada: new Decimal(dto.horasJornada),
      cruzaMedianoche: dto.cruzaMedianoche,
      descuentaAlmuerzo: dto.descuentaAlmuerzo,
    });
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.CREAR,
      entidad: EntidadAuditoria.TURNO,
      entidadId: turno.id,
      descripcion: `Creó el turno ${turno.nombre} (${turno.codigo}, ${turno.horaInicio}–${turno.horaFin}).`,
    });
    return aTurnoRespuestaDto(turno);
  }

  @Patch(':id')
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({ summary: 'Actualiza un turno (solo ADMIN)' })
  @ApiResponse({ status: 200, type: TurnoRespuestaDto })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarTurnoDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<TurnoRespuestaDto> {
    const turno = await this.actualizarTurno.ejecutar(id, {
      nombre: dto.nombre,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      horasJornada:
        dto.horasJornada !== undefined ? new Decimal(dto.horasJornada) : undefined,
      cruzaMedianoche: dto.cruzaMedianoche,
      descuentaAlmuerzo: dto.descuentaAlmuerzo,
      activo: dto.activo,
    });
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.ACTUALIZAR,
      entidad: EntidadAuditoria.TURNO,
      entidadId: turno.id,
      descripcion: `Actualizó el turno ${turno.nombre} (${turno.codigo}, ${turno.horaInicio}–${turno.horaFin}).`,
    });
    return aTurnoRespuestaDto(turno);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Elimina un turno sin asignaciones (solo ADMIN; DIURNO/SABADO no se pueden eliminar)',
  })
  @ApiResponse({ status: 204, description: 'Eliminado' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado' })
  @ApiResponse({
    status: 409,
    description: 'Es un turno por defecto o tiene asignaciones registradas',
  })
  async eliminar(
    @Param('id') id: string,
    @UsuarioActual() usuario: Usuario,
  ): Promise<void> {
    const turno = await this.eliminarTurno.ejecutar(id);
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.ELIMINAR,
      entidad: EntidadAuditoria.TURNO,
      entidadId: turno.id,
      descripcion: `Eliminó el turno ${turno.nombre} (${turno.codigo}).`,
    });
  }
}
