import { ActualizarEmpleadoUseCase } from '../../application/use-cases/empleados/actualizar-empleado.use-case';
import { CrearEmpleadoUseCase } from '../../application/use-cases/empleados/crear-empleado.use-case';
import { ListarEmpleadosUseCase } from '../../application/use-cases/empleados/listar-empleados.use-case';
import { ObtenerEmpleadoUseCase } from '../../application/use-cases/empleados/obtener-empleado.use-case';
import { CrearSalarioUseCase } from '../../application/use-cases/salarios/crear-salario.use-case';
import { ListarSalariosUseCase } from '../../application/use-cases/salarios/listar-salarios.use-case';
import { ActualizarEmpleadoDto } from '../dtos/empleados/actualizar-empleado.dto';
import { CrearEmpleadoDto } from '../dtos/empleados/crear-empleado.dto';
import { EmpleadoRespuestaDto } from '../dtos/empleados/empleado-respuesta.dto';
import { ListarEmpleadosQueryDto } from '../dtos/empleados/listar-empleados-query.dto';
import { CrearSalarioDto } from '../dtos/salarios/crear-salario.dto';
import { SalarioRespuestaDto } from '../dtos/salarios/salario-respuesta.dto';
export declare class EmpleadosController {
    private readonly listarEmpleados;
    private readonly obtenerEmpleado;
    private readonly crearEmpleado;
    private readonly actualizarEmpleado;
    private readonly listarSalarios;
    private readonly crearSalario;
    constructor(listarEmpleados: ListarEmpleadosUseCase, obtenerEmpleado: ObtenerEmpleadoUseCase, crearEmpleado: CrearEmpleadoUseCase, actualizarEmpleado: ActualizarEmpleadoUseCase, listarSalarios: ListarSalariosUseCase, crearSalario: CrearSalarioUseCase);
    listar(query: ListarEmpleadosQueryDto): Promise<EmpleadoRespuestaDto[]>;
    obtener(id: string): Promise<EmpleadoRespuestaDto>;
    crear(dto: CrearEmpleadoDto): Promise<EmpleadoRespuestaDto>;
    actualizar(id: string, dto: ActualizarEmpleadoDto): Promise<EmpleadoRespuestaDto>;
    listarSalariosDelEmpleado(id: string): Promise<SalarioRespuestaDto[]>;
    crearSalarioDelEmpleado(id: string, dto: CrearSalarioDto): Promise<SalarioRespuestaDto>;
}
