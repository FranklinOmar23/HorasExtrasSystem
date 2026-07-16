import Decimal from 'decimal.js';
import {
  ActualizarEmpleadoDatos,
  CrearEmpleadoDatos,
  EmpleadoRepository,
  FiltroEmpleados,
} from '../../ports/empleado.repository.port';
import { Empleado } from '../../../domain/entities/empleado.entity';
import { EmpleadoCedulaDuplicadaError } from '../../../domain/errors/empleado-cedula-duplicada.error';
import { EmpleadoCodigoDuplicadoError } from '../../../domain/errors/empleado-codigo-duplicado.error';
import { CrearEmpleadoUseCase } from './crear-empleado.use-case';

class EmpleadoRepositoryFake implements EmpleadoRepository {
  empleados: Empleado[] = [];

  listar(_filtro: FiltroEmpleados): Promise<Empleado[]> {
    return Promise.resolve(this.empleados);
  }

  buscarPorId(id: string): Promise<Empleado | null> {
    return Promise.resolve(this.empleados.find((e) => e.id === id) ?? null);
  }

  buscarPorCodigo(codigo: number): Promise<Empleado | null> {
    return Promise.resolve(
      this.empleados.find((e) => e.codigo === codigo) ?? null,
    );
  }

  buscarPorCedula(cedula: string): Promise<Empleado | null> {
    return Promise.resolve(
      this.empleados.find((e) => e.cedula === cedula) ?? null,
    );
  }

  crear(datos: CrearEmpleadoDatos): Promise<Empleado> {
    const empleado = new Empleado(
      `id-${this.empleados.length + 1}`,
      datos.codigo,
      datos.nombre,
      datos.cedula,
      datos.posicion,
      true,
    );
    this.empleados.push(empleado);
    return Promise.resolve(empleado);
  }

  async actualizar(
    id: string,
    _datos: ActualizarEmpleadoDatos,
  ): Promise<Empleado> {
    const empleado = await this.buscarPorId(id);
    if (!empleado) throw new Error('no encontrado');
    return empleado;
  }
}

function datosBase(): CrearEmpleadoDatos {
  return {
    codigo: 40,
    nombre: 'Juana Pérez',
    cedula: '001-1234567-8',
    posicion: 'Supervisora',
    salarioInicial: {
      montoMensual: new Decimal('25000.00'),
      vigenteDesde: new Date('2026-01-01'),
    },
  };
}

describe('CrearEmpleadoUseCase', () => {
  it('crea el empleado cuando el código y la cédula no existen', async () => {
    const repo = new EmpleadoRepositoryFake();
    const useCase = new CrearEmpleadoUseCase(repo);

    const empleado = await useCase.ejecutar(datosBase());

    expect(empleado.codigo).toBe(40);
    expect(repo.empleados).toHaveLength(1);
  });

  it('lanza EmpleadoCodigoDuplicadoError si el código ya existe', async () => {
    const repo = new EmpleadoRepositoryFake();
    const useCase = new CrearEmpleadoUseCase(repo);
    await useCase.ejecutar(datosBase());

    await expect(
      useCase.ejecutar({ ...datosBase(), cedula: '001-9999999-9' }),
    ).rejects.toBeInstanceOf(EmpleadoCodigoDuplicadoError);
  });

  it('lanza EmpleadoCedulaDuplicadaError si la cédula ya existe', async () => {
    const repo = new EmpleadoRepositoryFake();
    const useCase = new CrearEmpleadoUseCase(repo);
    await useCase.ejecutar(datosBase());

    await expect(
      useCase.ejecutar({ ...datosBase(), codigo: 41 }),
    ).rejects.toBeInstanceOf(EmpleadoCedulaDuplicadaError);
  });
});
