"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParsearImportacionRespuestaDto = exports.ResumenImportacionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const fila_importacion_respuesta_dto_1 = require("./fila-importacion-respuesta.dto");
class ResumenImportacionDto {
    ok;
    advertencias;
    errores;
}
exports.ResumenImportacionDto = ResumenImportacionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResumenImportacionDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResumenImportacionDto.prototype, "advertencias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ResumenImportacionDto.prototype, "errores", void 0);
class ParsearImportacionRespuestaDto {
    importacionId;
    filas;
    resumen;
}
exports.ParsearImportacionRespuestaDto = ParsearImportacionRespuestaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ParsearImportacionRespuestaDto.prototype, "importacionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [fila_importacion_respuesta_dto_1.FilaImportacionRespuestaDto] }),
    __metadata("design:type", Array)
], ParsearImportacionRespuestaDto.prototype, "filas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: ResumenImportacionDto }),
    __metadata("design:type", ResumenImportacionDto)
], ParsearImportacionRespuestaDto.prototype, "resumen", void 0);
//# sourceMappingURL=parsear-importacion-respuesta.dto.js.map