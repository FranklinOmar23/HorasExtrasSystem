import { Importacion } from '../../../domain/entities/importacion.entity';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
import { ValidarFilasImportacionService } from '../../services/validar-filas-importacion.service';
import { ExcelParserPort } from '../../ports/excel-parser.port';
import { ImportacionRepository } from '../../ports/importacion.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { RegistroHorasRepository } from '../../ports/registro-horas.repository.port';
export interface ConfirmarImportacionComando {
    importacionId: string;
    incluirAdvertencias: boolean;
}
export declare class ConfirmarImportacionUseCase {
    private readonly importacionRepository;
    private readonly periodoRepository;
    private readonly excelParser;
    private readonly validarFilas;
    private readonly registroHorasRepository;
    private readonly calcularDesglose;
    constructor(importacionRepository: ImportacionRepository, periodoRepository: PeriodoRepository, excelParser: ExcelParserPort, validarFilas: ValidarFilasImportacionService, registroHorasRepository: RegistroHorasRepository, calcularDesglose: CalcularDesgloseService);
    ejecutar(comando: ConfirmarImportacionComando): Promise<Importacion>;
}
