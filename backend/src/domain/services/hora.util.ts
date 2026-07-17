const MINUTOS_POR_DIA = 24 * 60;

/** Convierte "HH:mm" a minutos desde medianoche. */
export function parsearHora(horaHHmm: string): number {
  const [horas, minutos] = horaHHmm.split(':').map(Number);
  return horas * 60 + minutos;
}

/**
 * Ajusta entrada/salida a un eje continuo de minutos. Si la salida es
 * estrictamente menor a la entrada se asume que el turno cruzó la
 * medianoche. Entrada y salida iguales se tratan como 0 minutos trabajados
 * (dato vacío/inválido), no como un turno de 24 horas.
 */
export function entradaSalidaAjustadas(
  horaEntrada: string,
  horaSalida: string,
): { entrada: number; salida: number } {
  const entrada = parsearHora(horaEntrada);
  let salida = parsearHora(horaSalida);
  if (salida < entrada) {
    salida += MINUTOS_POR_DIA;
  }
  return { entrada, salida };
}

/** Minutos entre dos horas del mismo día (sin cruce de medianoche). */
export function duracionMinutos(horaInicio: string, horaFin: string): number {
  return parsearHora(horaFin) - parsearHora(horaInicio);
}

/**
 * Minutos trabajados, dentro de [entrada, salida], desde `horaReferencia`
 * (ej. inicio de jornada nocturna) en adelante. No existe una "hora fin" de
 * nocturnidad configurada, así que se asume que toda hora trabajada desde la
 * referencia en adelante —incluso cruzando medianoche— es nocturna.
 */
export function minutosDesdeReferencia(
  entrada: number,
  salida: number,
  horaReferencia: string,
): number {
  const referencia = parsearHora(horaReferencia);
  return Math.max(0, salida - Math.max(entrada, referencia));
}
