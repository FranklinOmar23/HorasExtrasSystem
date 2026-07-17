import { Injectable } from '@nestjs/common';
import { Periodo as PeriodoPrisma } from '@prisma/client';
import {
  CrearPeriodoDatos,
  PeriodoRepository,
} from '../../application/ports/periodo.repository.port';
import { Periodo } from '../../domain/entities/periodo.entity';
import { EstadoPeriodo } from '../../domain/enums/estado-periodo.enum';
import { PrismaService } from '../prisma/prisma.service';

function aDominio(periodo: PeriodoPrisma): Periodo {
  return new Periodo(
    periodo.id,
    periodo.fechaInicio,
    periodo.fechaFin,
    periodo.estado as EstadoPeriodo,
    periodo.cerradoEn,
    periodo.cerradoPorId,
  );
}

@Injectable()
export class PeriodoPrismaRepository implements PeriodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Periodo[]> {
    const periodos = await this.prisma.periodo.findMany({
      orderBy: { fechaInicio: 'desc' },
    });
    return periodos.map(aDominio);
  }

  async buscarPorId(id: string): Promise<Periodo | null> {
    const periodo = await this.prisma.periodo.findUnique({ where: { id } });
    return periodo ? aDominio(periodo) : null;
  }

  async buscarPorFechas(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<Periodo | null> {
    const periodo = await this.prisma.periodo.findUnique({
      where: { fechaInicio_fechaFin: { fechaInicio, fechaFin } },
    });
    return periodo ? aDominio(periodo) : null;
  }

  async crear(datos: CrearPeriodoDatos): Promise<Periodo> {
    const periodo = await this.prisma.periodo.create({ data: datos });
    return aDominio(periodo);
  }

  async cerrar(
    id: string,
    cerradoPorId: string,
    cerradoEn: Date,
  ): Promise<Periodo> {
    const periodo = await this.prisma.periodo.update({
      where: { id },
      data: { estado: EstadoPeriodo.CERRADO, cerradoPorId, cerradoEn },
    });
    return aDominio(periodo);
  }
}
