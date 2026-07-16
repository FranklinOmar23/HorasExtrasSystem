import { Prisma } from '@prisma/client';
import Decimal from 'decimal.js';

/** Convierte un Prisma.Decimal (columna @db.Decimal) a decimal.js, usado en el dominio. */
export function decimalDesdeDb(valor: Prisma.Decimal): Decimal {
  return new Decimal(valor.toString());
}
