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
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ActualizarRegistroUseCase } from '../../application/use-cases/registros/actualizar-registro.use-case';
import { CrearRegistroUseCase } from '../../application/use-cases/registros/crear-registro.use-case';
import { EliminarRegistroUseCase } from '../../application/use-cases/registros/eliminar-registro.use-case';
import { ListarRegistrosUseCase } from '../../application/use-cases/registros/listar-registros.use-case';
import { PreviewCalculoUseCase } from '../../application/use-cases/registros/preview-calculo.use-case';
import { ActualizarRegistroDto } from '../dtos/registros/actualizar-registro.dto';
import { CalculoRespuestaDto } from '../dtos/registros/calculo-respuesta.dto';
import { CrearRegistroDto } from '../dtos/registros/crear-registro.dto';
import { PreviewCalculoDto } from '../dtos/registros/preview-calculo.dto';
import { RegistroRespuestaDto } from '../dtos/registros/registro-respuesta.dto';
import {
  aFilaCalculoRespuestaDto,
  aRegistroRespuestaDto,
} from '../mappers/registro-horas.mapper';

@ApiTags('registros')
@ApiBearerAuth()
@Controller()
export class RegistrosController {
  constructor(
    @Inject(ListarRegistrosUseCase)
    private readonly listarRegistros: ListarRegistrosUseCase,
    @Inject(CrearRegistroUseCase)
    private readonly crearRegistro: CrearRegistroUseCase,
    @Inject(ActualizarRegistroUseCase)
    private readonly actualizarRegistro: ActualizarRegistroUseCase,
    @Inject(EliminarRegistroUseCase)
    private readonly eliminarRegistro: EliminarRegistroUseCase,
    @Inject(PreviewCalculoUseCase)
    private readonly previewCalculo: PreviewCalculoUseCase,
  ) {}

  @Get('periodos/:periodoId/registros')
  @ApiOperation({ summary: 'Lista los registros de horas de un periodo' })
  @ApiResponse({ status: 200, type: [RegistroRespuestaDto] })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  async listar(
    @Param('periodoId') periodoId: string,
    @Query('empleadoId') empleadoId?: string,
  ): Promise<RegistroRespuestaDto[]> {
    const registros = await this.listarRegistros.ejecutar(
      periodoId,
      empleadoId,
    );
    return registros.map(aRegistroRespuestaDto);
  }

  @Post('registros')
  @ApiOperation({ summary: 'Crea un registro de horas y calcula su desglose' })
  @ApiResponse({ status: 201, type: RegistroRespuestaDto })
  @ApiResponse({ status: 404, description: 'Periodo o empleado no encontrado' })
  @ApiResponse({ status: 409, description: 'El periodo está cerrado' })
  async crear(@Body() dto: CrearRegistroDto): Promise<RegistroRespuestaDto> {
    const registro = await this.crearRegistro.ejecutar({
      periodoId: dto.periodoId,
      empleadoId: dto.empleadoId,
      fecha: new Date(dto.fecha),
      horaEntrada: dto.horaEntrada,
      horaSalida: dto.horaSalida,
      comentario: dto.comentario ?? null,
    });
    return aRegistroRespuestaDto(registro);
  }

  @Patch('registros/:id')
  @ApiOperation({
    summary: 'Actualiza un registro de horas y recalcula su desglose',
  })
  @ApiResponse({ status: 200, type: RegistroRespuestaDto })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  @ApiResponse({ status: 409, description: 'El periodo está cerrado' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarRegistroDto,
  ): Promise<RegistroRespuestaDto> {
    const registro = await this.actualizarRegistro.ejecutar(id, {
      fecha: dto.fecha ? new Date(dto.fecha) : undefined,
      horaEntrada: dto.horaEntrada,
      horaSalida: dto.horaSalida,
      comentario: dto.comentario,
    });
    return aRegistroRespuestaDto(registro);
  }

  @Delete('registros/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Elimina un registro de horas' })
  @ApiResponse({ status: 204, description: 'Eliminado' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  @ApiResponse({ status: 409, description: 'El periodo está cerrado' })
  async eliminar(@Param('id') id: string): Promise<void> {
    await this.eliminarRegistro.ejecutar(id);
  }

  @Post('registros/preview')
  @ApiOperation({
    summary: 'Calcula el desglose de horas extra sin persistir nada',
  })
  @ApiResponse({ status: 200, type: [CalculoRespuestaDto] })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  @ApiResponse({
    status: 422,
    description: 'El empleado no tiene salario vigente en esa fecha',
  })
  async preview(
    @Body() dto: PreviewCalculoDto,
  ): Promise<CalculoRespuestaDto[]> {
    const filas = await this.previewCalculo.ejecutar({
      empleadoId: dto.empleadoId,
      fecha: new Date(dto.fecha),
      horaEntrada: dto.horaEntrada,
      horaSalida: dto.horaSalida,
    });
    return filas.map(aFilaCalculoRespuestaDto);
  }
}
