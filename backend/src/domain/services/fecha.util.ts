/** Devuelve la fecha (solo día, UTC) inmediatamente anterior a la dada. */
export function diaAnterior(fecha: Date): Date {
  const resultado = new Date(fecha);
  resultado.setUTCDate(resultado.getUTCDate() - 1);
  return resultado;
}
