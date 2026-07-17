import { Importacion } from '../../../domain/entities/importacion.entity';
import { ExcelParserPort } from '../../ports/excel-parser.port';
import { ImportacionRepository } from '../../ports/importacion.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { FilaImportacionValidada, ValidarFilasImportacionService } from '../../services/validar-filas-importacion.service';
export interface ParsearImportacionComando {
    periodoId: string;
    usuarioId: string;
    nombreArchivo: string;
    contenido: Buffer;
}
export interface ResultadoParseoImportacion {
    importacion: Importacion;
    filas: FilaImportacionValidada[];
}
export declare class ParsearImportacionUseCase {
    private readonly periodoRepository;
    private readonly excelParser;
    private readonly validarFilas;
    private readonly importacionRepository;
    constructor(periodoRepository: PeriodoRepository, excelParser: ExcelParserPort, validarFilas: ValidarFilasImportacionService, importacionRepository: ImportacionRepository);
    ejecutar(comando: ParsearImportacionComando): Promise<ResultadoParseoImportacion>;
}
