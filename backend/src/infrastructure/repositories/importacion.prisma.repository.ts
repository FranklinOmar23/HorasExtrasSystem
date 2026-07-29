import { Injectable } from '@nestjs/common';
import { Importacion as ImportacionPrisma } from '@prisma/client';
import {
  CrearImportacionDatos,
  ImportacionRepository,
} from '../../application/ports/importacion.repository.port';
import { Importacion } from '../../domain/entities/importacion.entity';
import { PrismaService } from '../prisma/prisma.service';

type ImportacionSinContenido = Omit<ImportacionPrisma, 'contenido'>;

function aDominio(importacion: ImportacionSinContenido): Importacion {
  return new Importacion(
    importacion.id,
    importacion.periodoId,
    importacion.usuarioId,
    importacion.archivo,
    importacion.filasOk,
    importacion.filasAdvertencia,
    importacion.filasError,
    importacion.filasRetroactivas,
    importacion.importadoEn,
    importacion.confirmadaEn,
  );
}

const SELECT_SIN_CONTENIDO = {
  id: true,
  periodoId: true,
  usuarioId: true,
  archivo: true,
  filasOk: true,
  filasAdvertencia: true,
  filasError: true,
  filasRetroactivas: true,
  importadoEn: true,
  confirmadaEn: true,
} as const;

@Injectable()
export class ImportacionPrismaRepository implements ImportacionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async crear(datos: CrearImportacionDatos): Promise<Importacion> {
    const importacion = await this.prisma.importacion.create({
      data: {
        periodoId: datos.periodoId,
        usuarioId: datos.usuarioId,
        archivo: datos.archivo,
        // Prisma tipa `Bytes` como Uint8Array<ArrayBuffer>; un Buffer de Node
        // admite un ArrayBufferLike más amplio (incluye SharedArrayBuffer),
        // así que se copia a un Uint8Array "puro" para satisfacer el tipo.
        contenido: new Uint8Array(datos.contenido),
        filasOk: datos.filasOk,
        filasAdvertencia: datos.filasAdvertencia,
        filasError: datos.filasError,
        filasRetroactivas: datos.filasRetroactivas,
      },
    });
    return aDominio(importacion);
  }

  async buscarPorId(id: string): Promise<Importacion | null> {
    const importacion = await this.prisma.importacion.findUnique({
      where: { id },
      select: SELECT_SIN_CONTENIDO,
    });
    return importacion ? aDominio(importacion) : null;
  }

  async obtenerContenido(id: string): Promise<Buffer | null> {
    const importacion = await this.prisma.importacion.findUnique({
      where: { id },
      select: { contenido: true },
    });
    return importacion ? Buffer.from(importacion.contenido) : null;
  }

  async listarPorPeriodo(periodoId: string): Promise<Importacion[]> {
    const importaciones = await this.prisma.importacion.findMany({
      where: { periodoId },
      select: SELECT_SIN_CONTENIDO,
      orderBy: { importadoEn: 'desc' },
    });
    return importaciones.map(aDominio);
  }

  async marcarConfirmada(id: string, confirmadaEn: Date): Promise<Importacion> {
    const importacion = await this.prisma.importacion.update({
      where: { id },
      data: { confirmadaEn },
      select: SELECT_SIN_CONTENIDO,
    });
    return aDominio(importacion);
  }
}
