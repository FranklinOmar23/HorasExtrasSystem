export const MINUTOS_POR_DIA = 24 * 60;

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

/** Minutos de solape entre [aInicio, aFin] y [bInicio, bFin] en el mismo eje continuo. */
export function solapeMinutos(
  aInicio: number,
  aFin: number,
  bInicio: number,
  bFin: number,
): number {
  return Math.max(0, Math.min(aFin, bFin) - Math.max(aInicio, bInicio));
}
