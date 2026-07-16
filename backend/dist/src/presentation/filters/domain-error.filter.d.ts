import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { DomainError } from '../../domain/errors/domain.error';
export declare class DomainErrorFilter implements ExceptionFilter {
    catch(exception: DomainError, host: ArgumentsHost): void;
}
