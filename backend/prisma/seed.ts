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

  const tiposHoraExtra: {
    codigo: string;
    nombre: string;
    porcentaje: string;
  }[] = [
    { codigo: 'HE_35', nombre: 'Hora extra 35%', porcentaje: '35.00' },
    { codigo: 'HE_100', nombre: 'Hora extra 100%', porcentaje: '100.00' },
    {
      codigo: 'NOCTURNA_15',
      nombre: 'Recargo nocturno 15%',
      porcentaje: '15.00',
    },
    { codigo: 'FERIADO', nombre: 'Hora feriado 100%', porcentaje: '100.00' },
  ];
  for (const tipo of tiposHoraExtra) {
    await prisma.tipoHoraExtra.upsert({
      where: { codigo: tipo.codigo },
      update: {},
      create: tipo,
    });
  }
  console.log(`Tipos de hora extra listos: ${tiposHoraExtra.length}`);

  const configuracion: Record<string, string> = {
    divisor_salario: '23.83',
    horas_jornada: '8',
    horas_almuerzo: '1',
    entrada_semana: '08:30',
    salida_semana: '17:30',
    entrada_sabado: '09:00',
    salida_sabado: '13:00',
    inicio_nocturna: '21:00',
    tolerancia_minutos: '0',
    redondeo: 'ninguno',
  };
  for (const [clave, valor] of Object.entries(configuracion)) {
    await prisma.configuracion.upsert({
      where: { clave },
      update: {},
      create: { clave, valor },
    });
  }
  console.log(
    `Parámetros de configuración listos: ${Object.keys(configuracion).length}`,
  );

  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
