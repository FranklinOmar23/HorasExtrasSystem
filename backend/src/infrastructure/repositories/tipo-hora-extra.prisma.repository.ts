import { Injectable } from '@nestjs/common';
import { TipoHoraExtra as TipoHoraExtraPrisma } from '@prisma/client';
import {
  ActualizarTipoHoraExtraDatos,
  TipoHoraExtraRepository,
} from '../../application/ports/tipo-hora-extra.repository.port';
import { TipoHoraExtra } from '../../domain/entities/tipo-hora-extra.entity';
import { ModoValorizacion } from '../../domain/enums/modo-valorizacion.enum';
import { TipoHoraExtraCodigo } from '../../domain/enums/tipo-hora-extra-codigo.enum';
import { decimalDesdeDb } from '../prisma/decimal.mapper';
import { PrismaService } from '../prisma/prisma.service';

function aDominio(tipo: TipoHoraExtraPrisma): TipoHoraExtra {
  return new TipoHoraExtra(
    tipo.id,
    tipo.codigo as TipoHoraExtraCodigo,
    tipo.nombre,
    decimalDesdeDb(tipo.porcentaje),
    tipo.modoValorizacion as ModoValorizacion,
    tipo.activo,
  );
}

@Injectable()
export class TipoHoraExtraPrismaRepository implements TipoHoraExtraRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<TipoHoraExtra[]> {
    const tipos = await this.prisma.tipoHoraExtra.findMany({
      orderBy: { codigo: 'asc' },
    });
    return tipos.map(aDominio);
  }

  async buscarPorId(id: string): Promise<TipoHoraExtra | null> {
    const tipo = await this.prisma.tipoHoraExtra.findUnique({
      where: { id },
    });
    return tipo ? aDominio(tipo) : null;
  }

  async actualizar(
    id: string,
    datos: ActualizarTipoHoraExtraDatos,
  ): Promise<TipoHoraExtra> {
    const tipo = await this.prisma.tipoHoraExtra.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        porcentaje: datos.porcentaje?.toString(),
        modoValorizacion: datos.modoValorizacion,
        activo: datos.activo,
      },
    });
    return aDominio(tipo);
  }
}
