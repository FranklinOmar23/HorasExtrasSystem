import { Injectable } from '@nestjs/common';
import { Turno as TurnoPrisma } from '@prisma/client';
import {
  ActualizarTurnoDatos,
  CrearTurnoDatos,
  TurnoRepository,
} from '../../application/ports/turno.repository.port';
import { Turno } from '../../domain/entities/turno.entity';
import { decimalDesdeDb } from '../prisma/decimal.mapper';
import { PrismaService } from '../prisma/prisma.service';

function aDominio(turno: TurnoPrisma): Turno {
  return new Turno(
    turno.id,
    turno.codigo,
    turno.nombre,
    turno.horaInicio,
    turno.horaFin,
    decimalDesdeDb(turno.horasJornada),
    turno.cruzaMedianoche,
    turno.descuentaAlmuerzo,
    turno.activo,
  );
}

@Injectable()
export class TurnoPrismaRepository implements TurnoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Turno[]> {
    const turnos = await this.prisma.turno.findMany({
      orderBy: { nombre: 'asc' },
    });
    return turnos.map(aDominio);
  }

  async buscarPorId(id: string): Promise<Turno | null> {
    const turno = await this.prisma.turno.findUnique({ where: { id } });
    return turno ? aDominio(turno) : null;
  }

  async buscarPorCodigo(codigo: string): Promise<Turno | null> {
    const turno = await this.prisma.turno.findUnique({ where: { codigo } });
    return turno ? aDominio(turno) : null;
  }

  async crear(datos: CrearTurnoDatos): Promise<Turno> {
    const turno = await this.prisma.turno.create({
      data: { ...datos, horasJornada: datos.horasJornada.toString() },
    });
    return aDominio(turno);
  }

  async actualizar(id: string, datos: ActualizarTurnoDatos): Promise<Turno> {
    const turno = await this.prisma.turno.update({
      where: { id },
      data: {
        ...datos,
        horasJornada: datos.horasJornada?.toString(),
      },
    });
    return aDominio(turno);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.turno.delete({ where: { id } });
  }
}
