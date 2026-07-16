import 'dotenv/config';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { parsearSqlServerUrl } from '../src/shared/config/sqlserver-connection';

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL no está definida en el entorno.');
  }

  const prisma = new PrismaClient({
    adapter: new PrismaMssql(parsearSqlServerUrl(databaseUrl)),
  });

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@hartemania.com';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'CambiarInmediatamente123';

  const usuario = await prisma.usuario.upsert({
    where: { email },
    update: {},
    create: {
      nombre: 'Administrador',
      email,
      passwordHash: await bcrypt.hash(password, 10),
      rol: 'ADMIN',
    },
  });

  console.log(`Usuario admin listo: ${usuario.email}`);
  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
