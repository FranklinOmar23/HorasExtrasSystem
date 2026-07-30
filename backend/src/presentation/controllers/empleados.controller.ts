import {
  Body,
  Controller,
  Get,
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
import Decimal from 'decimal.js';
import { RegistrarAuditoriaUseCase } from '../../application/use-cases/auditoria/registrar-auditoria.use-case';
import { ActualizarEmpleadoUseCase } from '../../application/use-cases/empleados/actualizar-empleado.use-case';
import { CrearEmpleadoUseCase } from '../../application/use-cases/empleados/crear-empleado.use-case';
import { ListarEmpleadosUseCase } from '../../application/use-cases/empleados/listar-empleados.use-case';
import { ObtenerEmpleadoUseCase } from '../../application/use-cases/empleados/obtener-empleado.use-case';
import { CrearSalarioUseCase } from '../../application/use-cases/salarios/crear-salario.use-case';
import { ListarSalariosUseCase } from '../../application/use-cases/salarios/listar-salarios.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { AccionAuditoria } from '../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../domain/enums/entidad-auditoria.enum';
import { UsuarioActual } from '../decorators/usuario-actual.decorator';
import { ActualizarEmpleadoDto } from '../dtos/empleados/actualizar-empleado.dto';
import { CrearEmpleadoDto } from '../dtos/empleados/crear-empleado.dto';
import { EmpleadosPaginadosRespuestaDto } from '../dtos/empleados/empleado-lista-respuesta.dto';
import { EmpleadoRespuestaDto } from '../dtos/empleados/empleado-respuesta.dto';
import { ListarEmpleadosQueryDto } from '../dtos/empleados/listar-empleados-query.dto';
import { CrearSalarioDto } from '../dtos/salarios/crear-salario.dto';
import { SalarioRespuestaDto } from '../dtos/salarios/salario-respuesta.dto';
import {
  aEmpleadoRespuestaDto,
  aEmpleadosPaginadosRespuestaDto,
} from '../mappers/empleado.mapper';
import { aSalarioRespuestaDto } from '../mappers/salario.mapper';

@ApiTags('empleados')
@ApiBearerAuth()
@Controller('empleados')
export class EmpleadosController {
  constructor(
    @Inject(ListarEmpleadosUseCase)
    private readonly listarEmpleados: ListarEmpleadosUseCase,
    @Inject(ObtenerEmpleadoUseCase)
    private readonly obtenerEmpleado: ObtenerEmpleadoUseCase,
    @Inject(CrearEmpleadoUseCase)
    private readonly crearEmpleado: CrearEmpleadoUseCase,
    @Inject(ActualizarEmpleadoUseCase)
    private readonly actualizarEmpleado: ActualizarEmpleadoUseCase,
    @Inject(ListarSalariosUseCase)
    private readonly listarSalarios: ListarSalariosUseCase,
    @Inject(CrearSalarioUseCase)
    private readonly crearSalario: CrearSalarioUseCase,
    @Inject(RegistrarAuditoriaUseCase)
    private readonly registrarAuditoria: RegistrarAuditoriaUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary:
      'Lista paginada de empleados, con búsqueda y filtro de rango de salario opcionales',
  })
  @ApiResponse({ status: 200, type: EmpleadosPaginadosRespuestaDto })
  async listar(
    @Query() query: ListarEmpleadosQueryDto,
  ): Promise<EmpleadosPaginadosRespuestaDto> {
    const resultado = await this.listarEmpleados.ejecutar({
      search: query.search,
      activo: query.activo,
      salarioMin:
        query.salarioMin !== undefined ? new Decimal(query.salarioMin) : undefined,
      salarioMax:
        query.salarioMax !== undefined ? new Decimal(query.salarioMax) : undefined,
      pagina: query.pagina,
      porPagina: query.porPagina,
    });
    return aEmpleadosPaginadosRespuestaDto(resultado);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un empleado por id' })
  @ApiResponse({ status: 200, type: EmpleadoRespuestaDto })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  async obtener(@Param('id') id: string): Promise<EmpleadoRespuestaDto> {
    const empleado = await this.obtenerEmpleado.ejecutar(id);
    return aEmpleadoRespuestaDto(empleado);
  }

  @Post()
  @ApiOperation({ summary: 'Crea un empleado con su salario inicial' })
  @ApiResponse({ status: 201, type: EmpleadoRespuestaDto })
  @ApiResponse({ status: 409, description: 'Código o cédula duplicados' })
  async crear(
    @Body() dto: CrearEmpleadoDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<EmpleadoRespuestaDto> {
    const empleado = await this.crearEmpleado.ejecutar({
      codigo: dto.codigo,
      nombre: dto.nombre,
      cedula: dto.cedula ?? null,
      posicion: dto.posicion,
      salarioInicial: {
        montoMensual: new Decimal(dto.salarioInicial.montoMensual),
        vigenteDesde: new Date(dto.salarioInicial.vigenteDesde),
      },
    });
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.CREAR,
      entidad: EntidadAuditoria.EMPLEADO,
      entidadId: empleado.id,
      descripcion: `Creó al empleado ${empleado.nombre} (código ${empleado.codigo}, posición ${empleado.posicion}).`,
    });
    return aEmpleadoRespuestaDto(empleado);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza datos de un empleado' })
  @ApiResponse({ status: 200, type: EmpleadoRespuestaDto })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  @ApiResponse({ status: 409, description: 'Cédula duplicada' })
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarEmpleadoDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<EmpleadoRespuestaDto> {
    const empleado = await this.actualizarEmpleado.ejecutar(id, dto);
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.ACTUALIZAR,
      entidad: EntidadAuditoria.EMPLEADO,
      entidadId: empleado.id,
      descripcion: `Actualizó al empleado ${empleado.nombre} (código ${empleado.codigo}).`,
    });
    return aEmpleadoRespuestaDto(empleado);
  }

  @Get(':id/salarios')
  @ApiOperation({ summary: 'Lista el historial de salarios de un empleado' })
  @ApiResponse({ status: 200, type: [SalarioRespuestaDto] })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  async listarSalariosDelEmpleado(
    @Param('id') id: string,
  ): Promise<SalarioRespuestaDto[]> {
    const salarios = await this.listarSalarios.ejecutar(id);
    return salarios.map(aSalarioRespuestaDto);
  }

  @Post(':id/salarios')
  @ApiOperation({
    summary: 'Registra un nuevo salario y cierra la vigencia del anterior',
  })
  @ApiResponse({ status: 201, type: SalarioRespuestaDto })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  async crearSalarioDelEmpleado(
    @Param('id') id: string,
    @Body() dto: CrearSalarioDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<SalarioRespuestaDto> {
    const empleado = await this.obtenerEmpleado.ejecutar(id);
    const salario = await this.crearSalario.ejecutar(id, {
      montoMensual: new Decimal(dto.montoMensual),
      vigenteDesde: new Date(dto.vigenteDesde),
    });
    await this.registrarAuditoria.ejecutar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.CREAR,
      entidad: EntidadAuditoria.SALARIO,
      entidadId: salario.id,
      descripcion: `Registró un nuevo salario de RD$${dto.montoMensual} para el empleado ${empleado.nombre} (código ${empleado.codigo}), vigente desde ${dto.vigenteDesde}.`,
    });
    return aSalarioRespuestaDto(salario);
  }
}
