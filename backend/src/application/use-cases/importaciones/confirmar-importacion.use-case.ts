import { Importacion } from '../../../domain/entities/importacion.entity';
import { EstadoFilaImportacion } from '../../../domain/enums/estado-fila-importacion.enum';
import { OrigenRegistro } from '../../../domain/enums/origen-registro.enum';
import { ImportacionNoEncontradaError } from '../../../domain/errors/importacion-no-encontrada.error';
import { ImportacionYaConfirmadaError } from '../../../domain/errors/importacion-ya-confirmada.error';
import { PeriodoCerradoError } from '../../../domain/errors/periodo-cerrado.error';
import { PeriodoNoEncontradoError } from '../../../domain/errors/periodo-no-encontrado.error';
import { CalcularDesgloseService } from '../../services/calcular-desglose.service';
import {
  FilaImportacionValidada,
  ValidarFilasImportacionService,
} from '../../services/validar-filas-importacion.service';
import { ExcelParserPort } from '../../ports/excel-parser.port';
import { ImportacionRepository } from '../../ports/importacion.repository.port';
import { PeriodoRepository } from '../../ports/periodo.repository.port';
import { RegistroHorasRepository } from '../../ports/registro-horas.repository.port';

export interface ConfirmarImportacionComando {
  importacionId: string;
  incluirAdvertencias: boolean;
}

function filaEsPersistible(
  fila: FilaImportacionValidada,
  incluirAdvertencias: boolean,
): boolean {
  if (fila.estado === EstadoFilaImportacion.OK) {
    return true;
  }
  return (
    fila.estado === EstadoFilaImportacion.ADVERTENCIA && incluirAdvertencias
  );
}

/**
 * Re-parsea y re-valida el archivo original (guardado en la importación) en
 * vez de confiar en la vista previa: así una confirmación tardía siempre
 * refleja el estado actual de la base (ej. detecta duplicados creados por
 * otra importación confirmada entretanto).
 */
export class ConfirmarImportacionUseCase {
  constructor(
    private readonly importacionRepository: ImportacionRepository,
    private readonly periodoRepository: PeriodoRepository,
    private readonly excelParser: ExcelParserPort,
    private readonly validarFilas: ValidarFilasImportacionService,
    private readonly registroHorasRepository: RegistroHorasRepository,
    private readonly calcularDesglose: CalcularDesgloseService,
  ) {}

  async ejecutar(comando: ConfirmarImportacionComando): Promise<Importacion> {
    const importacion = await this.importacionRepository.buscarPorId(
      comando.importacionId,
    );
    if (!importacion) {
      throw new ImportacionNoEncontradaError(comando.importacionId);
    }
    if (importacion.estaConfirmada()) {
      throw new ImportacionYaConfirmadaError(comando.importacionId);
    }

    const periodo = await this.periodoRepository.buscarPorId(
      importacion.periodoId,
    );
    if (!periodo) {
      throw new PeriodoNoEncontradoError(importacion.periodoId);
    }
    if (periodo.estaCerrado()) {
      throw new PeriodoCerradoError(importacion.periodoId);
    }

    const contenido = await this.importacionRepository.obtenerContenido(
      comando.importacionId,
    );
    if (!contenido) {
      throw new ImportacionNoEncontradaError(comando.importacionId);
    }

    const filasCrudas = this.excelParser.parsear(contenido);
    const filas = await this.validarFilas.validar(filasCrudas, periodo);
    const filasAPersistir = filas.filter((fila) =>
      filaEsPersistible(fila, comando.incluirAdvertencias),
    );

    // Se calcula el desglose de todas las filas antes de persistir ninguna:
    // si el salario de un empleado dejó de estar vigente entre el parseo y
    // la confirmación, la importación completa falla en vez de aplicarse a medias.
    const filasConCalculo = await Promise.all(
      filasAPersistir.map(async (fila) => ({
        fila,
        calculo: await this.calcularDesglose.calcular(
          fila.empleadoId as string,
          fila.fecha as Date,
          fila.horaEntrada as string,
          fila.horaSalida as string,
        ),
      })),
    );

    for (const { fila, calculo } of filasConCalculo) {
      await this.registroHorasRepository.crear(
        {
          periodoId: importacion.periodoId,
          empleadoId: fila.empleadoId as string,
          fecha: fila.fecha as Date,
          horaEntrada: fila.horaEntrada as string,
          horaSalida: fila.horaSalida as string,
          origen: OrigenRegistro.EXCEL,
          importacionId: importacion.id,
          comentario: null,
        },
        calculo,
      );
    }

    return this.importacionRepository.marcarConfirmada(
      comando.importacionId,
      new Date(),
    );
  }
}
