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
exports.PeriodoPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const periodo_entity_1 = require("../../domain/entities/periodo.entity");
const estado_periodo_enum_1 = require("../../domain/enums/estado-periodo.enum");
const prisma_service_1 = require("../prisma/prisma.service");
function aDominio(periodo) {
    return new periodo_entity_1.Periodo(periodo.id, periodo.fechaInicio, periodo.fechaFin, periodo.estado, periodo.cerradoEn, periodo.cerradoPorId);
}
let PeriodoPrismaRepository = class PeriodoPrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar() {
        const periodos = await this.prisma.periodo.findMany({
            orderBy: { fechaInicio: 'desc' },
        });
        return periodos.map(aDominio);
    }
    async buscarPorId(id) {
        const periodo = await this.prisma.periodo.findUnique({ where: { id } });
        return periodo ? aDominio(periodo) : null;
    }
    async buscarPorFechas(fechaInicio, fechaFin) {
        const periodo = await this.prisma.periodo.findUnique({
            where: { fechaInicio_fechaFin: { fechaInicio, fechaFin } },
        });
        return periodo ? aDominio(periodo) : null;
    }
    async crear(datos) {
        const periodo = await this.prisma.periodo.create({ data: datos });
        return aDominio(periodo);
    }
    async cerrar(id, cerradoPorId, cerradoEn) {
        const periodo = await this.prisma.periodo.update({
            where: { id },
            data: { estado: estado_periodo_enum_1.EstadoPeriodo.CERRADO, cerradoPorId, cerradoEn },
        });
        return aDominio(periodo);
    }
};
exports.PeriodoPrismaRepository = PeriodoPrismaRepository;
exports.PeriodoPrismaRepository = PeriodoPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PeriodoPrismaRepository);
//# sourceMappingURL=periodo.prisma.repository.js.map