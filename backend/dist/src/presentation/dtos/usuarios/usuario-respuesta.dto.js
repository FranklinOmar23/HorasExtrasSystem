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
exports.UsuarioRespuestaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const rol_usuario_enum_1 = require("../../../domain/enums/rol-usuario.enum");
class UsuarioRespuestaDto {
    id;
    nombre;
    email;
    rol;
    activo;
}
exports.UsuarioRespuestaDto = UsuarioRespuestaDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioRespuestaDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioRespuestaDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], UsuarioRespuestaDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: rol_usuario_enum_1.RolUsuario }),
    __metadata("design:type", String)
], UsuarioRespuestaDto.prototype, "rol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], UsuarioRespuestaDto.prototype, "activo", void 0);
//# sourceMappingURL=usuario-respuesta.dto.js.map