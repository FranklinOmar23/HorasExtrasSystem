"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsearSqlServerUrl = parsearSqlServerUrl;
function parsearSqlServerUrl(databaseUrl) {
    const sinProtocolo = databaseUrl.replace(/^sqlserver:\/\//, '');
    const [hostPuerto, ...segmentos] = sinProtocolo.split(';').filter(Boolean);
    const [host, puerto] = hostPuerto.split(':');
    const parametros = new Map();
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
            trustServerCertificate: parametros.get('trustservercertificate') !== 'false',
        },
    };
}
//# sourceMappingURL=sqlserver-connection.js.map