import { Injectable } from '@nestjs/common';
import { Usuario as UsuarioPrisma } from '@prisma/client';
import {
  ActualizarUsuarioDatos,
  CrearUsuarioDatos,
  UsuarioRepository,
} from '../../application/ports/usuario.repository.port';
import { Usuario } from '../../domain/entities/usuario.entity';
import { RolUsuario } from '../../domain/enums/rol-usuario.enum';
import { PrismaService } from '../prisma/prisma.service';

function aDominio(usuario: UsuarioPrisma): Usuario {
  return new Usuario(
    usuario.id,
    usuario.nombre,
    usuario.email,
    usuario.passwordHash,
    usuario.rol as RolUsuario,
    usuario.activo,
  );
}

@Injectable()
export class UsuarioPrismaRepository implements UsuarioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async listar(): Promise<Usuario[]> {
    const usuarios = await this.prisma.usuario.findMany({
      orderBy: { nombre: 'asc' },
    });
    return usuarios.map(aDominio);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({ where: { email } });
    return usuario ? aDominio(usuario) : null;
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    return usuario ? aDominio(usuario) : null;
  }

  async crear(datos: CrearUsuarioDatos): Promise<Usuario> {
    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: datos.nombre,
        email: datos.email,
        passwordHash: datos.passwordHash,
        rol: datos.rol,
      },
    });
    return aDominio(usuario);
  }

  async actualizar(
    id: string,
    datos: ActualizarUsuarioDatos,
  ): Promise<Usuario> {
    const usuario = await this.prisma.usuario.update({
      where: { id },
      data: {
        nombre: datos.nombre,
        rol: datos.rol,
        activo: datos.activo,
        passwordHash: datos.passwordHash,
      },
    });
    return aDominio(usuario);
  }
}
