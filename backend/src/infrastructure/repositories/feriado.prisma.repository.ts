import { Injectable } from '@nestjs/common';
import { Feriado as FeriadoPrisma } from '@prisma/client';
import {
  CrearFeriadoDatos,
  FeriadoRepository,
} from '../../application/ports/feriado.repository.port';
import { Feriado } from '../../domain/entities/feriado.entity';
import { PrismaService } from '../prisma/prisma.service';

function aDominio(feriado: FeriadoPrisma): Feriado {
  return new Feriado(feriado.id, feriado.fecha, feriado.descripcion);
}

@Injectable()
export class FeriadoPrismaRepository implements FeriadoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(anio?: number): Promise<Feriado[]> {
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

  async buscarPorId(id: string): Promise<Feriado | null> {
    const feriado = await this.prisma.feriado.findUnique({ where: { id } });
    return feriado ? aDominio(feriado) : null;
  }

  async buscarPorFecha(fecha: Date): Promise<Feriado | null> {
    const feriado = await this.prisma.feriado.findUnique({
      where: { fecha },
    });
    return feriado ? aDominio(feriado) : null;
  }

  async crear(datos: CrearFeriadoDatos): Promise<Feriado> {
    const feriado = await this.prisma.feriado.create({ data: datos });
    return aDominio(feriado);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.feriado.delete({ where: { id } });
  }
}
