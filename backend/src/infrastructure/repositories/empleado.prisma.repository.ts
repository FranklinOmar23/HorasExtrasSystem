import { Injectable } from '@nestjs/common';
import {
  Empleado as EmpleadoPrisma,
  Prisma,
  VwEmpleado as VwEmpleadoPrisma,
} from '@prisma/client';
import {
  ActualizarEmpleadoDatos,
  CrearEmpleadoDatos,
  EmpleadoConSalario,
  EmpleadoRepository,
  EmpleadosPaginados,
  FiltroEmpleados,
} from '../../application/ports/empleado.repository.port';
import { Empleado } from '../../domain/entities/empleado.entity';
import { decimalDesdeDb } from '../prisma/decimal.mapper';
import { PrismaService } from '../prisma/prisma.service';

function aDominio(empleado: EmpleadoPrisma): Empleado {
  return new Empleado(
    empleado.id,
    empleado.codigo,
    empleado.nombre,
    empleado.cedula,
    empleado.posicion,
    empleado.activo,
  );
}

function aConSalario(fila: VwEmpleadoPrisma): EmpleadoConSalario {
  return {
    id: fila.id,
    codigo: fila.codigo,
    nombre: fila.nombre,
    cedula: fila.cedula,
    posicion: fila.posicion,
    activo: fila.activo,
    montoMensualVigente:
      fila.montoMensualVigente === null
        ? null
        : decimalDesdeDb(fila.montoMensualVigente),
  };
}

@Injectable()
export class EmpleadoPrismaRepository implements EmpleadoRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Lee de `vw_empleados` (vista SQL que ya trae el salario vigente unido)
   *  en vez de resolverlo aparte por cada empleado. */
  async listar(filtro: FiltroEmpleados): Promise<EmpleadosPaginados> {
    const where: Prisma.VwEmpleadoWhereInput = {};

    if (filtro.activo !== undefined) {
      where.activo = filtro.activo;
    }

    if (filtro.search) {
      const codigoBuscado = Number(filtro.search);
      where.OR = [
        { nombre: { contains: filtro.search } },
        { cedula: { contains: filtro.search } },
        ...(Number.isInteger(codigoBuscado) ? [{ codigo: codigoBuscado }] : []),
      ];
    }

    if (filtro.salarioMin || filtro.salarioMax) {
      where.montoMensualVigente = {
        gte: filtro.salarioMin?.toString(),
        lte: filtro.salarioMax?.toString(),
      };
    }

    const [filas, total] = await Promise.all([
      this.prisma.vwEmpleado.findMany({
        where,
        orderBy: { nombre: 'asc' },
        skip: (filtro.pagina - 1) * filtro.porPagina,
        take: filtro.porPagina,
      }),
      this.prisma.vwEmpleado.count({ where }),
    ]);

    return { items: filas.map(aConSalario), total };
  }

  async buscarPorId(id: string): Promise<Empleado | null> {
    const empleado = await this.prisma.empleado.findUnique({ where: { id } });
    return empleado ? aDominio(empleado) : null;
  }

  async buscarPorCodigo(codigo: number): Promise<Empleado | null> {
    const empleado = await this.prisma.empleado.findUnique({
      where: { codigo },
    });
    return empleado ? aDominio(empleado) : null;
  }

  async buscarPorCedula(cedula: string): Promise<Empleado | null> {
    const empleado = await this.prisma.empleado.findUnique({
      where: { cedula },
    });
    return empleado ? aDominio(empleado) : null;
  }

  async crear(datos: CrearEmpleadoDatos): Promise<Empleado> {
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

  async actualizar(
    id: string,
    datos: ActualizarEmpleadoDatos,
  ): Promise<Empleado> {
    const empleado = await this.prisma.empleado.update({
      where: { id },
      data: datos,
    });
    return aDominio(empleado);
  }
}
