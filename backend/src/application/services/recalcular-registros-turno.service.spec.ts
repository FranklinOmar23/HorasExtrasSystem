import Decimal from 'decimal.js';
import { Periodo } from '../../domain/entities/periodo.entity';
import { RegistroHoras } from '../../domain/entities/registro-horas.entity';
import { EstadoPeriodo } from '../../domain/enums/estado-periodo.enum';
import { OrigenRegistro } from '../../domain/enums/origen-registro.enum';
import { TipoHoraExtraCodigo } from '../../domain/enums/tipo-hora-extra-codigo.enum';
import { PeriodoCerradoError } from '../../domain/errors/periodo-cerrado.error';
import { FilaCalculo } from '../../domain/services/motor-calculo';
import {
  CrearPeriodoDatos,
  PeriodoRepository,
} from '../ports/periodo.repository.port';
import {
  ActualizarRegistroDatos,
  CrearRegistroDatos,
  RegistroConCalculos,
  RegistroHorasRepository,
} from '../ports/registro-horas.repository.port';
import { CalcularDesgloseService } from './calcular-desglose.service';
import { RecalcularRegistrosPorCambioDeTurnoService } from './recalcular-registros-turno.service';

class RegistroHorasRepositoryFake implements RegistroHorasRepository {
  actualizaciones: { id: string; filas: FilaCalculo[] }[] = [];

  constructor(private registros: RegistroConCalculos[] = []) {}

  listarPorPeriodo(): Promise<RegistroConCalculos[]> {
    return Promise.reject(new Error('no usado en este test'));
  }
  listarPorEmpleadoYRango(
    empleadoId: string,
    desde: Date,
    hasta: Date | null,
  ): Promise<RegistroConCalculos[]> {
    return Promise.resolve(
      this.registros.filter(
        (r) =>
          r.registro.empleadoId === empleadoId &&
          r.registro.fecha >= desde &&
          (hasta === null || r.registro.fecha <= hasta),
      ),
    );
  }
  buscarPorId(): Promise<RegistroConCalculos | null> {
    return Promise.reject(new Error('no usado en este test'));
  }
  buscarPorEmpleadoYFecha(): Promise<RegistroConCalculos | null> {
    return Promise.reject(new Error('no usado en este test'));
  }
  crear(_datos: CrearRegistroDatos): Promise<RegistroConCalculos> {
    return Promise.reject(new Error('no usado en este test'));
  }
  actualizar(
    id: string,
    _datos: ActualizarRegistroDatos,
    filas: FilaCalculo[],
  ): Promise<RegistroConCalculos> {
    this.actualizaciones.push({ id, filas });
    const existente = this.registros.find((r) => r.registro.id === id)!;
    return Promise.resolve({ ...existente, calculos: [] });
  }
  eliminar(): Promise<void> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

class PeriodoRepositoryFake implements PeriodoRepository {
  constructor(private periodos: Periodo[] = []) {}
  listar(): Promise<Periodo[]> {
    return Promise.resolve(this.periodos);
  }
  listarEliminados(): Promise<Periodo[]> {
    return Promise.resolve([]);
  }
  buscarPorId(id: string): Promise<Periodo | null> {
    return Promise.resolve(this.periodos.find((p) => p.id === id) ?? null);
  }
  buscarPorFechas(): Promise<Periodo | null> {
    return Promise.resolve(null);
  }
  crear(_datos: CrearPeriodoDatos): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }
  cerrar(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }
  eliminar(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }
  restaurar(): Promise<Periodo> {
    return Promise.reject(new Error('no usado en este test'));
  }
  eliminarPermanentemente(): Promise<void> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

function registro(
  id: string,
  periodoId: string,
  fecha: string,
): RegistroConCalculos {
  return {
    registro: new RegistroHoras(
      id,
      periodoId,
      'empleado-1',
      new Date(fecha),
      '08:30',
      '17:30',
      OrigenRegistro.MANUAL,
      null,
      null,
      false,
    ),
    calculos: [],
  };
}

const PERIODO_ABIERTO = new Periodo(
  'periodo-abierto',
  new Date('2026-08-01'),
  new Date('2026-08-15'),
  EstadoPeriodo.ABIERTO,
  null,
  null,
  null,
  null,
);

const PERIODO_CERRADO = new Periodo(
  'periodo-cerrado',
  new Date('2026-07-01'),
  new Date('2026-07-15'),
  EstadoPeriodo.CERRADO,
  new Date('2026-07-16'),
  'usuario-0',
  null,
  null,
);

describe('RecalcularRegistrosPorCambioDeTurnoService', () => {
  describe('verificarPeriodosAbiertos', () => {
    it('no lanza nada si todos los registros afectados están en periodos abiertos', async () => {
      const registros = [registro('reg-1', PERIODO_ABIERTO.id, '2026-08-05')];
      const service = new RecalcularRegistrosPorCambioDeTurnoService(
        new RegistroHorasRepositoryFake(registros),
        new PeriodoRepositoryFake([PERIODO_ABIERTO]),
        {} as unknown as CalcularDesgloseService,
      );

      await expect(
        service.verificarPeriodosAbiertos(
          'empleado-1',
          new Date('2026-08-01'),
          new Date('2026-08-15'),
        ),
      ).resolves.toBeUndefined();
    });

    it('lanza PeriodoCerradoError si algún registro afectado está en un periodo cerrado', async () => {
      const registros = [registro('reg-1', PERIODO_CERRADO.id, '2026-07-05')];
      const service = new RecalcularRegistrosPorCambioDeTurnoService(
        new RegistroHorasRepositoryFake(registros),
        new PeriodoRepositoryFake([PERIODO_CERRADO]),
        {} as unknown as CalcularDesgloseService,
      );

      await expect(
        service.verificarPeriodosAbiertos(
          'empleado-1',
          new Date('2026-07-01'),
          new Date('2026-07-15'),
        ),
      ).rejects.toBeInstanceOf(PeriodoCerradoError);
    });
  });

  describe('recalcular', () => {
    it('recalcula los calculos de cada registro afectado con el motor y los persiste', async () => {
      const registros = [
        registro('reg-1', PERIODO_ABIERTO.id, '2026-08-05'),
        registro('reg-2', PERIODO_ABIERTO.id, '2026-08-06'),
      ];
      const registroRepo = new RegistroHorasRepositoryFake(registros);
      const filasCalculadas: FilaCalculo[] = [
        {
          tipoHoraId: 'tipo-1',
          tipoHoraCodigo: TipoHoraExtraCodigo.HE_35,
          cantidadHoras: new Decimal('2'),
          porcentajeAplicado: new Decimal('35'),
          salarioHoraUsado: new Decimal('100'),
          monto: new Decimal('270'),
        },
      ];
      const calcularDesgloseFake = {
        calcular: jest.fn().mockResolvedValue(filasCalculadas),
      };

      const service = new RecalcularRegistrosPorCambioDeTurnoService(
        registroRepo,
        new PeriodoRepositoryFake([PERIODO_ABIERTO]),
        calcularDesgloseFake as unknown as CalcularDesgloseService,
      );

      await service.recalcular(
        'empleado-1',
        new Date('2026-08-01'),
        new Date('2026-08-15'),
      );

      expect(calcularDesgloseFake.calcular).toHaveBeenCalledTimes(2);
      expect(registroRepo.actualizaciones).toHaveLength(2);
      expect(registroRepo.actualizaciones[0].filas).toEqual(filasCalculadas);
    });
  });
});
