export abstract class DomainError extends Error {
  abstract readonly code: string;
  /** Código de estado HTTP equivalente (sin depender de @nestjs/common desde el dominio). */
  abstract readonly httpStatus: number;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
