/**
 * Fecha "infinita" usada solo internamente para comparar rangos con extremo
 * abierto (fechaHasta = null, es decir, una asignación indefinida) sin tener
 * que ramificar la comparación en cada llamada.
 */
const SIN_LIMITE = new Date(8640000000000000);

/**
 * true si los rangos [aDesde, aHasta] y [bDesde, bHasta] comparten al menos
 * un día. `null` en el extremo "hasta" significa rango indefinido (abierto
 * hacia el futuro). Los límites son inclusivos: rangos que solo se tocan en
 * el mismo día (ej. uno termina el 15 y el otro empieza el 15) SÍ se
 * consideran solapados — para que no se solapen deben terminar/empezar en
 * días distintos (ej. termina el 14, empieza el 15).
 */
export function rangosDeFechasSeSolapan(
  aDesde: Date,
  aHasta: Date | null,
  bDesde: Date,
  bHasta: Date | null,
): boolean {
  const finA = aHasta ?? SIN_LIMITE;
  const finB = bHasta ?? SIN_LIMITE;
  return aDesde <= finB && bDesde <= finA;
}

/**
 * Unión de dos rangos de fechas (el más amplio que cubre a ambos). Se usa al
 * editar una asignación de turno para recalcular tanto los registros que
 * dejaron de estar cubiertos como los que ahora quedan cubiertos.
 */
export function unionDeRangos(
  aDesde: Date,
  aHasta: Date | null,
  bDesde: Date,
  bHasta: Date | null,
): { desde: Date; hasta: Date | null } {
  const desde = aDesde < bDesde ? aDesde : bDesde;
  const hasta = aHasta === null || bHasta === null ? null : aHasta > bHasta ? aHasta : bHasta;
  return { desde, hasta };
}
