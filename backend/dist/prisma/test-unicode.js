"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_mssql_1 = require("@prisma/adapter-mssql");
const client_1 = require("@prisma/client");
const sqlserver_connection_1 = require("../src/shared/config/sqlserver-connection");
async function main() {
    const prisma = new client_1.PrismaClient({
        adapter: new adapter_mssql_1.PrismaMssql((0, sqlserver_connection_1.parsearSqlServerUrl)(process.env.DATABASE_URL)),
    });
    const texto = 'línea, cédula, año, ñ';
    console.log('Original bytes:', Buffer.from(texto, 'utf8').toString('hex'));
    const emp = await prisma.empleado.findFirst({ where: { codigo: 40 } });
    if (!emp) {
        console.log('no employee');
        return;
    }
    const updated = await prisma.empleado.update({ where: { id: emp.id }, data: { posicion: texto } });
    console.log('Stored value:', updated.posicion);
    console.log('Match:', updated.posicion === texto);
    await prisma.$disconnect();
}
main();
//# sourceMappingURL=test-unicode.js.map