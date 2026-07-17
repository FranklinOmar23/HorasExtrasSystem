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
exports.ActualizarUsuarioDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const rol_usuario_enum_1 = require("../../../domain/enums/rol-usuario.enum");
class ActualizarUsuarioDto {
    nombre;
    rol;
    activo;
    password;
}
exports.ActualizarUsuarioDto = ActualizarUsuarioDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Ana Familia' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarUsuarioDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: rol_usuario_enum_1.RolUsuario }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(rol_usuario_enum_1.RolUsuario, { message: 'El rol debe ser ADMIN o RRHH.' }),
    __metadata("design:type", String)
], ActualizarUsuarioDto.prototype, "rol", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ActualizarUsuarioDto.prototype, "activo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Si se envía, reemplaza la contraseña.' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6, { message: 'La contraseña debe tener al menos 6 caracteres.' }),
    __metadata("design:type", String)
], ActualizarUsuarioDto.prototype, "password", void 0);
//# sourceMappingURL=actualizar-usuario.dto.js.map