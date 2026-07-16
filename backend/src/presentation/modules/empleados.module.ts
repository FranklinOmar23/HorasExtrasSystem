import { Module } from '@nestjs/common';
import { EMPLEADO_REPOSITORY } from '../../application/ports/empleado.repository.port';
import type { EmpleadoRepository } from '../../application/ports/empleado.repository.port';
import { CrearEmpleadoUseCase } from '../../application/use-cases/empleados/crear-empleado.use-case';
import { ListarEmpleadosUseCase } from '../../application/use-cases/empleados/listar-empleados.use-case';
import { EmpleadoPrismaRepository } from '../../infrastructure/repositories/empleado.prisma.repository';
import { EmpleadosController } from '../controllers/empleados.controller';

@Module({
  controllers: [EmpleadosController],
  providers: [
    { provide: EMPLEADO_REPOSITORY, useClass: EmpleadoPrismaRepository },
    {
      provide: ListarEmpleadosUseCase,
      useFactory: (repo: EmpleadoRepository) =>
        new ListarEmpleadosUseCase(repo),
      inject: [EMPLEADO_REPOSITORY],
    },
    {
      provide: CrearEmpleadoUseCase,
      useFactory: (repo: EmpleadoRepository) => new CrearEmpleadoUseCase(repo),
      inject: [EMPLEADO_REPOSITORY],
    },
  ],
})
export class EmpleadosModule {}
