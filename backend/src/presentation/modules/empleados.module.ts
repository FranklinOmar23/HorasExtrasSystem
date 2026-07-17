import { Module } from '@nestjs/common';
import { EMPLEADO_REPOSITORY } from '../../application/ports/empleado.repository.port';
import type { EmpleadoRepository } from '../../application/ports/empleado.repository.port';
import { SALARIO_REPOSITORY } from '../../application/ports/salario.repository.port';
import type { SalarioRepository } from '../../application/ports/salario.repository.port';
import { ActualizarEmpleadoUseCase } from '../../application/use-cases/empleados/actualizar-empleado.use-case';
import { CrearEmpleadoUseCase } from '../../application/use-cases/empleados/crear-empleado.use-case';
import { ListarEmpleadosUseCase } from '../../application/use-cases/empleados/listar-empleados.use-case';
import { ObtenerEmpleadoUseCase } from '../../application/use-cases/empleados/obtener-empleado.use-case';
import { CrearSalarioUseCase } from '../../application/use-cases/salarios/crear-salario.use-case';
import { ListarSalariosUseCase } from '../../application/use-cases/salarios/listar-salarios.use-case';
import { EmpleadoPrismaRepository } from '../../infrastructure/repositories/empleado.prisma.repository';
import { SalarioPrismaRepository } from '../../infrastructure/repositories/salario.prisma.repository';
import { EmpleadosController } from '../controllers/empleados.controller';

@Module({
  controllers: [EmpleadosController],
  providers: [
    { provide: EMPLEADO_REPOSITORY, useClass: EmpleadoPrismaRepository },
    { provide: SALARIO_REPOSITORY, useClass: SalarioPrismaRepository },
    {
      provide: ListarEmpleadosUseCase,
      useFactory: (repo: EmpleadoRepository) =>
        new ListarEmpleadosUseCase(repo),
      inject: [EMPLEADO_REPOSITORY],
    },
    {
      provide: ObtenerEmpleadoUseCase,
      useFactory: (repo: EmpleadoRepository) =>
        new ObtenerEmpleadoUseCase(repo),
      inject: [EMPLEADO_REPOSITORY],
    },
    {
      provide: CrearEmpleadoUseCase,
      useFactory: (repo: EmpleadoRepository) => new CrearEmpleadoUseCase(repo),
      inject: [EMPLEADO_REPOSITORY],
    },
    {
      provide: ActualizarEmpleadoUseCase,
      useFactory: (repo: EmpleadoRepository) =>
        new ActualizarEmpleadoUseCase(repo),
      inject: [EMPLEADO_REPOSITORY],
    },
    {
      provide: ListarSalariosUseCase,
      useFactory: (
        empleadoRepo: EmpleadoRepository,
        salarioRepo: SalarioRepository,
      ) => new ListarSalariosUseCase(empleadoRepo, salarioRepo),
      inject: [EMPLEADO_REPOSITORY, SALARIO_REPOSITORY],
    },
    {
      provide: CrearSalarioUseCase,
      useFactory: (
        empleadoRepo: EmpleadoRepository,
        salarioRepo: SalarioRepository,
      ) => new CrearSalarioUseCase(empleadoRepo, salarioRepo),
      inject: [EMPLEADO_REPOSITORY, SALARIO_REPOSITORY],
    },
  ],
  exports: [EMPLEADO_REPOSITORY, SALARIO_REPOSITORY],
})
export class EmpleadosModule {}
