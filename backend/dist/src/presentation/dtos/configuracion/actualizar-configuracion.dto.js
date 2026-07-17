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
exports.ActualizarConfiguracionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ActualizarConfiguracionDto {
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
exports.ActualizarConfiguracionDto = ActualizarConfiguracionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '23.83' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarConfiguracionDto.prototype, "divisor_salario", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '8' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarConfiguracionDto.prototype, "horas_jornada", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarConfiguracionDto.prototype, "horas_almuerzo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '08:30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarConfiguracionDto.prototype, "entrada_semana", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '17:30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarConfiguracionDto.prototype, "salida_semana", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '09:00' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarConfiguracionDto.prototype, "entrada_sabado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '13:00' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarConfiguracionDto.prototype, "salida_sabado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '21:00' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarConfiguracionDto.prototype, "inicio_nocturna", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '0' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarConfiguracionDto.prototype, "tolerancia_minutos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ninguno' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarConfiguracionDto.prototype, "redondeo", void 0);
//# sourceMappingURL=actualizar-configuracion.dto.js.map