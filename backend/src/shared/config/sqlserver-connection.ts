import { config as SqlServerConfig } from 'mssql';

/**
 * Convierte una DATABASE_URL en formato Prisma
 * (`sqlserver://host:puerto;database=db;user=u;password=p;...`)
 * al objeto de configuración que espera el driver `mssql`.
 */
export function parsearSqlServerUrl(databaseUrl: string): SqlServerConfig {
  const sinProtocolo = databaseUrl.replace(/^sqlserver:\/\//, '');
  const [hostPuerto, ...segmentos] = sinProtocolo.split(';').filter(Boolean);
  const [host, puerto] = hostPuerto.split(':');

  const parametros = new Map<string, string>();
  for (const segmento of segmentos) {
    const [clave, valor] = segmento.split('=');
    if (clave && valor !== undefined) {
      parametros.set(clave.toLowerCase(), valor);
    }
  }

  return {
    server: host,
    port: puerto ? Number(puerto) : 1433,
    database: parametros.get('database'),
    user: parametros.get('user'),
    password: parametros.get('password'),
    options: {
      encrypt: parametros.get('encrypt') === 'true',
      trustServerCertificate:
        parametros.get('trustservercertificate') !== 'false',
    },
  };
}
