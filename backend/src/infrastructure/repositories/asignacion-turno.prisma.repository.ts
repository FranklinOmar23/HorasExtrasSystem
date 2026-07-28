import { Injectable } from '@nestjs/common';
import { AsignacionTurno as AsignacionTurnoPrisma } from '@prisma/client';
import {
  ActualizarAsignacionTurnoDatos,
  AsignacionTurnoRepository,
  CrearAsignacionTurnoDatos,
} from '../../application/ports/asignacion-turno.repository.port';
import { AsignacionTurno } from '../../domain/entities/asignacion-turno.entity';
import { PrismaService } from '../prisma/prisma.service';

function aDominio(asignacion: AsignacionTurnoPrisma): AsignacionTurno {
  return new AsignacionTurno(
    asignacion.id,
    asignacion.empleadoId,
    asignacion.turnoId,
    asignacion.fechaDesde,
    asignacion.fechaHasta,
    asignacion.comentario,
    asignacion.creadoPorId,
    asignacion.createdAt,
  );
}

@Injectable()
export class AsignacionTurnoPrismaRepository implements AsignacionTurnoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listarPorEmpleado(empleadoId: string): Promise<AsignacionTurno[]> {
    const asignaciones = await this.prisma.asignacionTurno.findMany({
      where: { empleadoId },
      orderBy: { fechaDesde: 'desc' },
    });
    return asignaciones.map(aDominio);
  }

  async buscarPorId(id: string): Promise<AsignacionTurno | null> {
    const asignacion = await this.prisma.asignacionTurno.findUnique({
      where: { id },
    });
    return asignacion ? aDominio(asignacion) : null;
  }

  async buscarVigenteEn(
    empleadoId: string,
    fecha: Date,
  ): Promise<AsignacionTurno | null> {
    const asignacion = await this.prisma.asignacionTurno.findFirst({
      where: {
        empleadoId,
        fechaDesde: { lte: fecha },
        OR: [{ fechaHasta: null }, { fechaHasta: { gte: fecha } }],
      },
      orderBy: { fechaDesde: 'desc' },
    });
    return asignacion ? aDominio(asignacion) : null;
  }

  async existeAlgunaConTurno(turnoId: string): Promise<boolean> {
    const total = await this.prisma.asignacionTurno.count({
      where: { turnoId },
    });
    return total > 0;
  }

  async crear(datos: CrearAsignacionTurnoDatos): Promise<AsignacionTurno> {
    const asignacion = await this.prisma.asignacionTurno.create({
      data: datos,
    });
    return aDominio(asignacion);
  }

  async actualizar(
    id: string,
    datos: ActualizarAsignacionTurnoDatos,
  ): Promise<AsignacionTurno> {
    const asignacion = await this.prisma.asignacionTurno.update({
      where: { id },
      data: datos,
    });
    return aDominio(asignacion);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.asignacionTurno.delete({ where: { id } });
  }
}
