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
exports.DiaReporteEmpleadoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const calculo_respuesta_dto_1 = require("../registros/calculo-respuesta.dto");
class DiaReporteEmpleadoDto {
    fecha;
    horaEntrada;
    horaSalida;
    calculos;
    total;
}
exports.DiaReporteEmpleadoDto = DiaReporteEmpleadoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-08-05' }),
    __metadata("design:type", String)
], DiaReporteEmpleadoDto.prototype, "fecha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '08:30' }),
    __metadata("design:type", String)
], DiaReporteEmpleadoDto.prototype, "horaEntrada", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '19:00' }),
    __metadata("design:type", String)
], DiaReporteEmpleadoDto.prototype, "horaSalida", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [calculo_respuesta_dto_1.CalculoRespuestaDto] }),
    __metadata("design:type", Array)
], DiaReporteEmpleadoDto.prototype, "calculos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], DiaReporteEmpleadoDto.prototype, "total", void 0);
//# sourceMappingURL=dia-reporte-empleado.dto.js.map