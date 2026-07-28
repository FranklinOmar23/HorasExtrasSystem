import Decimal from 'decimal.js';
import { Turno } from '../../../domain/entities/turno.entity';
import { TurnoCodigoDuplicadoError } from '../../../domain/errors/turno-codigo-duplicado.error';
import {
  ActualizarTurnoDatos,
  CrearTurnoDatos,
  TurnoRepository,
} from '../../ports/turno.repository.port';
import { CrearTurnoUseCase } from './crear-turno.use-case';

class TurnoRepositoryFake implements TurnoRepository {
  turnos: Turno[] = [];

  listar(): Promise<Turno[]> {
    return Promise.resolve(this.turnos);
  }

  buscarPorId(id: string): Promise<Turno | null> {
    return Promise.resolve(this.turnos.find((t) => t.id === id) ?? null);
  }

  buscarPorCodigo(codigo: string): Promise<Turno | null> {
    return Promise.resolve(this.turnos.find((t) => t.codigo === codigo) ?? null);
  }

  crear(datos: CrearTurnoDatos): Promise<Turno> {
    const turno = new Turno(
      `turno-${this.turnos.length + 1}`,
      datos.codigo,
      datos.nombre,
      datos.horaInicio,
      datos.horaFin,
      datos.horasJornada,
      datos.cruzaMedianoche,
      datos.descuentaAlmuerzo,
      true,
    );
    this.turnos.push(turno);
    return Promise.resolve(turno);
  }

  actualizar(_id: string, _datos: ActualizarTurnoDatos): Promise<Turno> {
    return Promise.reject(new Error('no usado en este test'));
  }

  eliminar(): Promise<void> {
    return Promise.reject(new Error('no usado en este test'));
  }
}

function datosBase(): CrearTurnoDatos {
  return {
    codigo: 'NOCTURNO',
    nombre: 'Nocturno',
    horaInicio: '22:00',
    horaFin: '08:00',
    horasJornada: new Decimal('8'),
    cruzaMedianoche: true,
    descuentaAlmuerzo: true,
  };
}

describe('CrearTurnoUseCase', () => {
  it('crea el turno cuando el código no existe', async () => {
    const repo = new TurnoRepositoryFake();
    const useCase = new CrearTurnoUseCase(repo);

    const turno = await useCase.ejecutar(datosBase());

    expect(turno.codigo).toBe('NOCTURNO');
    expect(repo.turnos).toHaveLength(1);
  });

  it('lanza TurnoCodigoDuplicadoError si el código ya existe', async () => {
    const repo = new TurnoRepositoryFake();
    const useCase = new CrearTurnoUseCase(repo);
    await useCase.ejecutar(datosBase());

    await expect(useCase.ejecutar(datosBase())).rejects.toBeInstanceOf(
      TurnoCodigoDuplicadoError,
    );
  });
});
