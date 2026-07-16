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
exports.EmpleadoPrismaRepository = void 0;
const common_1 = require("@nestjs/common");
const empleado_entity_1 = require("../../domain/entities/empleado.entity");
const prisma_service_1 = require("../prisma/prisma.service");
function aDominio(empleado) {
    return new empleado_entity_1.Empleado(empleado.id, empleado.codigo, empleado.nombre, empleado.cedula, empleado.posicion, empleado.activo);
}
let EmpleadoPrismaRepository = class EmpleadoPrismaRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar(filtro) {
        const where = {};
        if (filtro.activo !== undefined) {
            where.activo = filtro.activo;
        }
        if (filtro.search) {
            const codigoBuscado = Number(filtro.search);
            where.OR = [
                { nombre: { contains: filtro.search } },
                ...(Number.isInteger(codigoBuscado) ? [{ codigo: codigoBuscado }] : []),
            ];
        }
        const empleados = await this.prisma.empleado.findMany({
            where,
            orderBy: { nombre: 'asc' },
        });
        return empleados.map(aDominio);
    }
    async buscarPorId(id) {
        const empleado = await this.prisma.empleado.findUnique({ where: { id } });
        return empleado ? aDominio(empleado) : null;
    }
    async buscarPorCodigo(codigo) {
        const empleado = await this.prisma.empleado.findUnique({
            where: { codigo },
        });
        return empleado ? aDominio(empleado) : null;
    }
    async buscarPorCedula(cedula) {
        const empleado = await this.prisma.empleado.findUnique({
            where: { cedula },
        });
        return empleado ? aDominio(empleado) : null;
    }
    async crear(datos) {
        const empleado = await this.prisma.empleado.create({
            data: {
                codigo: datos.codigo,
                nombre: datos.nombre,
                cedula: datos.cedula,
                posicion: datos.posicion,
                salarios: {
                    create: {
                        montoMensual: datos.salarioInicial.montoMensual.toString(),
                        vigenteDesde: datos.salarioInicial.vigenteDesde,
                    },
                },
            },
        });
        return aDominio(empleado);
    }
    async actualizar(id, datos) {
        const empleado = await this.prisma.empleado.update({
            where: { id },
            data: datos,
        });
        return aDominio(empleado);
    }
};
exports.EmpleadoPrismaRepository = EmpleadoPrismaRepository;
exports.EmpleadoPrismaRepository = EmpleadoPrismaRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmpleadoPrismaRepository);
//# sourceMappingURL=empleado.prisma.repository.js.map