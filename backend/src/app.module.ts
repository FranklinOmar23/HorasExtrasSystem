import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { AuthModule } from './presentation/modules/auth.module';
import { EmpleadosModule } from './presentation/modules/empleados.module';
import { HealthModule } from './presentation/modules/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    EmpleadosModule,
  ],
})
export class AppModule {}
