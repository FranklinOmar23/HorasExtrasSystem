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
exports.SalarioPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const salario_entity_1 = require("../../domain/entities/salario.entity");
const decimal_mapper_1 = require("../prisma/decimal.mapper");
const prisma_service_1 = require("../prisma/prisma.service");
function aDominio(salario) {
    return new salario_entity_1.Salario(salario.id, salario.empleadoId, (0, decimal_mapper_1.decimalDesdeDb)(salario.montoMensual), salario.vigenteDesde, salario.vigenteHasta);
}
let SalarioPrismaRepository = class SalarioPrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listarPorEmpleado(empleadoId) {
        const salarios = await this.prisma.salario.findMany({
            where: { empleadoId },
            orderBy: { vigenteDesde: 'desc' },
        });
        return salarios.map(aDominio);
    }
    async crear(empleadoId, datos, cerrarVigenteAnteriorHasta) {
        const [, nuevo] = await this.prisma.$transaction([
            this.prisma.salario.updateMany({
                where: { empleadoId, vigenteHasta: null },
                data: { vigenteHasta: cerrarVigenteAnteriorHasta },
            }),
            this.prisma.salario.create({
                data: {
                    empleadoId,
                    montoMensual: datos.montoMensual.toString(),
                    vigenteDesde: datos.vigenteDesde,
                },
            }),
        ]);
        return aDominio(nuevo);
    }
    async buscarVigenteEn(empleadoId, fecha) {
        const salario = await this.prisma.salario.findFirst({
            where: {
                empleadoId,
                vigenteDesde: { lte: fecha },
                OR: [{ vigenteHasta: null }, { vigenteHasta: { gte: fecha } }],
            },
            orderBy: { vigenteDesde: 'desc' },
        });
        return salario ? aDominio(salario) : null;
    }
};
exports.SalarioPrismaRepository = SalarioPrismaRepository;
exports.SalarioPrismaRepository = SalarioPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalarioPrismaRepository);
//# sourceMappingURL=salario.prisma.repository.js.map