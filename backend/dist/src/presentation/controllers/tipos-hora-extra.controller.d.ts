import { ActualizarTipoHoraExtraUseCase } from '../../application/use-cases/tipos-hora-extra/actualizar-tipo-hora-extra.use-case';
import { ListarTiposHoraExtraUseCase } from '../../application/use-cases/tipos-hora-extra/listar-tipos-hora-extra.use-case';
import { ActualizarTipoHoraExtraDto } from '../dtos/tipos-hora-extra/actualizar-tipo-hora-extra.dto';
import { TipoHoraExtraRespuestaDto } from '../dtos/tipos-hora-extra/tipo-hora-extra-respuesta.dto';
export declare class TiposHoraExtraController {
    private readonly listarTipos;
    private readonly actualizarTipo;
    constructor(listarTipos: ListarTiposHoraExtraUseCase, actualizarTipo: ActualizarTipoHoraExtraUseCase);
    listar(): Promise<TipoHoraExtraRespuestaDto[]>;
    actualizar(id: string, dto: ActualizarTipoHoraExtraDto): Promise<TipoHoraExtraRespuestaDto>;
}
