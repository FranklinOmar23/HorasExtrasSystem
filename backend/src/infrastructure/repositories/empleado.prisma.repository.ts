import { Injectable } from '@nestjs/common';
import { Empleado as EmpleadoPrisma } from '@prisma/client';
import {
  CrearEmpleadoDatos,
  EmpleadoRepository,
} from '../../application/ports/empleado.repository.port';
import { Empleado } from '../../domain/entities/empleado.entity';
import { PrismaService } from '../prisma/prisma.service';

function aDominio(empleado: EmpleadoPrisma): Empleado {
  return new Empleado(
    empleado.id,
    empleado.codigo,
    empleado.nombre,
    empleado.cargo,
    empleado.activo,
  );
}

@Injectable()
export class EmpleadoPrismaRepository implements EmpleadoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Empleado[]> {
    const empleados = await this.prisma.empleado.findMany({
      orderBy: { nombre: 'asc' },
    });
    return empleados.map(aDominio);
  }

  async buscarPorId(id: string): Promise<Empleado | null> {
    const empleado = await this.prisma.empleado.findUnique({ where: { id } });
    return empleado ? aDominio(empleado) : null;
  }

  async buscarPorCodigo(codigo: string): Promise<Empleado | null> {
    const empleado = await this.prisma.empleado.findUnique({
      where: { codigo },
    });
    return empleado ? aDominio(empleado) : null;
  }

  async crear(datos: CrearEmpleadoDatos): Promise<Empleado> {
    const empleado = await this.prisma.empleado.create({ data: datos });
    return aDominio(empleado);
  }
}
