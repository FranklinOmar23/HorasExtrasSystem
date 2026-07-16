import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CrearEmpleadoUseCase } from '../../application/use-cases/empleados/crear-empleado.use-case';
import { ListarEmpleadosUseCase } from '../../application/use-cases/empleados/listar-empleados.use-case';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
import { Roles } from '../decorators/roles.decorator';
import { CrearEmpleadoDto } from '../dtos/empleados/crear-empleado.dto';
import { EmpleadoRespuestaDto } from '../dtos/empleados/empleado-respuesta.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

@ApiTags('empleados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('empleados')
export class EmpleadosController {
  constructor(
    @Inject(ListarEmpleadosUseCase)
    private readonly listarEmpleados: ListarEmpleadosUseCase,
    @Inject(CrearEmpleadoUseCase)
    private readonly crearEmpleado: CrearEmpleadoUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos los empleados' })
  @ApiResponse({ status: 200, type: [EmpleadoRespuestaDto] })
  listar(): Promise<EmpleadoRespuestaDto[]> {
    return this.listarEmpleados.ejecutar();
  }

  @Post()
  @Roles(RolUsuario.ADMIN, RolUsuario.RRHH)
  @ApiOperation({ summary: 'Crea un nuevo empleado' })
  @ApiResponse({ status: 201, type: EmpleadoRespuestaDto })
  crear(@Body() dto: CrearEmpleadoDto): Promise<EmpleadoRespuestaDto> {
    return this.crearEmpleado.ejecutar({
      codigo: dto.codigo,
      nombre: dto.nombre,
      cargo: dto.cargo ?? null,
    });
  }
}
