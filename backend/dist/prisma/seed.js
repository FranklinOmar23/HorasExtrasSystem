"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_mssql_1 = require("@prisma/adapter-mssql");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const sqlserver_connection_1 = require("../src/shared/config/sqlserver-connection");
async function main() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL no está definida en el entorno.');
    }
    const prisma = new client_1.PrismaClient({
        adapter: new adapter_mssql_1.PrismaMssql((0, sqlserver_connection_1.parsearSqlServerUrl)(databaseUrl)),
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
main().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map