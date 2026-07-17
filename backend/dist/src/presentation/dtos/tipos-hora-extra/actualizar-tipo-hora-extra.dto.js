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
exports.ActualizarTipoHoraExtraDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ActualizarTipoHoraExtraDto {
    nombre;
    porcentaje;
    activo;
}
exports.ActualizarTipoHoraExtraDto = ActualizarTipoHoraExtraDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Hora extra 35%' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarTipoHoraExtraDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '35.00' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^\d+(\.\d{1,2})?$/, {
        message: 'El porcentaje debe ser un decimal válido (ej: 35.00).',
    }),
    __metadata("design:type", String)
], ActualizarTipoHoraExtraDto.prototype, "porcentaje", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ActualizarTipoHoraExtraDto.prototype, "activo", void 0);
//# sourceMappingURL=actualizar-tipo-hora-extra.dto.js.map