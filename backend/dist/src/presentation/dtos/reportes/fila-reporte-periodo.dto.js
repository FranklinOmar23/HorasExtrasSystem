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
exports.FilaReportePeriodoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const desglose_tipo_hora_dto_1 = require("./desglose-tipo-hora.dto");
const empleado_reporte_dto_1 = require("./empleado-reporte.dto");
class FilaReportePeriodoDto {
    empleado;
    salarioHora;
    horas;
    montos;
    total;
}
exports.FilaReportePeriodoDto = FilaReportePeriodoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: empleado_reporte_dto_1.EmpleadoReporteDto }),
    __metadata("design:type", empleado_reporte_dto_1.EmpleadoReporteDto)
], FilaReportePeriodoDto.prototype, "empleado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FilaReportePeriodoDto.prototype, "salarioHora", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: desglose_tipo_hora_dto_1.DesgloseTipoHoraDto }),
    __metadata("design:type", desglose_tipo_hora_dto_1.DesgloseTipoHoraDto)
], FilaReportePeriodoDto.prototype, "horas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: desglose_tipo_hora_dto_1.DesgloseTipoHoraDto }),
    __metadata("design:type", desglose_tipo_hora_dto_1.DesgloseTipoHoraDto)
], FilaReportePeriodoDto.prototype, "montos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], FilaReportePeriodoDto.prototype, "total", void 0);
//# sourceMappingURL=fila-reporte-periodo.dto.js.map