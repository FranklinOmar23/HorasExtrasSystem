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
exports.ReporteEmpleadoRespuestaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const periodo_respuesta_dto_1 = require("../periodos/periodo-respuesta.dto");
const desglose_tipo_hora_dto_1 = require("./desglose-tipo-hora.dto");
const dia_reporte_empleado_dto_1 = require("./dia-reporte-empleado.dto");
const empleado_reporte_dto_1 = require("./empleado-reporte.dto");
class ReporteEmpleadoRespuestaDto {
    periodo;
    empleado;
    salarioHora;
    dias;
    horas;
    montos;
    total;
}
exports.ReporteEmpleadoRespuestaDto = ReporteEmpleadoRespuestaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: periodo_respuesta_dto_1.PeriodoRespuestaDto }),
    __metadata("design:type", periodo_respuesta_dto_1.PeriodoRespuestaDto)
], ReporteEmpleadoRespuestaDto.prototype, "periodo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: empleado_reporte_dto_1.EmpleadoReporteDto }),
    __metadata("design:type", empleado_reporte_dto_1.EmpleadoReporteDto)
], ReporteEmpleadoRespuestaDto.prototype, "empleado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReporteEmpleadoRespuestaDto.prototype, "salarioHora", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [dia_reporte_empleado_dto_1.DiaReporteEmpleadoDto] }),
    __metadata("design:type", Array)
], ReporteEmpleadoRespuestaDto.prototype, "dias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: desglose_tipo_hora_dto_1.DesgloseTipoHoraDto }),
    __metadata("design:type", desglose_tipo_hora_dto_1.DesgloseTipoHoraDto)
], ReporteEmpleadoRespuestaDto.prototype, "horas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: desglose_tipo_hora_dto_1.DesgloseTipoHoraDto }),
    __metadata("design:type", desglose_tipo_hora_dto_1.DesgloseTipoHoraDto)
], ReporteEmpleadoRespuestaDto.prototype, "montos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReporteEmpleadoRespuestaDto.prototype, "total", void 0);
//# sourceMappingURL=reporte-empleado-respuesta.dto.js.map