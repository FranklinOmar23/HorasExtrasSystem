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
exports.FilaImportacionRespuestaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const estado_fila_importacion_enum_1 = require("../../../domain/enums/estado-fila-importacion.enum");
class FilaImportacionRespuestaDto {
    linea;
    fecha;
    codigo;
    nombre;
    entrada;
    salida;
    estado;
    mensajes;
}
exports.FilaImportacionRespuestaDto = FilaImportacionRespuestaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Número de fila en el Excel (1 = encabezado).' }),
    __metadata("design:type", Number)
], FilaImportacionRespuestaDto.prototype, "linea", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: '2026-08-05' }),
    __metadata("design:type", Object)
], FilaImportacionRespuestaDto.prototype, "fecha", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], FilaImportacionRespuestaDto.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true }),
    __metadata("design:type", Object)
], FilaImportacionRespuestaDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: '08:30' }),
    __metadata("design:type", Object)
], FilaImportacionRespuestaDto.prototype, "entrada", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ nullable: true, example: '19:00' }),
    __metadata("design:type", Object)
], FilaImportacionRespuestaDto.prototype, "salida", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: estado_fila_importacion_enum_1.EstadoFilaImportacion }),
    __metadata("design:type", String)
], FilaImportacionRespuestaDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], FilaImportacionRespuestaDto.prototype, "mensajes", void 0);
//# sourceMappingURL=fila-importacion-respuesta.dto.js.map