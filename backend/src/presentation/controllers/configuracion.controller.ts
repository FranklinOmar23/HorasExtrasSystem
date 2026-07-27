import { Body, Controller, Get, Inject, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegistrarAuditoriaUseCase } from '../../application/use-cases/auditoria/registrar-auditoria.use-case';
import { ActualizarConfiguracionUseCase } from '../../application/use-cases/configuracion/actualizar-configuracion.use-case';
import { ObtenerConfiguracionUseCase } from '../../application/use-cases/configuracion/obtener-configuracion.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { AccionAuditoria } from '../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../domain/enums/entidad-auditoria.enum';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
import { UsuarioActual } from '../decorators/usuario-actual.decorator';
import { ActualizarConfiguracionDto } from '../dtos/configuracion/actualizar-configuracion.dto';
import { ConfiguracionRespuestaDto } from '../dtos/configuracion/configuracion-respuesta.dto';
import { Roles } from '../decorators/roles.decorator';

@ApiTags('configuracion')
@ApiBearerAuth()
@Controller('configuracion')
export class ConfiguracionController {
  constructor(
    @Inject(ObtenerConfiguracionUseCase)
    private readonly obtenerConfiguracion: ObtenerConfiguracionUseCase,
    @Inject(ActualizarConfiguracionUseCase)
    private readonly actualizarConfiguracion: ActualizarConfiguracionUseCase,
    @Inject(RegistrarAuditoriaUseCase)
    private readonly registrarAuditoria: RegistrarAuditoriaUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene los parámetros de cálculo vigentes' })
  @ApiResponse({ status: 200, type: ConfiguracionRespuestaDto })
  ejecutarObtener(): Promise<Record<string, string>> {
    return this.obtenerConfiguracion.ejecutar();
  }

  @Patch()
  @Roles(RolUsuario.ADMIN)
  @ApiOperation({
    summary: 'Actualiza uno o más parámetros de cálculo (solo ADMIN)',
  })
  @ApiResponse({ status: 200, type: ConfiguracionRespuestaDto })
  async ejecutarActualizar(
    @Body() dto: ActualizarConfiguracionDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<Record<string, string>> {
    const cambios = Object.fromEntries(
      Object.entries(dto).filter(([, valor]) => valor !== undefined),
    ) as Record<string, string>;
    const resultado = await this.actualizarConfiguracion.ejecutar(cambios);
    const detalle = Object.entries(cambios)
      .map(([clave, valor]) => `${clave}=${valor}`)
      .join(', ');
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.ACTUALIZAR,
      entidad: EntidadAuditoria.CONFIGURACION,
      entidadId: null,
      descripcion: `Actualizó la configuración: ${detalle}.`,
    });
    return resultado;
  }
}
