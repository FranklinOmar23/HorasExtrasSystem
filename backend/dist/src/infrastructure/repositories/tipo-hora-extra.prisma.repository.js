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
exports.TipoHoraExtraPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const tipo_hora_extra_entity_1 = require("../../domain/entities/tipo-hora-extra.entity");
const decimal_mapper_1 = require("../prisma/decimal.mapper");
const prisma_service_1 = require("../prisma/prisma.service");
function aDominio(tipo) {
    return new tipo_hora_extra_entity_1.TipoHoraExtra(tipo.id, tipo.codigo, tipo.nombre, (0, decimal_mapper_1.decimalDesdeDb)(tipo.porcentaje), tipo.modoValorizacion, tipo.activo);
}
let TipoHoraExtraPrismaRepository = class TipoHoraExtraPrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar() {
        const tipos = await this.prisma.tipoHoraExtra.findMany({
            orderBy: { codigo: 'asc' },
        });
        return tipos.map(aDominio);
    }
    async buscarPorId(id) {
        const tipo = await this.prisma.tipoHoraExtra.findUnique({
            where: { id },
        });
        return tipo ? aDominio(tipo) : null;
    }
    async actualizar(id, datos) {
        const tipo = await this.prisma.tipoHoraExtra.update({
            where: { id },
            data: {
                nombre: datos.nombre,
                porcentaje: datos.porcentaje?.toString(),
                modoValorizacion: datos.modoValorizacion,
                activo: datos.activo,
            },
        });
        return aDominio(tipo);
    }
};
exports.TipoHoraExtraPrismaRepository = TipoHoraExtraPrismaRepository;
exports.TipoHoraExtraPrismaRepository = TipoHoraExtraPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TipoHoraExtraPrismaRepository);
//# sourceMappingURL=tipo-hora-extra.prisma.repository.js.map