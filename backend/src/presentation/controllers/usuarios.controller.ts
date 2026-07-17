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
import { ActualizarUsuarioUseCase } from '../../application/use-cases/usuarios/actualizar-usuario.use-case';
import { CrearUsuarioUseCase } from '../../application/use-cases/usuarios/crear-usuario.use-case';
import { ListarUsuariosUseCase } from '../../application/use-cases/usuarios/listar-usuarios.use-case';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
import { Roles } from '../decorators/roles.decorator';
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
  async crear(@Body() dto: CrearUsuarioDto): Promise<UsuarioRespuestaDto> {
    const usuario = await this.crearUsuario.ejecutar(dto);
    return aUsuarioRespuestaDto(usuario);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un usuario (solo ADMIN)' })
  @ApiResponse({ status: 200, type: UsuarioRespuestaDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarUsuarioDto,
  ): Promise<UsuarioRespuestaDto> {
    const usuario = await this.actualizarUsuario.ejecutar(id, dto);
    return aUsuarioRespuestaDto(usuario);
  }
}
