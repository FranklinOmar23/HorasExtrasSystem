import 'dotenv/config';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { PrismaClient } from '@prisma/client';
import { parsearSqlServerUrl } from '../src/shared/config/sqlserver-connection';
async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaMssql(parsearSqlServerUrl(process.env.DATABASE_URL!)) });
  const tipos = await prisma.tipoHoraExtra.findMany({ orderBy: { codigo: 'asc' } });
  console.table(tipos.map(t => ({ codigo: t.codigo, porcentaje: t.porcentaje.toString(), modo: t.modoValorizacion })));
  await prisma.$disconnect();
}
main();
