import { AccionAuditoria } from '../../../domain/enums/accion-auditoria.enum';
import { EntidadAuditoria } from '../../../domain/enums/entidad-auditoria.enum';
import {
  AuditoriaConUsuario,
  AuditoriaPaginada,
  AuditoriaRepository,
  FiltroAuditoria,
  RegistrarAuditoriaDatos,
} from '../../ports/auditoria.repository.port';
import { Auditoria } from '../../../domain/entities/auditoria.entity';
import { ListarAuditoriaUseCase } from './listar-auditoria.use-case';

function fila(id: string): AuditoriaConUsuario {
  return {
    id,
    usuarioId: 'usuario-1',
    usuarioNombre: 'Ana Pérez',
    accion: AccionAuditoria.CREAR,
    entidad: EntidadAuditoria.PERIODO,
    entidadId: 'periodo-1',
    descripcion: 'Creó el periodo.',
    creadoEn: new Date('2026-07-01T00:00:00.000Z'),
  };
}

class AuditoriaRepositoryFake implements AuditoriaRepository {
  ultimoFiltro: FiltroAuditoria | null = null;
  constructor(
    private readonly total: number,
    private readonly items: AuditoriaConUsuario[],
  ) {}

  registrar(_datos: RegistrarAuditoriaDatos): Promise<Auditoria> {
    return Promise.reject(new Error('no usado en este test'));
  }

  listar(filtro: FiltroAuditoria): Promise<AuditoriaPaginada> {
    this.ultimoFiltro = filtro;
    return Promise.resolve({ items: this.items, total: this.total });
  }
}

describe('ListarAuditoriaUseCase', () => {
  it('usa pagina=1 y porPagina=25 por defecto', async () => {
    const repo = new AuditoriaRepositoryFake(3, [fila('a'), fila('b'), fila('c')]);
    const useCase = new ListarAuditoriaUseCase(repo);

    const resultado = await useCase.ejecutar({});

    expect(repo.ultimoFiltro?.pagina).toBe(1);
    expect(repo.ultimoFiltro?.porPagina).toBe(25);
    expect(resultado.pagina).toBe(1);
    expect(resultado.porPagina).toBe(25);
    expect(resultado.total).toBe(3);
    expect(resultado.totalPaginas).toBe(1);
  });

  it('calcula totalPaginas correctamente con más de una página', async () => {
    const repo = new AuditoriaRepositoryFake(101, [fila('a')]);
    const useCase = new ListarAuditoriaUseCase(repo);

    const resultado = await useCase.ejecutar({ porPagina: 25 });

    expect(resultado.totalPaginas).toBe(5); // ceil(101/25) = 5
  });

  it('nunca deja pasar porPagina por encima de 100 (clamp)', async () => {
    const repo = new AuditoriaRepositoryFake(0, []);
    const useCase = new ListarAuditoriaUseCase(repo);

    await useCase.ejecutar({ porPagina: 500 });

    expect(repo.ultimoFiltro?.porPagina).toBe(100);
  });

  it('nunca deja pasar pagina menor a 1 (clamp)', async () => {
    const repo = new AuditoriaRepositoryFake(0, []);
    const useCase = new ListarAuditoriaUseCase(repo);

    await useCase.ejecutar({ pagina: -3 });

    expect(repo.ultimoFiltro?.pagina).toBe(1);
  });

  it('pasa los filtros de entidad/usuario/fechas al repositorio sin alterarlos', async () => {
    const repo = new AuditoriaRepositoryFake(0, []);
    const useCase = new ListarAuditoriaUseCase(repo);
    const desde = new Date('2026-07-01T00:00:00.000Z');
    const hasta = new Date('2026-07-31T00:00:00.000Z');

    await useCase.ejecutar({
      entidad: EntidadAuditoria.PERIODO,
      usuarioId: 'usuario-9',
      desde,
      hasta,
    });

    expect(repo.ultimoFiltro?.entidad).toBe(EntidadAuditoria.PERIODO);
    expect(repo.ultimoFiltro?.usuarioId).toBe('usuario-9');
    expect(repo.ultimoFiltro?.desde).toBe(desde);
    expect(repo.ultimoFiltro?.hasta).toBe(hasta);
  });
});
