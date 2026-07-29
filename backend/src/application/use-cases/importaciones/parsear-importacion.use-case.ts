import { Importacion } from '../../../domain/entities/importacion.entity';
import { EstadoFilaImportacion } from '../../../domain/enums/estado-fila-importacion.enum';
import { PeriodoCerradoError } from '../../../domain/errors/periodo-cerrado.error';
import { PeriodoEliminadoError } from '../../../domain/errors/periodo-eliminado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { ExcelParserPort } from '../../ports/excel-parser.port';
import { ImportacionRepository } from '../../ports/importacion.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import {
  FilaImportacionValidada,
  ValidarFilasImportacionService,
} from '../../services/validar-filas-importacion.service';

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

function contarPorEstado(filas: FilaImportacionValidada[]) {
  return {
    ok: filas.filter((f) => f.estado === EstadoFilaImportacion.OK).length,
    retroactivas: filas.filter(
      (f) => f.estado === EstadoFilaImportacion.RETROACTIVO,
    ).length,
    advertencias: filas.filter(
      (f) => f.estado === EstadoFilaImportacion.ADVERTENCIA,
    ).length,
    errores: filas.filter((f) => f.estado === EstadoFilaImportacion.ERROR)
      .length,
  };
}

export class ParsearImportacionUseCase {
  constructor(
    private readonly periodoRepository: PeriodoRepository,
    private readonly excelParser: ExcelParserPort,
    private readonly validarFilas: ValidarFilasImportacionService,
    private readonly importacionRepository: ImportacionRepository,
  ) {}

  async ejecutar(
    comando: ParsearImportacionComando,
  ): Promise<ResultadoParseoImportacion> {
    const periodo = await this.periodoRepository.buscarPorId(comando.periodoId);
    if (!periodo) {
      throw new PeriodoNoEncontradoError(comando.periodoId);
    }
    if (periodo.estaEliminado()) {
      throw new PeriodoEliminadoError(comando.periodoId);
    }
    if (periodo.estaCerrado()) {
      throw new PeriodoCerradoError(comando.periodoId);
    }

    const filasCrudas = this.excelParser.parsear(comando.contenido);
    const filas = await this.validarFilas.validar(filasCrudas, periodo);
    const resumen = contarPorEstado(filas);

    const importacion = await this.importacionRepository.crear({
      periodoId: comando.periodoId,
      usuarioId: comando.usuarioId,
      archivo: comando.nombreArchivo,
      contenido: comando.contenido,
      filasOk: resumen.ok,
      filasAdvertencia: resumen.advertencias,
      filasError: resumen.errores,
      filasRetroactivas: resumen.retroactivas,
    });

    return { importacion, filas };
  }
}
