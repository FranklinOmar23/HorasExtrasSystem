import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaMssql } from '@prisma/adapter-mssql';
import { PrismaClient } from '@prisma/client';
import { parsearSqlServerUrl } from '../../shared/config/sqlserver-connection';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL no está definida en el entorno.');
    }

    super({ adapter: new PrismaMssql(parsearSqlServerUrl(databaseUrl)) });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Conexión a la base de datos establecida');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
