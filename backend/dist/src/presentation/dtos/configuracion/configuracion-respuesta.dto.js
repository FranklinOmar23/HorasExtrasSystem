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
exports.ConfiguracionRespuestaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ConfiguracionRespuestaDto {
    divisor_salario;
    horas_jornada;
    horas_almuerzo;
    entrada_semana;
    salida_semana;
    entrada_sabado;
    salida_sabado;
    inicio_nocturna;
    tolerancia_minutos;
    redondeo;
}
exports.ConfiguracionRespuestaDto = ConfiguracionRespuestaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '23.83' }),
    __metadata("design:type", String)
], ConfiguracionRespuestaDto.prototype, "divisor_salario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '8' }),
    __metadata("design:type", String)
], ConfiguracionRespuestaDto.prototype, "horas_jornada", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '1' }),
    __metadata("design:type", String)
], ConfiguracionRespuestaDto.prototype, "horas_almuerzo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:30' }),
    __metadata("design:type", String)
], ConfiguracionRespuestaDto.prototype, "entrada_semana", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '17:30' }),
    __metadata("design:type", String)
], ConfiguracionRespuestaDto.prototype, "salida_semana", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '09:00' }),
    __metadata("design:type", String)
], ConfiguracionRespuestaDto.prototype, "entrada_sabado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '13:00' }),
    __metadata("design:type", String)
], ConfiguracionRespuestaDto.prototype, "salida_sabado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '21:00' }),
    __metadata("design:type", String)
], ConfiguracionRespuestaDto.prototype, "inicio_nocturna", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '0' }),
    __metadata("design:type", String)
], ConfiguracionRespuestaDto.prototype, "tolerancia_minutos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ninguno' }),
    __metadata("design:type", String)
], ConfiguracionRespuestaDto.prototype, "redondeo", void 0);
//# sourceMappingURL=configuracion-respuesta.dto.js.map