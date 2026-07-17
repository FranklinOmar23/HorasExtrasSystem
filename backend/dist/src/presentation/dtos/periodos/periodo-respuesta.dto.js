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
exports.PeriodoRespuestaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PeriodoRespuestaDto {
    id;
    fechaInicio;
    fechaFin;
    estado;
    cerradoEn;
    cerradoPorId;
}
exports.PeriodoRespuestaDto = PeriodoRespuestaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PeriodoRespuestaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-01' }),
    __metadata("design:type", String)
], PeriodoRespuestaDto.prototype, "fechaInicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-15' }),
    __metadata("design:type", String)
], PeriodoRespuestaDto.prototype, "fechaFin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['ABIERTO', 'CERRADO'] }),
    __metadata("design:type", String)
], PeriodoRespuestaDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: null }),
    __metadata("design:type", Object)
], PeriodoRespuestaDto.prototype, "cerradoEn", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: null }),
    __metadata("design:type", Object)
], PeriodoRespuestaDto.prototype, "cerradoPorId", void 0);
//# sourceMappingURL=periodo-respuesta.dto.js.map