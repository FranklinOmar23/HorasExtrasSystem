import Decimal from 'decimal.js';
import { Empleado } from '../../../domain/entities/empleado.entity';
import { Salario } from '../../../domain/entities/salario.entity';
import { EmpleadoNoEncontradoError } from '../../../domain/errors/empleado-no-encontrado.error';
import {
  ActualizarEmpleadoDatos,
  CrearEmpleadoDatos,
  EmpleadoRepository,
  FiltroEmpleados,
} from '../../ports/empleado.repository.port';
import {
  CrearSalarioDatos,
  SalarioRepository,
} from '../../ports/salario.repository.port';
import { CrearSalarioUseCase } from './crear-salario.use-case';

class EmpleadoRepositoryFake implements EmpleadoRepository {
  constructor(private readonly empleados: Empleado[] = []) {}

  listar(_filtro: FiltroEmpleados): Promise<Empleado[]> {
    return Promise.resolve(this.empleados);
  }

  buscarPorId(id: string): Promise<Empleado | null> {
    return Promise.resolve(this.empleados.find((e) => e.id === id) ?? null);
  }

  buscarPorCodigo(): Promise<Empleado | null> {
    return Promise.resolve(null);
  }

  buscarPorCedula(): Promise<Empleado | null> {
    return Promise.resolve(null);
  }

  crear(_datos: CrearEmpleadoDatos): Promise<Empleado> {
    return Promise.reject(new Error('no usado en este test'));
  }

  actualizar(_id: string, _datos: ActualizarEmpleadoDatos): Promise<Empleado> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

class SalarioRepositoryFake implements SalarioRepository {
  llamadas: {
    empleadoId: string;
    datos: CrearSalarioDatos;
    cerrarVigenteAnteriorHasta: Date;
  }[] = [];

  listarPorEmpleado(_empleadoId: string): Promise<Salario[]> {
    return Promise.resolve([]);
  }

  buscarVigenteEn(): Promise<Salario | null> {
    return Promise.resolve(null);
  }

  crear(
    empleadoId: string,
    datos: CrearSalarioDatos,
    cerrarVigenteAnteriorHasta: Date,
  ): Promise<Salario> {
    this.llamadas.push({ empleadoId, datos, cerrarVigenteAnteriorHasta });
    return Promise.resolve(
      new Salario(
        'salario-1',
        empleadoId,
        datos.montoMensual,
        datos.vigenteDesde,
        null,
      ),
    );
  }
}

const EMPLEADO = new Empleado(
  'emp-1',
  40,
  'Juana Pérez',
  '001-1234567-8',
  'Supervisora',
  true,
);

describe('CrearSalarioUseCase', () => {
  it('lanza EmpleadoNoEncontradoError si el empleado no existe', async () => {
    const useCase = new CrearSalarioUseCase(
      new EmpleadoRepositoryFake([]),
      new SalarioRepositoryFake(),
    );

    await expect(
      useCase.ejecutar('emp-inexistente', {
        montoMensual: new Decimal('27000.00'),
        vigenteDesde: new Date('2026-08-01'),
      }),
    ).rejects.toBeInstanceOf(EmpleadoNoEncontradoError);
  });

  it('cierra la vigencia anterior un día antes de la nueva vigencia', async () => {
    const salarioRepo = new SalarioRepositoryFake();
    const useCase = new CrearSalarioUseCase(
      new EmpleadoRepositoryFake([EMPLEADO]),
      salarioRepo,
    );

    await useCase.ejecutar(EMPLEADO.id, {
      montoMensual: new Decimal('27000.00'),
      vigenteDesde: new Date('2026-08-01T00:00:00.000Z'),
    });

    expect(salarioRepo.llamadas).toHaveLength(1);
    expect(
      salarioRepo.llamadas[0].cerrarVigenteAnteriorHasta.toISOString(),
    ).toBe(new Date('2026-07-31T00:00:00.000Z').toISOString());
  });
});
