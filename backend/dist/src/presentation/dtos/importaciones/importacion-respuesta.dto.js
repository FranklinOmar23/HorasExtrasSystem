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
exports.ImportacionRespuestaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ImportacionRespuestaDto {
    id;
    periodoId;
    usuarioId;
    archivo;
    filasOk;
    filasAdvertencia;
    filasError;
    importadoEn;
    confirmadaEn;
}
exports.ImportacionRespuestaDto = ImportacionRespuestaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ImportacionRespuestaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ImportacionRespuestaDto.prototype, "periodoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ImportacionRespuestaDto.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ImportacionRespuestaDto.prototype, "archivo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ImportacionRespuestaDto.prototype, "filasOk", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ImportacionRespuestaDto.prototype, "filasAdvertencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ImportacionRespuestaDto.prototype, "filasError", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ImportacionRespuestaDto.prototype, "importadoEn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], ImportacionRespuestaDto.prototype, "confirmadaEn", void 0);
//# sourceMappingURL=importacion-respuesta.dto.js.map