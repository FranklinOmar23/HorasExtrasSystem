import { ExcelParserPort, FilaExcelCruda } from '../../application/ports/excel-parser.port';
export declare class XlsxParserAdapter implements ExcelParserPort {
    parsear(contenido: Buffer): FilaExcelCruda[];
}
