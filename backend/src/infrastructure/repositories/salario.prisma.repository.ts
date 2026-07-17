import { Injectable } from '@nestjs/common';
import { Salario as SalarioPrisma } from '@prisma/client';
import {
  CrearSalarioDatos,
  SalarioRepository,
} from '../../application/ports/salario.repository.port';
import { Salario } from '../../domain/entities/salario.entity';
import { decimalDesdeDb } from '../prisma/decimal.mapper';
import { PrismaService } from '../prisma/prisma.service';

function aDominio(salario: SalarioPrisma): Salario {
  return new Salario(
    salario.id,
    salario.empleadoId,
    decimalDesdeDb(salario.montoMensual),
    salario.vigenteDesde,
    salario.vigenteHasta,
  );
}

@Injectable()
export class SalarioPrismaRepository implements SalarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listarPorEmpleado(empleadoId: string): Promise<Salario[]> {
    const salarios = await this.prisma.salario.findMany({
      where: { empleadoId },
      orderBy: { vigenteDesde: 'desc' },
    });
    return salarios.map(aDominio);
  }

  async crear(
    empleadoId: string,
    datos: CrearSalarioDatos,
    cerrarVigenteAnteriorHasta: Date,
  ): Promise<Salario> {
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

  async buscarVigenteEn(
    empleadoId: string,
    fecha: Date,
  ): Promise<Salario | null> {
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
}
