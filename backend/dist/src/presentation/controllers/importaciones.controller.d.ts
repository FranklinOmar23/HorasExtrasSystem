import { ConfirmarImportacionUseCase } from '../../application/use-cases/importaciones/confirmar-importacion.use-case';
import { ListarImportacionesUseCase } from '../../application/use-cases/importaciones/listar-importaciones.use-case';
import { ParsearImportacionUseCase } from '../../application/use-cases/importaciones/parsear-importacion.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { ConfirmarImportacionDto } from '../dtos/importaciones/confirmar-importacion.dto';
import { ImportacionRespuestaDto } from '../dtos/importaciones/importacion-respuesta.dto';
import { ParsearImportacionRespuestaDto } from '../dtos/importaciones/parsear-importacion-respuesta.dto';
export declare class ImportacionesController {
    private readonly parsearImportacion;
    private readonly confirmarImportacion;
    private readonly listarImportaciones;
    constructor(parsearImportacion: ParsearImportacionUseCase, confirmarImportacion: ConfirmarImportacionUseCase, listarImportaciones: ListarImportacionesUseCase);
    parsear(periodoId: string, archivo: Express.Multer.File | undefined, usuario: Usuario): Promise<ParsearImportacionRespuestaDto>;
    confirmar(id: string, dto: ConfirmarImportacionDto): Promise<ImportacionRespuestaDto>;
    listar(periodoId: string): Promise<ImportacionRespuestaDto[]>;
}
