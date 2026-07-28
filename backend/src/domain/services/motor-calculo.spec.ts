import Decimal from 'decimal.js';
import { TipoHoraExtra } from '../entities/tipo-hora-extra.entity';
import { ModoValorizacion } from '../enums/modo-valorizacion.enum';
import { TipoHoraExtraCodigo } from '../enums/tipo-hora-extra-codigo.enum';
import { MotorCalculo, ParametrosCalculo, VentanaTurno } from './motor-calculo';

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
  horasAlmuerzo: new Decimal('1'),
  inicioNocturna: '21:00',
  finNocturna: '07:00',
  toleranciaMinutos: 0,
};

const TURNO_DIURNO: VentanaTurno = {
  horaInicio: '08:30',
  horaFin: '17:30',
  cruzaMedianoche: false,
  horasJornada: new Decimal('8'),
  descuentaAlmuerzo: true,
};

const TURNO_SABADO: VentanaTurno = {
  horaInicio: '09:00',
  horaFin: '13:00',
  cruzaMedianoche: false,
  horasJornada: new Decimal('4'),
  descuentaAlmuerzo: false,
};

const TURNO_NOCTURNO: VentanaTurno = {
  horaInicio: '22:00',
  horaFin: '08:00',
  cruzaMedianoche: true,
  horasJornada: new Decimal('8'),
  descuentaAlmuerzo: true,
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

interface Opciones {
  turno?: VentanaTurno;
  turnoAsignadoExplicitamente?: boolean;
  esFeriadoDiaEntrada?: boolean;
  esFeriadoDiaSiguiente?: boolean;
}

function calcular(
  fecha: Date,
  horaEntrada: string,
  horaSalida: string,
  opciones: Opciones = {},
) {
  const diaSemana = fecha.getUTCDay();
  const turnoPorDefecto = diaSemana === 6 ? TURNO_SABADO : TURNO_DIURNO;
  const motor = new MotorCalculo(TIPOS);
  return motor.calcular(
    {
      fecha,
      horaEntrada,
      horaSalida,
      turno: opciones.turno ?? turnoPorDefecto,
      turnoAsignadoExplicitamente: opciones.turnoAsignadoExplicitamente ?? false,
      esFeriadoDiaEntrada: opciones.esFeriadoDiaEntrada ?? false,
      esFeriadoDiaSiguiente: opciones.esFeriadoDiaSiguiente ?? false,
      salarioHoraUsado: SALARIO_HORA,
    },
    PARAMETROS,
  );
}

describe('MotorCalculo — turno por defecto (sin asignación, regresión)', () => {
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
    const filas = calcular(LUNES, '08:00', '12:00', { esFeriadoDiaEntrada: true });
    expect(filas).toHaveLength(1);
    expect(filas[0].tipoHoraCodigo).toBe(TipoHoraExtraCodigo.FERIADO);
    expect(filas[0].cantidadHoras.toString()).toBe('4');
    expect(filas[0].monto.toString()).toBe('400'); // 100 × 4 × 1.00 (no ×2.00)
  });

  it('suma NOCTURNA_15 como fila aparte, sin duplicar la base de la hora extra', () => {
    const filas = calcular(LUNES, '08:30', '22:00');
    expect(filas).toHaveLength(2);

    const he35 = filas.find((f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_35);
    const nocturna = filas.find(
      (f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.NOCTURNA_15,
    );

    expect(he35?.cantidadHoras.toString()).toBe('4.5');
    expect(he35?.monto.toString()).toBe('607.5'); // 100 × 4.5 × 1.35

    expect(nocturna?.cantidadHoras.toString()).toBe('1');
    expect(nocturna?.monto.toString()).toBe('15'); // 100 × 1 × 0.15 (solo el recargo)
  });

  it('un turno sin asignación que excede la jornada total no genera HE_35 solo por trabajar fuera del horario diurno', () => {
    // 6h brutas - 1h almuerzo = 5h netas, dentro del presupuesto de 8h del turno
    // por defecto → sin HE_35, aunque las horas no coincidan con 08:30-17:30.
    const filas = calcular(LUNES, '20:00', '02:00');
    expect(filas).toHaveLength(1);
    expect(filas[0].tipoHoraCodigo).toBe(TipoHoraExtraCodigo.NOCTURNA_15);
    expect(filas[0].cantidadHoras.toString()).toBe('5');
  });

  it('diurno que sale pasada la medianoche: HE_35 por el exceso total + nocturna hasta la salida', () => {
    const filas = calcular(LUNES, '08:30', '00:48');
    const he35 = filas.find((f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_35);
    const nocturna = filas.find(
      (f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.NOCTURNA_15,
    );

    // 16.3h brutas - 1h almuerzo = 15.3h netas, presupuesto 8h → 7.3h exceso.
    expect(he35?.cantidadHoras.toString()).toBe('7.3');
    // Banda nocturna 21:00–00:48.
    expect(nocturna?.cantidadHoras.toString()).toBe('3.8');
  });

  it('no genera filas si la entrada y la salida son iguales', () => {
    const filas = calcular(LUNES, '08:30', '08:30');
    expect(filas).toHaveLength(0);
  });
});

describe('MotorCalculo — turno asignado explícitamente (ej. NOCTURNO puesto por RRHH)', () => {
  const opciones: Opciones = { turno: TURNO_NOCTURNO, turnoAsignadoExplicitamente: true };

  it('nocturno exacto (22:00–08:00): 0 horas extra, ~9h de recargo nocturno (22:00–07:00)', () => {
    const filas = calcular(LUNES, '22:00', '08:00', opciones);

    expect(filas.some((f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_35)).toBe(false);
    expect(filas.some((f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_100)).toBe(false);
    const nocturna = filas.find(
      (f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.NOCTURNA_15,
    );
    expect(nocturna?.cantidadHoras.toString()).toBe('9');
  });

  it('sale 09:03 (turno hasta 08:00): 1.05h de HE_35 por el exceso después de la ventana', () => {
    const filas = calcular(LUNES, '22:00', '09:03', opciones);

    const he35 = filas.find((f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_35);
    expect(he35?.cantidadHoras.toString()).toBe('1.05');
  });

  it('entra 21:15 (turno desde 22:00): 0.75h de HE_35 por el exceso antes de la ventana', () => {
    const filas = calcular(LUNES, '21:15', '08:00', opciones);

    const he35 = filas.find((f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_35);
    expect(he35?.cantidadHoras.toString()).toBe('0.75');
  });

  it('turno nocturno de sábado a domingo: la porción del sábado no genera HE (dentro de ventana), pero TODA la porción del domingo sí, aunque encaje exacto en la ventana', () => {
    // Entra sábado 22:00, ventana hasta domingo 08:00 exacto (sin exceso de
    // reloj), pero la porción 00:00–08:00 cae en domingo: por la regla
    // confirmada, el domingo siempre lleva su recargo, incluso dentro de
    // una ventana asignada.
    const filas = calcular(SABADO, '22:00', '08:00', opciones);

    const he100 = filas.find((f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_100);
    expect(he100?.cantidadHoras.toString()).toBe('8'); // 00:00–08:00 del domingo, completo
    expect(filas.some((f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_35)).toBe(false);
  });

  it('domingo dentro de un turno asignado SÍ lleva el recargo de domingo (HE_100), incluso dentro de la ventana', () => {
    // Entra domingo 22:00 (día de la entrada = domingo), sale 09:03 el lunes:
    // la porción del domingo (22:00–24:00) es HE_100 completa por ser domingo,
    // y el exceso del lunes después de las 08:00 es HE_35 (lunes es laboral).
    const filas = calcular(DOMINGO, '22:00', '09:03', opciones);

    const he100 = filas.find((f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_100);
    const he35 = filas.find((f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_35);

    expect(he100?.cantidadHoras.toString()).toBe('2'); // 22:00–24:00 del domingo
    expect(he35?.cantidadHoras.toString()).toBe('1.05'); // exceso del lunes después de 08:00
  });

  it('sábado dentro de un turno asignado que NO cruza medianoche: el exceso se paga como HE_100, igual que el sábado por defecto', () => {
    const turnoTarde: VentanaTurno = {
      horaInicio: '14:00',
      horaFin: '22:00',
      cruzaMedianoche: false,
      horasJornada: new Decimal('8'),
      descuentaAlmuerzo: true,
    };
    const filas = calcular(SABADO, '14:00', '23:00', {
      turno: turnoTarde,
      turnoAsignadoExplicitamente: true,
    });

    const he100 = filas.find((f) => f.tipoHoraCodigo === TipoHoraExtraCodigo.HE_100);
    expect(he100?.cantidadHoras.toString()).toBe('1');
  });
});
