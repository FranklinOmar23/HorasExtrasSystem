import Decimal from 'decimal.js';
import { TipoHoraExtra } from '../entities/tipo-hora-extra.entity';
import { ModoValorizacion } from '../enums/modo-valorizacion.enum';
import { TipoHoraExtraCodigo } from '../enums/tipo-hora-extra-codigo.enum';
import { MotorCalculo, ParametrosCalculo } from './motor-calculo';

const TIPOS = [
  new TipoHoraExtra(
    'tipo-he35',
    TipoHoraExtraCodigo.HE_35,
    'Hora extra 35%',
    new Decimal('35.00'),
    ModoValorizacion.COMPLETA,
    true,
  ),
  new TipoHoraExtra(
    'tipo-he100',
    TipoHoraExtraCodigo.HE_100,
    'Hora extra 100%',
    new Decimal('100.00'),
    ModoValorizacion.COMPLETA,
    true,
  ),
  new TipoHoraExtra(
    'tipo-nocturna',
    TipoHoraExtraCodigo.NOCTURNA_15,
    'Recargo nocturno 15%',
    new Decimal('15.00'),
    ModoValorizacion.SOLO_RECARGO,
    true,
  ),
  new TipoHoraExtra(
    'tipo-feriado',
    TipoHoraExtraCodigo.FERIADO,
    'Hora feriado 100%',
    new Decimal('100.00'),
    ModoValorizacion.SOLO_RECARGO,
    true,
  ),
];

const PARAMETROS: ParametrosCalculo = {
  horasJornada: new Decimal('8'),
  horasAlmuerzo: new Decimal('1'),
  entradaSabado: '09:00',
  salidaSabado: '13:00',
  inicioNocturna: '21:00',
  toleranciaMinutos: 0,
};

const SALARIO_HORA = new Decimal('100.00');

/** Encuentra la próxima fecha (desde el ancla) con el día de la semana pedido, sin asumir el calendario. */
function proximaFechaConDia(diaSemanaObjetivo: number): Date {
  const fecha = new Date('2026-08-01T00:00:00.000Z');
  while (fecha.getUTCDay() !== diaSemanaObjetivo) {
    fecha.setUTCDate(fecha.getUTCDate() + 1);
  }
  return fecha;
}

const LUNES = proximaFechaConDia(1);
const SABADO = proximaFechaConDia(6);
const DOMINGO = proximaFechaConDia(0);

function calcular(
  fecha: Date,
  horaEntrada: string,
  horaSalida: string,
  esFeriado = false,
) {
  const motor = new MotorCalculo(TIPOS);
  return motor.calcular(
    {
      fecha,
      horaEntrada,
      horaSalida,
      esFeriado,
      salarioHoraUsado: SALARIO_HORA,
    },
    PARAMETROS,
  );
}

describe('MotorCalculo', () => {
  it('no genera filas si el día de semana no excede la jornada (8h netas)', () => {
    const filas = calcular(LUNES, '08:30', '17:30');
    expect(filas).toHaveLength(0);
  });

  it('genera HE_35 por el exceso en un día de semana, pagado completo (×1.35)', () => {
    const filas = calcular(LUNES, '08:30', '19:30');
    expect(filas).toHaveLength(1);
    expect(filas[0].tipoHoraCodigo).toBe(TipoHoraExtraCodigo.HE_35);
    expect(filas[0].cantidadHoras.toString()).toBe('2');
    expect(filas[0].monto.toString()).toBe('270'); // 100 × 2 × 1.35
  });

  it('no genera filas si el sábado no excede su horario (09:00-13:00)', () => {
    const filas = calcular(SABADO, '09:00', '13:00');
    expect(filas).toHaveLength(0);
  });

  it('genera HE_100 por el exceso en sábado, pagado completo (×2.00)', () => {
    const filas = calcular(SABADO, '09:00', '15:00');
    expect(filas).toHaveLength(1);
    expect(filas[0].tipoHoraCodigo).toBe(TipoHoraExtraCodigo.HE_100);
    expect(filas[0].cantidadHoras.toString()).toBe('2');
    expect(filas[0].monto.toString()).toBe('400'); // 100 × 2 × 2.00
  });

  it('en domingo, todas las horas trabajadas son HE_100', () => {
    const filas = calcular(DOMINGO, '08:00', '12:00');
    expect(filas).toHaveLength(1);
    expect(filas[0].tipoHoraCodigo).toBe(TipoHoraExtraCodigo.HE_100);
    expect(filas[0].cantidadHoras.toString()).toBe('4');
    expect(filas[0].monto.toString()).toBe('800'); // 100 × 4 × 2.00
  });

  it('en feriado, todas las horas trabajadas son FERIADO, sin duplicar la base (×1.00)', () => {
    const filas = calcular(LUNES, '08:00', '12:00', true);
    expect(filas).toHaveLength(1);
    expect(filas[0].tipoHoraCodigo).toBe(TipoHoraExtraCodigo.FERIADO);
    expect(filas[0].cantidadHoras.toString()).toBe('4');
    expect(filas[0].monto.toString()).toBe('400'); // 100 × 4 × 1.00 (no ×2.00)
  });

  it('suma NOCTURNA_15 como fila aparte, sin duplicar la base de la hora extra', () => {
    const filas = calcular(LUNES, '08:30', '22:00');
    expect(filas).toHaveLength(2);

    const he35 = filas.find(
      (f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_35,
    );
    const nocturna = filas.find(
      (f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.NOCTURNA_15,
    );

    expect(he35?.cantidadHoras.toString()).toBe('4.5');
    expect(he35?.monto.toString()).toBe('607.5'); // 100 × 4.5 × 1.35

    expect(nocturna?.cantidadHoras.toString()).toBe('1');
    expect(nocturna?.monto.toString()).toBe('15'); // 100 × 1 × 0.15 (solo el recargo)
  });

  it('maneja turnos que cruzan medianoche', () => {
    const filas = calcular(LUNES, '20:00', '02:00');
    // 6h brutas - 1h almuerzo = 5h netas, dentro del presupuesto de 8h → sin HE_35.
    expect(filas).toHaveLength(1);
    expect(filas[0].tipoHoraCodigo).toBe(TipoHoraExtraCodigo.NOCTURNA_15);
    expect(filas[0].cantidadHoras.toString()).toBe('5');
  });

  it('no genera filas si la entrada y la salida son iguales', () => {
    const filas = calcular(LUNES, '08:30', '08:30');
    expect(filas).toHaveLength(0);
  });
});
