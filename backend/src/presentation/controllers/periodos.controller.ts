import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CerrarPeriodoUseCase } from '../../application/use-cases/periodos/cerrar-periodo.use-case';
import { CrearPeriodoUseCase } from '../../application/use-cases/periodos/crear-periodo.use-case';
import { ListarPeriodosUseCase } from '../../application/use-cases/periodos/listar-periodos.use-case';
import { ObtenerPeriodoUseCase } from '../../application/use-cases/periodos/obtener-periodo.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { UsuarioActual } from '../decorators/usuario-actual.decorator';
import { CrearPeriodoDto } from '../dtos/periodos/crear-periodo.dto';
import { PeriodoRespuestaDto } from '../dtos/periodos/periodo-respuesta.dto';
import { aPeriodoRespuestaDto } from '../mappers/periodo.mapper';

@ApiTags('periodos')
@ApiBearerAuth()
@Controller('periodos')
export class PeriodosController {
  constructor(
    @Inject(ListarPeriodosUseCase)
    private readonly listarPeriodos: ListarPeriodosUseCase,
    @Inject(ObtenerPeriodoUseCase)
    private readonly obtenerPeriodo: ObtenerPeriodoUseCase,
    @Inject(CrearPeriodoUseCase)
    private readonly crearPeriodo: CrearPeriodoUseCase,
    @Inject(CerrarPeriodoUseCase)
    private readonly cerrarPeriodo: CerrarPeriodoUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista los periodos de nómina' })
  @ApiResponse({ status: 200, type: [PeriodoRespuestaDto] })
  async listar(): Promise<PeriodoRespuestaDto[]> {
    const periodos = await this.listarPeriodos.ejecutar();
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
  async crear(@Body() dto: CrearPeriodoDto): Promise<PeriodoRespuestaDto> {
    const periodo = await this.crearPeriodo.ejecutar({
      fechaInicio: new Date(dto.fechaInicio),
      fechaFin: new Date(dto.fechaFin),
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
    return aPeriodoRespuestaDto(periodo);
  }
}
