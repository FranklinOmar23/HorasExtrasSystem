import { Injectable } from '@nestjs/common';
import { Auditoria as AuditoriaPrisma, Prisma } from '@prisma/client';
import {
  AuditoriaConUsuario,
  AuditoriaRepository,
  FiltroAuditoria,
  RegistrarAuditoriaDatos,
} from '../../application/ports/auditoria.repository.port';
import { Auditoria } from '../../domain/entities/auditoria.entity';
import { AccionAuditoria } from '../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../domain/enums/entidad-auditoria.enum';
import { PrismaService } from '../prisma/prisma.service';

function aDominio(auditoria: AuditoriaPrisma): Auditoria {
  return new Auditoria(
    auditoria.id,
    auditoria.usuarioId,
    auditoria.accion as AccionAuditoria,
    auditoria.entidad as EntidadAuditoria,
    auditoria.entidadId,
    auditoria.descripcion,
    auditoria.creadoEn,
  );
}

type AuditoriaConUsuarioPrisma = AuditoriaPrisma & {
  usuario: { nombre: string };
};

function aConUsuario(auditoria: AuditoriaConUsuarioPrisma): AuditoriaConUsuario {
  return {
    id: auditoria.id,
    usuarioId: auditoria.usuarioId,
    usuarioNombre: auditoria.usuario.nombre,
    accion: auditoria.accion as AccionAuditoria,
    entidad: auditoria.entidad as EntidadAuditoria,
    entidadId: auditoria.entidadId,
    descripcion: auditoria.descripcion,
    creadoEn: auditoria.creadoEn,
  };
}

@Injectable()
export class AuditoriaPrismaRepository implements AuditoriaRepository {
  constructor(private readonly prisma: PrismaService) {}

  async registrar(datos: RegistrarAuditoriaDatos): Promise<Auditoria> {
    const auditoria = await this.prisma.auditoria.create({
      data: {
        usuarioId: datos.usuarioId,
        accion: datos.accion,
        entidad: datos.entidad,
        entidadId: datos.entidadId,
        descripcion: datos.descripcion,
      },
    });
    return aDominio(auditoria);
  }

  async listar(filtro: FiltroAuditoria): Promise<AuditoriaConUsuario[]> {
    const where: Prisma.AuditoriaWhereInput = {
      entidad: filtro.entidad,
      usuarioId: filtro.usuarioId,
    };
    if (filtro.desde || filtro.hasta) {
      where.creadoEn = {
        gte: filtro.desde,
        lte: filtro.hasta,
      };
    }

    const auditorias = await this.prisma.auditoria.findMany({
      where,
      include: { usuario: { select: { nombre: true } } },
      orderBy: { creadoEn: 'desc' },
    });
    return auditorias.map(aConUsuario);
  }
}
