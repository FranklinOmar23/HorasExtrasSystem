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
exports.RegistroRespuestaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const calculo_respuesta_dto_1 = require("./calculo-respuesta.dto");
class RegistroRespuestaDto {
    id;
    periodoId;
    empleadoId;
    fecha;
    horaEntrada;
    horaSalida;
    origen;
    comentario;
    calculos;
}
exports.RegistroRespuestaDto = RegistroRespuestaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegistroRespuestaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegistroRespuestaDto.prototype, "periodoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], RegistroRespuestaDto.prototype, "empleadoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05' }),
    __metadata("design:type", String)
], RegistroRespuestaDto.prototype, "fecha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:30' }),
    __metadata("design:type", String)
], RegistroRespuestaDto.prototype, "horaEntrada", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '19:00' }),
    __metadata("design:type", String)
], RegistroRespuestaDto.prototype, "horaSalida", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['EXCEL', 'MANUAL'] }),
    __metadata("design:type", String)
], RegistroRespuestaDto.prototype, "origen", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], RegistroRespuestaDto.prototype, "comentario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [calculo_respuesta_dto_1.CalculoRespuestaDto] }),
    __metadata("design:type", Array)
], RegistroRespuestaDto.prototype, "calculos", void 0);
//# sourceMappingURL=registro-respuesta.dto.js.map