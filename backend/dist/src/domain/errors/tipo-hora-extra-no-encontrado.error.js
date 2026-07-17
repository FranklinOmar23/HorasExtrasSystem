"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoHoraExtraNoEncontradoError = void 0;
const domain_error_1 = require("./domain.error");
class TipoHoraExtraNoEncontradoError extends domain_error_1.DomainError {
    code = 'TIPO_HORA_EXTRA_NO_ENCONTRADO';
    httpStatus = 404;
    constructor(id) {
        super(`No se encontró el tipo de hora extra ${id}.`);
    }
}
exports.TipoHoraExtraNoEncontradoError = TipoHoraExtraNoEncontradoError;
//# sourceMappingURL=tipo-hora-extra-no-encontrado.error.js.map