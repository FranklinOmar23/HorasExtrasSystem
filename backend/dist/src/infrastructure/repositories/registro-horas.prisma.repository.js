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
exports.RegistroHorasPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const calculo_entity_1 = require("../../domain/entities/calculo.entity");
const registro_horas_entity_1 = require("../../domain/entities/registro-horas.entity");
const decimal_mapper_1 = require("../prisma/decimal.mapper");
const prisma_service_1 = require("../prisma/prisma.service");
function aDominioRegistro(registro) {
    return new registro_horas_entity_1.RegistroHoras(registro.id, registro.periodoId, registro.empleadoId, registro.fecha, registro.horaEntrada, registro.horaSalida, registro.origen, registro.importacionId, registro.comentario);
}
function aDominioCalculo(calculo, codigo) {
    return new calculo_entity_1.Calculo(calculo.id, calculo.registroId, calculo.tipoHoraId, codigo, (0, decimal_mapper_1.decimalDesdeDb)(calculo.cantidadHoras), (0, decimal_mapper_1.decimalDesdeDb)(calculo.porcentajeAplicado), (0, decimal_mapper_1.decimalDesdeDb)(calculo.salarioHoraUsado), (0, decimal_mapper_1.decimalDesdeDb)(calculo.monto), calculo.calculadoEn);
}
function aDominio(registro, codigosPorTipoId) {
    return {
        registro: aDominioRegistro(registro),
        calculos: registro.calculos.map((c) => aDominioCalculo(c, codigosPorTipoId.get(c.tipoHoraId) ?? '')),
    };
}
function datosCalculos(filas) {
    return filas.map((fila) => ({
        tipoHoraId: fila.tipoHoraId,
        cantidadHoras: fila.cantidadHoras.toString(),
        porcentajeAplicado: fila.porcentajeAplicado.toString(),
        salarioHoraUsado: fila.salarioHoraUsado.toString(),
        monto: fila.monto.toString(),
    }));
}
let RegistroHorasPrismaRepository = class RegistroHorasPrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async mapaCodigosPorTipoId() {
        const tipos = await this.prisma.tipoHoraExtra.findMany({
            select: { id: true, codigo: true },
        });
        return new Map(tipos.map((t) => [t.id, t.codigo]));
    }
    async listarPorPeriodo(periodoId, empleadoId) {
        const where = { periodoId };
        if (empleadoId) {
            where.empleadoId = empleadoId;
        }
        const [registros, codigosPorTipoId] = await Promise.all([
            this.prisma.registroHoras.findMany({
                where,
                include: { calculos: true },
                orderBy: { fecha: 'asc' },
            }),
            this.mapaCodigosPorTipoId(),
        ]);
        return registros.map((r) => aDominio(r, codigosPorTipoId));
    }
    async buscarPorId(id) {
        const [registro, codigosPorTipoId] = await Promise.all([
            this.prisma.registroHoras.findUnique({
                where: { id },
                include: { calculos: true },
            }),
            this.mapaCodigosPorTipoId(),
        ]);
        return registro ? aDominio(registro, codigosPorTipoId) : null;
    }
    async crear(datos, filas) {
        const [registro, codigosPorTipoId] = await Promise.all([
            this.prisma.registroHoras.create({
                data: {
                    periodoId: datos.periodoId,
                    empleadoId: datos.empleadoId,
                    fecha: datos.fecha,
                    horaEntrada: datos.horaEntrada,
                    horaSalida: datos.horaSalida,
                    origen: datos.origen,
                    importacionId: datos.importacionId,
                    comentario: datos.comentario,
                    calculos: { create: datosCalculos(filas) },
                },
                include: { calculos: true },
            }),
            this.mapaCodigosPorTipoId(),
        ]);
        return aDominio(registro, codigosPorTipoId);
    }
    async actualizar(id, datos, filas) {
        const [registro, codigosPorTipoId] = await Promise.all([
            this.prisma.registroHoras.update({
                where: { id },
                data: {
                    fecha: datos.fecha,
                    horaEntrada: datos.horaEntrada,
                    horaSalida: datos.horaSalida,
                    comentario: datos.comentario,
                    calculos: {
                        deleteMany: {},
                        create: datosCalculos(filas),
                    },
                },
                include: { calculos: true },
            }),
            this.mapaCodigosPorTipoId(),
        ]);
        return aDominio(registro, codigosPorTipoId);
    }
    async eliminar(id) {
        await this.prisma.registroHoras.delete({ where: { id } });
    }
};
exports.RegistroHorasPrismaRepository = RegistroHorasPrismaRepository;
exports.RegistroHorasPrismaRepository = RegistroHorasPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RegistroHorasPrismaRepository);
//# sourceMappingURL=registro-horas.prisma.repository.js.map