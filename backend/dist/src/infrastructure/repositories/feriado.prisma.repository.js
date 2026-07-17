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
exports.FeriadoPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const feriado_entity_1 = require("../../domain/entities/feriado.entity");
const prisma_service_1 = require("../prisma/prisma.service");
function aDominio(feriado) {
    return new feriado_entity_1.Feriado(feriado.id, feriado.fecha, feriado.descripcion);
}
let FeriadoPrismaRepository = class FeriadoPrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar(anio) {
        const feriados = await this.prisma.feriado.findMany({
            where: anio
                ? {
                    fecha: {
                        gte: new Date(Date.UTC(anio, 0, 1)),
                        lt: new Date(Date.UTC(anio + 1, 0, 1)),
                    },
                }
                : undefined,
            orderBy: { fecha: 'asc' },
        });
        return feriados.map(aDominio);
    }
    async buscarPorId(id) {
        const feriado = await this.prisma.feriado.findUnique({ where: { id } });
        return feriado ? aDominio(feriado) : null;
    }
    async buscarPorFecha(fecha) {
        const feriado = await this.prisma.feriado.findUnique({
            where: { fecha },
        });
        return feriado ? aDominio(feriado) : null;
    }
    async crear(datos) {
        const feriado = await this.prisma.feriado.create({ data: datos });
        return aDominio(feriado);
    }
    async eliminar(id) {
        await this.prisma.feriado.delete({ where: { id } });
    }
};
exports.FeriadoPrismaRepository = FeriadoPrismaRepository;
exports.FeriadoPrismaRepository = FeriadoPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeriadoPrismaRepository);
//# sourceMappingURL=feriado.prisma.repository.js.map