import { Importacion } from '../../domain/entities/importacion.entity';
import { FilaImportacionValidada } from '../../application/services/validar-filas-importacion.service';
import { FilaImportacionRespuestaDto } from '../dtos/importaciones/fila-importacion-respuesta.dto';
import { ImportacionRespuestaDto } from '../dtos/importaciones/importacion-respuesta.dto';

function aFechaISO(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

export function aImportacionRespuestaDto(
  importacion: Importacion,
): ImportacionRespuestaDto {
  return {
    id: importacion.id,
    periodoId: importacion.periodoId,
    usuarioId: importacion.usuarioId,
    archivo: importacion.archivo,
    filasOk: importacion.filasOk,
    filasAdvertencia: importacion.filasAdvertencia,
    filasError: importacion.filasError,
    importadoEn: importacion.importadoEn.toISOString(),
    confirmadaEn: importacion.confirmadaEn
      ? importacion.confirmadaEn.toISOString()
      : null,
  };
}

export function aFilaImportacionRespuestaDto(
  fila: FilaImportacionValidada,
): FilaImportacionRespuestaDto {
  return {
    linea: fila.linea,
    fecha: fila.fecha ? aFechaISO(fila.fecha) : null,
    codigo: fila.codigo,
    nombre: fila.nombre,
    entrada: fila.horaEntrada,
    salida: fila.horaSalida,
    estado: fila.estado,
    mensajes: fila.mensajes,
  };
}
