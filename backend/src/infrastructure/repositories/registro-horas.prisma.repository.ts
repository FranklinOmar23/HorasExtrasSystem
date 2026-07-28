import { Injectable } from '@nestjs/common';
import {
  Calculo as CalculoPrisma,
  Prisma,
  RegistroHoras as RegistroHorasPrisma,
} from '@prisma/client';
import {
  ActualizarRegistroDatos,
  CrearRegistroDatos,
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../../application/ports/registro-horas.repository.port';
import { Calculo } from '../../domain/entities/calculo.entity';
import { RegistroHoras } from '../../domain/entities/registro-horas.entity';
import { OrigenRegistro } from '../../domain/enums/origen-registro.enum';
import { TipoHoraExtraCodigo } from '../../domain/enums/tipo-hora-extra-codigo.enum';
import { FilaCalculo } from '../../domain/services/motor-calculo';
import { decimalDesdeDb } from '../prisma/decimal.mapper';
import { PrismaService } from '../prisma/prisma.service';

type RegistroHorasConCalculosPrisma = RegistroHorasPrisma & {
  calculos: CalculoPrisma[];
};

function aDominioRegistro(registro: RegistroHorasPrisma): RegistroHoras {
  return new RegistroHoras(
    registro.id,
    registro.periodoId,
    registro.empleadoId,
    registro.fecha,
    registro.horaEntrada,
    registro.horaSalida,
    registro.origen as OrigenRegistro,
    registro.importacionId,
    registro.comentario,
  );
}

function aDominioCalculo(calculo: CalculoPrisma, codigo: string): Calculo {
  return new Calculo(
    calculo.id,
    calculo.registroId,
    calculo.tipoHoraId,
    codigo as TipoHoraExtraCodigo,
    decimalDesdeDb(calculo.cantidadHoras),
    decimalDesdeDb(calculo.porcentajeAplicado),
    decimalDesdeDb(calculo.salarioHoraUsado),
    decimalDesdeDb(calculo.monto),
    calculo.calculadoEn,
  );
}

function aDominio(
  registro: RegistroHorasConCalculosPrisma,
  codigosPorTipoId: Map<string, string>,
): RegistroConCalculos {
  return {
    registro: aDominioRegistro(registro),
    calculos: registro.calculos.map((c) =>
      aDominioCalculo(c, codigosPorTipoId.get(c.tipoHoraId) ?? ''),
    ),
  };
}

function datosCalculos(filas: FilaCalculo[]) {
  return filas.map((fila) => ({
    tipoHoraId: fila.tipoHoraId,
    cantidadHoras: fila.cantidadHoras.toString(),
    porcentajeAplicado: fila.porcentajeAplicado.toString(),
    salarioHoraUsado: fila.salarioHoraUsado.toString(),
    monto: fila.monto.toString(),
  }));
}

@Injectable()
export class RegistroHorasPrismaRepository implements RegistroHorasRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async mapaCodigosPorTipoId(): Promise<Map<string, string>> {
    const tipos = await this.prisma.tipoHoraExtra.findMany({
      select: { id: true, codigo: true },
    });
    return new Map(tipos.map((t) => [t.id, t.codigo]));
  }

  async listarPorPeriodo(
    periodoId: string,
    empleadoId?: string,
  ): Promise<RegistroConCalculos[]> {
    const where: Prisma.RegistroHorasWhereInput = { periodoId };
    if (empleadoId) {
      where.empleadoId = empleadoId;
    }

    const [registros, codigosPorTipoId] = await Promise.all([
      this.prisma.registroHoras.findMany({
        where,
        include: { calculos: true },
        orderBy: { fecha: 'asc' },
      }),
      this.mapaCodigosPorTipoId(),
    ]);

    return registros.map((r) => aDominio(r, codigosPorTipoId));
  }

  async listarPorEmpleadoYRango(
    empleadoId: string,
    desde: Date,
    hasta: Date | null,
  ): Promise<RegistroConCalculos[]> {
    const where: Prisma.RegistroHorasWhereInput = {
      empleadoId,
      fecha: hasta ? { gte: desde, lte: hasta } : { gte: desde },
    };

    const [registros, codigosPorTipoId] = await Promise.all([
      this.prisma.registroHoras.findMany({
        where,
        include: { calculos: true },
        orderBy: { fecha: 'asc' },
      }),
      this.mapaCodigosPorTipoId(),
    ]);

    return registros.map((r) => aDominio(r, codigosPorTipoId));
  }

  async buscarPorId(id: string): Promise<RegistroConCalculos | null> {
    const [registro, codigosPorTipoId] = await Promise.all([
      this.prisma.registroHoras.findUnique({
        where: { id },
        include: { calculos: true },
      }),
      this.mapaCodigosPorTipoId(),
    ]);
    return registro ? aDominio(registro, codigosPorTipoId) : null;
  }

  async crear(
    datos: CrearRegistroDatos,
    filas: FilaCalculo[],
  ): Promise<RegistroConCalculos> {
    const [registro, codigosPorTipoId] = await Promise.all([
      this.prisma.registroHoras.create({
        data: {
          periodoId: datos.periodoId,
          empleadoId: datos.empleadoId,
          fecha: datos.fecha,
          horaEntrada: datos.horaEntrada,
          horaSalida: datos.horaSalida,
          origen: datos.origen,
          importacionId: datos.importacionId,
          comentario: datos.comentario,
          calculos: { create: datosCalculos(filas) },
        },
        include: { calculos: true },
      }),
      this.mapaCodigosPorTipoId(),
    ]);
    return aDominio(registro, codigosPorTipoId);
  }

  async actualizar(
    id: string,
    datos: ActualizarRegistroDatos,
    filas: FilaCalculo[],
  ): Promise<RegistroConCalculos> {
    const [registro, codigosPorTipoId] = await Promise.all([
      this.prisma.registroHoras.update({
        where: { id },
        data: {
          fecha: datos.fecha,
          horaEntrada: datos.horaEntrada,
          horaSalida: datos.horaSalida,
          comentario: datos.comentario,
          calculos: {
            deleteMany: {},
            create: datosCalculos(filas),
          },
        },
        include: { calculos: true },
      }),
      this.mapaCodigosPorTipoId(),
    ]);
    return aDominio(registro, codigosPorTipoId);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.registroHoras.delete({ where: { id } });
  }
}
