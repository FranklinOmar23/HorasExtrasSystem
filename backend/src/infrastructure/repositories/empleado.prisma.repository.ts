import { Injectable } from '@nestjs/common';
import { Empleado as EmpleadoPrisma, Prisma } from '@prisma/client';
import {
  ActualizarEmpleadoDatos,
  CrearEmpleadoDatos,
  EmpleadoRepository,
  FiltroEmpleados,
} from '../../application/ports/empleado.repository.port';
import { Empleado } from '../../domain/entities/empleado.entity';
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

@Injectable()
export class EmpleadoPrismaRepository implements EmpleadoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(filtro: FiltroEmpleados): Promise<Empleado[]> {
    const where: Prisma.EmpleadoWhereInput = {};

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
