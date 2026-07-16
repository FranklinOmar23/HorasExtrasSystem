import { CrearEmpleadoUseCase } from '../../application/use-cases/empleados/crear-empleado.use-case';
import { ListarEmpleadosUseCase } from '../../application/use-cases/empleados/listar-empleados.use-case';
import { CrearEmpleadoDto } from '../dtos/empleados/crear-empleado.dto';
import { EmpleadoRespuestaDto } from '../dtos/empleados/empleado-respuesta.dto';
export declare class EmpleadosController {
    private readonly listarEmpleados;
    private readonly crearEmpleado;
    constructor(listarEmpleados: ListarEmpleadosUseCase, crearEmpleado: CrearEmpleadoUseCase);
    listar(): Promise<EmpleadoRespuestaDto[]>;
    crear(dto: CrearEmpleadoDto): Promise<EmpleadoRespuestaDto>;
}
