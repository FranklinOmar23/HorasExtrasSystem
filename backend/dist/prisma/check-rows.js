"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_mssql_1 = require("@prisma/adapter-mssql");
const client_1 = require("@prisma/client");
const sqlserver_connection_1 = require("../src/shared/config/sqlserver-connection");
async function main() {
    const prisma = new client_1.PrismaClient({ adapter: new adapter_mssql_1.PrismaMssql((0, sqlserver_connection_1.parsearSqlServerUrl)(process.env.DATABASE_URL)) });
    console.log('tipos_hora_extra:', await prisma.tipoHoraExtra.count());
    console.log('periodos:', await prisma.periodo.count());
    console.log('empleados:', await prisma.empleado.count());
    await prisma.$disconnect();
}
main();
//# sourceMappingURL=check-rows.js.map