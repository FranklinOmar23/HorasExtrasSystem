import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from '../../domain/errors/domain.error';

const CODIGO_A_STATUS: Record<string, HttpStatus> = {
  CREDENCIALES_INVALIDAS: HttpStatus.UNAUTHORIZED,
  PERIODO_CERRADO: HttpStatus.CONFLICT,
  EMPLEADO_CODIGO_DUPLICADO: HttpStatus.CONFLICT,
  EMPLEADO_CEDULA_DUPLICADA: HttpStatus.CONFLICT,
  EMPLEADO_NO_ENCONTRADO: HttpStatus.NOT_FOUND,
};

@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      CODIGO_A_STATUS[exception.code] ?? HttpStatus.UNPROCESSABLE_ENTITY;

    response.status(status).json({
      statusCode: status,
      error: exception.code,
      message: exception.message,
    });
  }
}
