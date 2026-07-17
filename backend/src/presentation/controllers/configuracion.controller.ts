import { Body, Controller, Get, Inject, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActualizarConfiguracionUseCase } from '../../application/use-cases/configuracion/actualizar-configuracion.use-case';
import { ObtenerConfiguracionUseCase } from '../../application/use-cases/configuracion/obtener-configuracion.use-case';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
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
  ejecutarActualizar(
    @Body() dto: ActualizarConfiguracionDto,
  ): Promise<Record<string, string>> {
    const cambios = Object.fromEntries(
      Object.entries(dto).filter(([, valor]) => valor !== undefined),
    ) as Record<string, string>;
    return this.actualizarConfiguracion.ejecutar(cambios);
  }
}
