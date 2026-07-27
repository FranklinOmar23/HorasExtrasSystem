import {
  Body,
  Controller,
  Get,
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
import { ActualizarUsuarioUseCase } from '../../application/use-cases/usuarios/actualizar-usuario.use-case';
import { CrearUsuarioUseCase } from '../../application/use-cases/usuarios/crear-usuario.use-case';
import { ListarUsuariosUseCase } from '../../application/use-cases/usuarios/listar-usuarios.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { AccionAuditoria } from '../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../domain/enums/entidad-auditoria.enum';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
import { Roles } from '../decorators/roles.decorator';
import { UsuarioActual } from '../decorators/usuario-actual.decorator';
import { ActualizarUsuarioDto } from '../dtos/usuarios/actualizar-usuario.dto';
import { CrearUsuarioDto } from '../dtos/usuarios/crear-usuario.dto';
import { UsuarioRespuestaDto } from '../dtos/usuarios/usuario-respuesta.dto';
import { aUsuarioRespuestaDto } from '../mappers/usuario.mapper';

@ApiTags('usuarios')
@ApiBearerAuth()
@Roles(RolUsuario.ADMIN)
@Controller('usuarios')
export class UsuariosController {
  constructor(
    @Inject(ListarUsuariosUseCase)
    private readonly listarUsuarios: ListarUsuariosUseCase,
    @Inject(CrearUsuarioUseCase)
    private readonly crearUsuario: CrearUsuarioUseCase,
    @Inject(ActualizarUsuarioUseCase)
    private readonly actualizarUsuario: ActualizarUsuarioUseCase,
    @Inject(RegistrarAuditoriaUseCase)
    private readonly registrarAuditoria: RegistrarAuditoriaUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista los usuarios del sistema (solo ADMIN)' })
  @ApiResponse({ status: 200, type: [UsuarioRespuestaDto] })
  async listar(): Promise<UsuarioRespuestaDto[]> {
    const usuarios = await this.listarUsuarios.ejecutar();
    return usuarios.map(aUsuarioRespuestaDto);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un usuario (solo ADMIN)' })
  @ApiResponse({ status: 201, type: UsuarioRespuestaDto })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un usuario con ese email',
  })
  async crear(
    @Body() dto: CrearUsuarioDto,
    @UsuarioActual() usuarioActual: Usuario,
  ): Promise<UsuarioRespuestaDto> {
    const usuario = await this.crearUsuario.ejecutar(dto);
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuarioActual.id,
      accion: AccionAuditoria.CREAR,
      entidad: EntidadAuditoria.USUARIO,
      entidadId: usuario.id,
      descripcion: `Creó al usuario ${usuario.nombre} (${usuario.email}, rol ${usuario.rol}).`,
    });
    return aUsuarioRespuestaDto(usuario);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un usuario (solo ADMIN)' })
  @ApiResponse({ status: 200, type: UsuarioRespuestaDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarUsuarioDto,
    @UsuarioActual() usuarioActual: Usuario,
  ): Promise<UsuarioRespuestaDto> {
    const usuario = await this.actualizarUsuario.ejecutar(id, dto);
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuarioActual.id,
      accion: AccionAuditoria.ACTUALIZAR,
      entidad: EntidadAuditoria.USUARIO,
      entidadId: usuario.id,
      descripcion: `Actualizó al usuario ${usuario.nombre} (${usuario.email}).`,
    });
    return aUsuarioRespuestaDto(usuario);
  }
}
