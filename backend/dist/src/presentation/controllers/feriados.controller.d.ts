import { CrearFeriadoUseCase } from '../../application/use-cases/feriados/crear-feriado.use-case';
import { EliminarFeriadoUseCase } from '../../application/use-cases/feriados/eliminar-feriado.use-case';
import { ListarFeriadosUseCase } from '../../application/use-cases/feriados/listar-feriados.use-case';
import { CrearFeriadoDto } from '../dtos/feriados/crear-feriado.dto';
import { FeriadoRespuestaDto } from '../dtos/feriados/feriado-respuesta.dto';
import { ListarFeriadosQueryDto } from '../dtos/feriados/listar-feriados-query.dto';
export declare class FeriadosController {
    private readonly listarFeriados;
    private readonly crearFeriado;
    private readonly eliminarFeriado;
    constructor(listarFeriados: ListarFeriadosUseCase, crearFeriado: CrearFeriadoUseCase, eliminarFeriado: EliminarFeriadoUseCase);
    listar(query: ListarFeriadosQueryDto): Promise<FeriadoRespuestaDto[]>;
    crear(dto: CrearFeriadoDto): Promise<FeriadoRespuestaDto>;
    eliminar(id: string): Promise<void>;
}
