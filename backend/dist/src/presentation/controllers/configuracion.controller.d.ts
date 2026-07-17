import { ActualizarConfiguracionUseCase } from '../../application/use-cases/configuracion/actualizar-configuracion.use-case';
import { ObtenerConfiguracionUseCase } from '../../application/use-cases/configuracion/obtener-configuracion.use-case';
import { ActualizarConfiguracionDto } from '../dtos/configuracion/actualizar-configuracion.dto';
export declare class ConfiguracionController {
    private readonly obtenerConfiguracion;
    private readonly actualizarConfiguracion;
    constructor(obtenerConfiguracion: ObtenerConfiguracionUseCase, actualizarConfiguracion: ActualizarConfiguracionUseCase);
    ejecutarObtener(): Promise<Record<string, string>>;
    ejecutarActualizar(dto: ActualizarConfiguracionDto): Promise<Record<string, string>>;
}
