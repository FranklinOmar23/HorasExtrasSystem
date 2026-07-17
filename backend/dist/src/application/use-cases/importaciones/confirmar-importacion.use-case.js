"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmarImportacionUseCase = void 0;
const estado_fila_importacion_enum_1 = require("../../../domain/enums/estado-fila-importacion.enum");
const origen_registro_enum_1 = require("../../../domain/enums/origen-registro.enum");
const importacion_no_encontrada_error_1 = require("../../../domain/errors/importacion-no-encontrada.error");
const importacion_ya_confirmada_error_1 = require("../../../domain/errors/importacion-ya-confirmada.error");
const periodo_cerrado_error_1 = require("../../../domain/errors/periodo-cerrado.error");
const periodo_no_encontrado_error_1 = require("../../../domain/errors/periodo-no-encontrado.error");
function filaEsPersistible(fila, incluirAdvertencias) {
    if (fila.estado === estado_fila_importacion_enum_1.EstadoFilaImportacion.OK) {
        return true;
    }
    return (fila.estado === estado_fila_importacion_enum_1.EstadoFilaImportacion.ADVERTENCIA && incluirAdvertencias);
}
class ConfirmarImportacionUseCase {
    importacionRepository;
    periodoRepository;
    excelParser;
    validarFilas;
    registroHorasRepository;
    calcularDesglose;
    constructor(importacionRepository, periodoRepository, excelParser, validarFilas, registroHorasRepository, calcularDesglose) {
        this.importacionRepository = importacionRepository;
        this.periodoRepository = periodoRepository;
        this.excelParser = excelParser;
        this.validarFilas = validarFilas;
        this.registroHorasRepository = registroHorasRepository;
        this.calcularDesglose = calcularDesglose;
    }
    async ejecutar(comando) {
        const importacion = await this.importacionRepository.buscarPorId(comando.importacionId);
        if (!importacion) {
            throw new importacion_no_encontrada_error_1.ImportacionNoEncontradaError(comando.importacionId);
        }
        if (importacion.estaConfirmada()) {
            throw new importacion_ya_confirmada_error_1.ImportacionYaConfirmadaError(comando.importacionId);
        }
        const periodo = await this.periodoRepository.buscarPorId(importacion.periodoId);
        if (!periodo) {
            throw new periodo_no_encontrado_error_1.PeriodoNoEncontradoError(importacion.periodoId);
        }
        if (periodo.estaCerrado()) {
            throw new periodo_cerrado_error_1.PeriodoCerradoError(importacion.periodoId);
        }
        const contenido = await this.importacionRepository.obtenerContenido(comando.importacionId);
        if (!contenido) {
            throw new importacion_no_encontrada_error_1.ImportacionNoEncontradaError(comando.importacionId);
        }
        const filasCrudas = this.excelParser.parsear(contenido);
        const filas = await this.validarFilas.validar(filasCrudas, periodo);
        const filasAPersistir = filas.filter((fila) => filaEsPersistible(fila, comando.incluirAdvertencias));
        const filasConCalculo = await Promise.all(filasAPersistir.map(async (fila) => ({
            fila,
            calculo: await this.calcularDesglose.calcular(fila.empleadoId, fila.fecha, fila.horaEntrada, fila.horaSalida),
        })));
        for (const { fila, calculo } of filasConCalculo) {
            await this.registroHorasRepository.crear({
                periodoId: importacion.periodoId,
                empleadoId: fila.empleadoId,
                fecha: fila.fecha,
                horaEntrada: fila.horaEntrada,
                horaSalida: fila.horaSalida,
                origen: origen_registro_enum_1.OrigenRegistro.EXCEL,
                importacionId: importacion.id,
                comentario: null,
            }, calculo);
        }
        return this.importacionRepository.marcarConfirmada(comando.importacionId, new Date());
    }
}
exports.ConfirmarImportacionUseCase = ConfirmarImportacionUseCase;
//# sourceMappingURL=confirmar-importacion.use-case.js.map