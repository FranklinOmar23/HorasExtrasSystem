import { useState } from 'react';
import { mensajeError } from '../api/client';

interface ArchivoDescargado {
  blob: Blob;
  nombreArchivo: string;
}

/** Maneja el ciclo completo de descargar-un-archivo-y-guardarlo: progreso real
 *  (vía onUploadProgress/onDownloadProgress de axios, pasado a `fn`), un
 *  destello de éxito breve al terminar, y el error si falla. Se usa en los
 *  botones "Exportar Excel" (reporte global y por empleado). */
export function useDescargaArchivo() {
  const [descargando, setDescargando] = useState(false);
  const [progreso, setProgreso] = useState<number | null>(null);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ejecutar(
    fn: (onProgreso: (porcentaje: number | null) => void) => Promise<ArchivoDescargado>,
    mensajeErrorPorDefecto = 'No se pudo descargar el archivo.',
  ) {
    setDescargando(true);
    setProgreso(null);
    setError(null);
    setExito(false);
    try {
      const { blob, nombreArchivo } = await fn(setProgreso);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo;
      a.click();
      window.URL.revokeObjectURL(url);
      setExito(true);
      setTimeout(() => setExito(false), 1600);
    } catch (err) {
      setError(mensajeError(err, mensajeErrorPorDefecto));
    } finally {
      setDescargando(false);
    }
  }

  return { descargando, progreso, exito, error, ejecutar };
}
