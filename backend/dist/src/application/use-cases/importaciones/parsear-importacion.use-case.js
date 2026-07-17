"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsearImportacionUseCase = void 0;
const estado_fila_importacion_enum_1 = require("../../../domain/enums/estado-fila-importacion.enum");
const periodo_cerrado_error_1 = require("../../../domain/errors/periodo-cerrado.error");
const periodo_no_encontrado_error_1 = require("../../../domain/errors/periodo-no-encontrado.error");
function contarPorEstado(filas) {
    return {
        ok: filas.filter((f) => f.estado === estado_fila_importacion_enum_1.EstadoFilaImportacion.OK).length,
        advertencias: filas.filter((f) => f.estado === estado_fila_importacion_enum_1.EstadoFilaImportacion.ADVERTENCIA).length,
        errores: filas.filter((f) => f.estado === estado_fila_importacion_enum_1.EstadoFilaImportacion.ERROR)
            .length,
    };
}
class ParsearImportacionUseCase {
    periodoRepository;
    excelParser;
    validarFilas;
    importacionRepository;
    constructor(periodoRepository, excelParser, validarFilas, importacionRepository) {
        this.periodoRepository = periodoRepository;
        this.excelParser = excelParser;
        this.validarFilas = validarFilas;
        this.importacionRepository = importacionRepository;
    }
    async ejecutar(comando) {
        const periodo = await this.periodoRepository.buscarPorId(comando.periodoId);
        if (!periodo) {
            throw new periodo_no_encontrado_error_1.PeriodoNoEncontradoError(comando.periodoId);
        }
        if (periodo.estaCerrado()) {
            throw new periodo_cerrado_error_1.PeriodoCerradoError(comando.periodoId);
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
        });
        return { importacion, filas };
    }
}
exports.ParsearImportacionUseCase = ParsearImportacionUseCase;
//# sourceMappingURL=parsear-importacion.use-case.js.map