import { CerrarPeriodoUseCase } from '../../application/use-cases/periodos/cerrar-periodo.use-case';
import { CrearPeriodoUseCase } from '../../application/use-cases/periodos/crear-periodo.use-case';
import { ListarPeriodosUseCase } from '../../application/use-cases/periodos/listar-periodos.use-case';
import { ObtenerPeriodoUseCase } from '../../application/use-cases/periodos/obtener-periodo.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { CrearPeriodoDto } from '../dtos/periodos/crear-periodo.dto';
import { PeriodoRespuestaDto } from '../dtos/periodos/periodo-respuesta.dto';
export declare class PeriodosController {
    private readonly listarPeriodos;
    private readonly obtenerPeriodo;
    private readonly crearPeriodo;
    private readonly cerrarPeriodo;
    constructor(listarPeriodos: ListarPeriodosUseCase, obtenerPeriodo: ObtenerPeriodoUseCase, crearPeriodo: CrearPeriodoUseCase, cerrarPeriodo: CerrarPeriodoUseCase);
    listar(): Promise<PeriodoRespuestaDto[]>;
    obtener(id: string): Promise<PeriodoRespuestaDto>;
    crear(dto: CrearPeriodoDto): Promise<PeriodoRespuestaDto>;
    cerrar(id: string, usuario: Usuario): Promise<PeriodoRespuestaDto>;
}
