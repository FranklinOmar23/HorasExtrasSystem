export enum ModoValorizacion {
  /** multiplicador = 1 + porcentaje/100: la hora se paga completa más el recargo. */
  COMPLETA = 'COMPLETA',
  /** multiplicador = porcentaje/100: solo se paga el recargo adicional. */
  SOLO_RECARGO = 'SOLO_RECARGO',
}
