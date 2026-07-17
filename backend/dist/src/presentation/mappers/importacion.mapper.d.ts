import { Importacion } from '../../domain/entities/importacion.entity';
import { FilaImportacionValidada } from '../../application/services/validar-filas-importacion.service';
import { FilaImportacionRespuestaDto } from '../dtos/importaciones/fila-importacion-respuesta.dto';
import { ImportacionRespuestaDto } from '../dtos/importaciones/importacion-respuesta.dto';
export declare function aImportacionRespuestaDto(importacion: Importacion): ImportacionRespuestaDto;
export declare function aFilaImportacionRespuestaDto(fila: FilaImportacionValidada): FilaImportacionRespuestaDto;
