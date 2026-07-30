import Decimal from 'decimal.js';
import {
  EmpleadoConSalario,
  EmpleadoRepository,
  EmpleadosPaginados,
  FiltroEmpleados,
} from '../../ports/empleado.repository.port';
import { ListarEmpleadosUseCase } from './listar-empleados.use-case';

function fila(codigo: number, montoMensualVigente: string | null): EmpleadoConSalario {
  return {
    id: `emp-${codigo}`,
    codigo,
    nombre: `Empleado ${codigo}`,
    cedula: null,
    posicion: 'Operario',
    activo: true,
    montoMensualVigente: montoMensualVigente ? new Decimal(montoMensualVigente) : null,
  };
}

class EmpleadoRepositoryFake implements EmpleadoRepository {
  ultimoFiltro: FiltroEmpleados | null = null;
  constructor(
    private readonly total: number,
    private readonly items: EmpleadoConSalario[],
  ) {}

  listar(filtro: FiltroEmpleados): Promise<EmpleadosPaginados> {
    this.ultimoFiltro = filtro;
    return Promise.resolve({ items: this.items, total: this.total });
  }
  buscarPorId(): ReturnType<EmpleadoRepository['buscarPorId']> {
    return Promise.reject(new Error('no usado en este test'));
  }
  buscarPorCodigo(): ReturnType<EmpleadoRepository['buscarPorCodigo']> {
    return Promise.reject(new Error('no usado en este test'));
  }
  buscarPorCedula(): ReturnType<EmpleadoRepository['buscarPorCedula']> {
    return Promise.reject(new Error('no usado en este test'));
  }
  crear(): ReturnType<EmpleadoRepository['crear']> {
    return Promise.reject(new Error('no usado en este test'));
  }
  actualizar(): ReturnType<EmpleadoRepository['actualizar']> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

describe('ListarEmpleadosUseCase', () => {
  it('usa pagina=1 y porPagina=25 por defecto', async () => {
    const repo = new EmpleadoRepositoryFake(2, [fila(1, '30000'), fila(2, null)]);
    const useCase = new ListarEmpleadosUseCase(repo);

    const resultado = await useCase.ejecutar({});

    expect(repo.ultimoFiltro?.pagina).toBe(1);
    expect(repo.ultimoFiltro?.porPagina).toBe(25);
    expect(resultado.total).toBe(2);
    expect(resultado.items[1].montoMensualVigente).toBeNull();
  });

  it('permite pedir hasta 500 por página (para resolver el mapa completo de empleados)', async () => {
    const repo = new EmpleadoRepositoryFake(0, []);
    const useCase = new ListarEmpleadosUseCase(repo);

    await useCase.ejecutar({ porPagina: 500 });

    expect(repo.ultimoFiltro?.porPagina).toBe(500);
  });

  it('nunca deja pasar porPagina por encima de 500 (clamp)', async () => {
    const repo = new EmpleadoRepositoryFake(0, []);
    const useCase = new ListarEmpleadosUseCase(repo);

    await useCase.ejecutar({ porPagina: 10000 });

    expect(repo.ultimoFiltro?.porPagina).toBe(500);
  });

  it('pasa el filtro de rango de salario al repositorio sin alterarlo', async () => {
    const repo = new EmpleadoRepositoryFake(0, []);
    const useCase = new ListarEmpleadosUseCase(repo);
    const min = new Decimal('25000');
    const max = new Decimal('40000');

    await useCase.ejecutar({ salarioMin: min, salarioMax: max, search: 'Pérez', activo: true });

    expect(repo.ultimoFiltro?.salarioMin).toBe(min);
    expect(repo.ultimoFiltro?.salarioMax).toBe(max);
    expect(repo.ultimoFiltro?.search).toBe('Pérez');
    expect(repo.ultimoFiltro?.activo).toBe(true);
  });

  it('calcula totalPaginas correctamente', async () => {
    const repo = new EmpleadoRepositoryFake(53, []);
    const useCase = new ListarEmpleadosUseCase(repo);

    const resultado = await useCase.ejecutar({ porPagina: 25 });

    expect(resultado.totalPaginas).toBe(3); // ceil(53/25) = 3
  });
});
