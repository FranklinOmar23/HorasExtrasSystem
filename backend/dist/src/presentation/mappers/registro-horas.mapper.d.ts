import { Calculo } from '../../domain/entities/calculo.entity';
import { RegistroConCalculos } from '../../application/ports/registro-horas.repository.port';
import { FilaCalculo } from '../../domain/services/motor-calculo';
import { CalculoRespuestaDto } from '../dtos/registros/calculo-respuesta.dto';
import { RegistroRespuestaDto } from '../dtos/registros/registro-respuesta.dto';
export declare function aCalculoRespuestaDto(calculo: Calculo): CalculoRespuestaDto;
export declare function aFilaCalculoRespuestaDto(fila: FilaCalculo): CalculoRespuestaDto;
export declare function aRegistroRespuestaDto(registroConCalculos: RegistroConCalculos): RegistroRespuestaDto;
