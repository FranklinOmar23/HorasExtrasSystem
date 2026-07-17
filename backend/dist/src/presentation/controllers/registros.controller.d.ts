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
export declare class RegistrosController {
    private readonly listarRegistros;
    private readonly crearRegistro;
    private readonly actualizarRegistro;
    private readonly eliminarRegistro;
    private readonly previewCalculo;
    constructor(listarRegistros: ListarRegistrosUseCase, crearRegistro: CrearRegistroUseCase, actualizarRegistro: ActualizarRegistroUseCase, eliminarRegistro: EliminarRegistroUseCase, previewCalculo: PreviewCalculoUseCase);
    listar(periodoId: string, empleadoId?: string): Promise<RegistroRespuestaDto[]>;
    crear(dto: CrearRegistroDto): Promise<RegistroRespuestaDto>;
    actualizar(id: string, dto: ActualizarRegistroDto): Promise<RegistroRespuestaDto>;
    eliminar(id: string): Promise<void>;
    preview(dto: PreviewCalculoDto): Promise<CalculoRespuestaDto[]>;
}
