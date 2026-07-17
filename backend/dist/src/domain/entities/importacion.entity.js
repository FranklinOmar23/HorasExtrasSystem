"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Importacion = void 0;
class Importacion {
    id;
    periodoId;
    usuarioId;
    archivo;
    filasOk;
    filasAdvertencia;
    filasError;
    importadoEn;
    confirmadaEn;
    constructor(id, periodoId, usuarioId, archivo, filasOk, filasAdvertencia, filasError, importadoEn, confirmadaEn) {
        this.id = id;
        this.periodoId = periodoId;
        this.usuarioId = usuarioId;
        this.archivo = archivo;
        this.filasOk = filasOk;
        this.filasAdvertencia = filasAdvertencia;
        this.filasError = filasError;
        this.importadoEn = importadoEn;
        this.confirmadaEn = confirmadaEn;
    }
    estaConfirmada() {
        return this.confirmadaEn !== null;
    }
}
exports.Importacion = Importacion;
//# sourceMappingURL=importacion.entity.js.map