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
    // COMPLETA: la hora se paga completa + recargo (×1.35 / ×2.00).
    // SOLO_RECARGO: solo se paga el recargo, es un adicional sobre horas ya
    // pagadas por otro tipo (nocturno) o la hora completa sin duplicarla (feriado).
    modoValorizacion: string;
  }[] = [
    {
      codigo: 'HE_35',
      nombre: 'Hora extra 35%',
      porcentaje: '35.00',
      modoValorizacion: 'COMPLETA',
    },
    {
      codigo: 'HE_100',
      nombre: 'Hora extra 100%',
      porcentaje: '100.00',
      modoValorizacion: 'COMPLETA',
    },
    {
      codigo: 'NOCTURNA_15',
      nombre: 'Recargo nocturno 15%',
      porcentaje: '15.00',
      modoValorizacion: 'SOLO_RECARGO',
    },
    {
      codigo: 'FERIADO',
      nombre: 'Hora feriado 100%',
      porcentaje: '100.00',
      modoValorizacion: 'SOLO_RECARGO',
    },
  ];
  for (const tipo of tiposHoraExtra) {
    await prisma.tipoHoraExtra.upsert({
      where: { codigo: tipo.codigo },
      update: {
        nombre: tipo.nombre,
        porcentaje: tipo.porcentaje,
        modoValorizacion: tipo.modoValorizacion,
      },
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
    fin_nocturna: '07:00',
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

  const turnos: {
    codigo: string;
    nombre: string;
    horaInicio: string;
    horaFin: string;
    horasJornada: string;
    cruzaMedianoche: boolean;
    descuentaAlmuerzo: boolean;
  }[] = [
    {
      codigo: 'DIURNO',
      nombre: 'Diurno',
      horaInicio: '08:30',
      horaFin: '17:30',
      horasJornada: '8',
      cruzaMedianoche: false,
      descuentaAlmuerzo: true,
    },
    {
      codigo: 'SABADO',
      nombre: 'Sábado',
      horaInicio: '09:00',
      horaFin: '13:00',
      horasJornada: '4',
      cruzaMedianoche: false,
      descuentaAlmuerzo: false,
    },
    {
      // Horario provisional hasta que RRHH confirme el definitivo — editable
      // desde Configuración sin necesidad de tocar código (ver Turno en schema.prisma).
      codigo: 'NOCTURNO',
      nombre: 'Nocturno',
      horaInicio: '22:00',
      horaFin: '08:00',
      horasJornada: '8',
      cruzaMedianoche: true,
      descuentaAlmuerzo: true,
    },
  ];
  for (const turno of turnos) {
    await prisma.turno.upsert({
      where: { codigo: turno.codigo },
      update: {},
      create: turno,
    });
  }
  console.log(`Turnos listos: ${turnos.length}`);

  await prisma.$disconnect();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
