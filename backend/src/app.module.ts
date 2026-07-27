import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { JwtAuthGuard } from './presentation/guards/jwt-auth.guard';
import { RolesGuard } from './presentation/guards/roles.guard';
import { AuditoriaModule } from './presentation/modules/auditoria.module';
import { AuthModule } from './presentation/modules/auth.module';
import { ConfiguracionModule } from './presentation/modules/configuracion.module';
import { EmpleadosModule } from './presentation/modules/empleados.module';
import { HealthModule } from './presentation/modules/health.module';
import { ImportacionesModule } from './presentation/modules/importaciones.module';
import { PeriodosModule } from './presentation/modules/periodos.module';
import { RegistrosModule } from './presentation/modules/registros.module';
import { ReportesModule } from './presentation/modules/reportes.module';
import { UsuariosModule } from './presentation/modules/usuarios.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuditoriaModule,
    HealthModule,
    AuthModule,
    EmpleadosModule,
    ConfiguracionModule,
    PeriodosModule,
    RegistrosModule,
    ImportacionesModule,
    ReportesModule,
    UsuariosModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
