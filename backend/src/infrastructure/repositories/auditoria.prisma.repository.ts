import { Injectable } from '@nestjs/common';
import {
  Auditoria as AuditoriaPrisma,
  Prisma,
  VwAuditoria as VwAuditoriaPrisma,
} from '@prisma/client';
import {
  AuditoriaConUsuario,
  AuditoriaPaginada,
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

function aConUsuario(fila: VwAuditoriaPrisma): AuditoriaConUsuario {
  return {
    id: fila.id,
    usuarioId: fila.usuarioId,
    usuarioNombre: fila.usuarioNombre,
    accion: fila.accion as AccionAuditoria,
    entidad: fila.entidad as EntidadAuditoria,
    entidadId: fila.entidadId,
    descripcion: fila.descripcion,
    creadoEn: fila.creadoEn,
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

  /** Lee de `vw_auditoria` (vista SQL que ya trae el nombre del usuario
   *  unido) en vez de hacer el join con Prisma `include` en cada consulta. */
  async listar(filtro: FiltroAuditoria): Promise<AuditoriaPaginada> {
    const where: Prisma.VwAuditoriaWhereInput = {
      entidad: filtro.entidad,
      usuarioId: filtro.usuarioId,
    };
    if (filtro.desde || filtro.hasta) {
      where.creadoEn = {
        gte: filtro.desde,
        lte: filtro.hasta,
      };
    }

    const [filas, total] = await Promise.all([
      this.prisma.vwAuditoria.findMany({
        where,
        orderBy: { creadoEn: 'desc' },
        skip: (filtro.pagina - 1) * filtro.porPagina,
        take: filtro.porPagina,
      }),
      this.prisma.vwAuditoria.count({ where }),
    ]);

    return { items: filas.map(aConUsuario), total };
  }
}
