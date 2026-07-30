import Decimal from 'decimal.js';
import {
  EmpleadoConSalario,
  EmpleadoRepository,
} from '../../ports/empleado.repository.port';
import { normalizarPaginacion, totalPaginas } from '../../services/paginacion.util';

/** Más alto que Auditoría (100): la lista completa de empleados de la
 *  empresa (unos pocos cientos como mucho) puede pedirse "de una vez" con un
 *  porPagina grande, para casos que necesitan resolver el mapa completo
 *  código/nombre (ej. tablas de registros/asignaciones), sin que eso
 *  requiera un modo "sin paginar" aparte. */
export const POR_PAGINA_DEFECTO = 25;
export const POR_PAGINA_MAXIMO = 500;

export interface FiltroListarEmpleados {
  search?: string;
  activo?: boolean;
  salarioMin?: Decimal;
  salarioMax?: Decimal;
  pagina?: number;
  porPagina?: number;
}

export interface ResultadoListarEmpleados {
  items: EmpleadoConSalario[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export class ListarEmpleadosUseCase {
  constructor(private readonly empleadoRepository: EmpleadoRepository) {}

  async ejecutar(
    filtro: FiltroListarEmpleados,
  ): Promise<ResultadoListarEmpleados> {
    const { pagina, porPagina } = normalizarPaginacion(
      filtro.pagina,
      filtro.porPagina,
      POR_PAGINA_DEFECTO,
      POR_PAGINA_MAXIMO,
    );

    const { items, total } = await this.empleadoRepository.listar({
      search: filtro.search,
      activo: filtro.activo,
      salarioMin: filtro.salarioMin,
      salarioMax: filtro.salarioMax,
      pagina,
      porPagina,
    });

    return {
      items,
      total,
      pagina,
      porPagina,
      totalPaginas: totalPaginas(total, porPagina),
    };
  }
}
