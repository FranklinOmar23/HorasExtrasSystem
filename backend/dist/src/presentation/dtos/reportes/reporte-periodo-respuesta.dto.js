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
exports.ReportePeriodoRespuestaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const periodo_respuesta_dto_1 = require("../periodos/periodo-respuesta.dto");
const fila_reporte_periodo_dto_1 = require("./fila-reporte-periodo.dto");
class ReportePeriodoRespuestaDto {
    periodo;
    filas;
    granTotal;
}
exports.ReportePeriodoRespuestaDto = ReportePeriodoRespuestaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: periodo_respuesta_dto_1.PeriodoRespuestaDto }),
    __metadata("design:type", periodo_respuesta_dto_1.PeriodoRespuestaDto)
], ReportePeriodoRespuestaDto.prototype, "periodo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [fila_reporte_periodo_dto_1.FilaReportePeriodoDto] }),
    __metadata("design:type", Array)
], ReportePeriodoRespuestaDto.prototype, "filas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ReportePeriodoRespuestaDto.prototype, "granTotal", void 0);
//# sourceMappingURL=reporte-periodo-respuesta.dto.js.map