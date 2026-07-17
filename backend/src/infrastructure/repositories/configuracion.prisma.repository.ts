import { Injectable } from '@nestjs/common';
import { ConfiguracionRepository } from '../../application/ports/configuracion.repository.port';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConfiguracionPrismaRepository implements ConfiguracionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerTodos(): Promise<Record<string, string>> {
    const parametros = await this.prisma.configuracion.findMany();
    return Object.fromEntries(parametros.map((p) => [p.clave, p.valor]));
  }

  async actualizar(
    cambios: Record<string, string>,
  ): Promise<Record<string, string>> {
    await this.prisma.$transaction(
      Object.entries(cambios).map(([clave, valor]) =>
        this.prisma.configuracion.upsert({
          where: { clave },
          update: { valor },
          create: { clave, valor },
        }),
      ),
    );
    return this.obtenerTodos();
  }
}
