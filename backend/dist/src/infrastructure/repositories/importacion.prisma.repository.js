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
exports.ImportacionPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const importacion_entity_1 = require("../../domain/entities/importacion.entity");
const prisma_service_1 = require("../prisma/prisma.service");
function aDominio(importacion) {
    return new importacion_entity_1.Importacion(importacion.id, importacion.periodoId, importacion.usuarioId, importacion.archivo, importacion.filasOk, importacion.filasAdvertencia, importacion.filasError, importacion.importadoEn, importacion.confirmadaEn);
}
const SELECT_SIN_CONTENIDO = {
    id: true,
    periodoId: true,
    usuarioId: true,
    archivo: true,
    filasOk: true,
    filasAdvertencia: true,
    filasError: true,
    importadoEn: true,
    confirmadaEn: true,
};
let ImportacionPrismaRepository = class ImportacionPrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async crear(datos) {
        const importacion = await this.prisma.importacion.create({
            data: {
                periodoId: datos.periodoId,
                usuarioId: datos.usuarioId,
                archivo: datos.archivo,
                contenido: new Uint8Array(datos.contenido),
                filasOk: datos.filasOk,
                filasAdvertencia: datos.filasAdvertencia,
                filasError: datos.filasError,
            },
        });
        return aDominio(importacion);
    }
    async buscarPorId(id) {
        const importacion = await this.prisma.importacion.findUnique({
            where: { id },
            select: SELECT_SIN_CONTENIDO,
        });
        return importacion ? aDominio(importacion) : null;
    }
    async obtenerContenido(id) {
        const importacion = await this.prisma.importacion.findUnique({
            where: { id },
            select: { contenido: true },
        });
        return importacion ? Buffer.from(importacion.contenido) : null;
    }
    async listarPorPeriodo(periodoId) {
        const importaciones = await this.prisma.importacion.findMany({
            where: { periodoId },
            select: SELECT_SIN_CONTENIDO,
            orderBy: { importadoEn: 'desc' },
        });
        return importaciones.map(aDominio);
    }
    async marcarConfirmada(id, confirmadaEn) {
        const importacion = await this.prisma.importacion.update({
            where: { id },
            data: { confirmadaEn },
            select: SELECT_SIN_CONTENIDO,
        });
        return aDominio(importacion);
    }
};
exports.ImportacionPrismaRepository = ImportacionPrismaRepository;
exports.ImportacionPrismaRepository = ImportacionPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImportacionPrismaRepository);
//# sourceMappingURL=importacion.prisma.repository.js.map