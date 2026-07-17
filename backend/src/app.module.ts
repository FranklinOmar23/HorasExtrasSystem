import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { RolesGuard } from './presentation/guards/roles.guard';
import { AuthModule } from './presentation/modules/auth.module';
import { ConfiguracionModule } from './presentation/modules/configuracion.module';
import { EmpleadosModule } from './presentation/modules/empleados.module';
import { HealthModule } from './presentation/modules/health.module';
import { PeriodosModule } from './presentation/modules/periodos.module';
import { RegistrosModule } from './presentation/modules/registros.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    EmpleadosModule,
    ConfiguracionModule,
    PeriodosModule,
    RegistrosModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
