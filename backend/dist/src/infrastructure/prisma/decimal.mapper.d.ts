import { Prisma } from '@prisma/client';
import Decimal from 'decimal.js';
export declare function decimalDesdeDb(valor: Prisma.Decimal): Decimal;
