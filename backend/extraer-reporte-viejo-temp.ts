import * as XLSX from 'xlsx';

const RUTA = 'C:\\Users\\Tecnologia\\Downloads\\FORMULARIO HORAS EXTRAS HARTEMANIA REPORTE DEL 1 AL 15 DE JUNIO 2026-.xlsx';

const EPOCA_EXCEL_MS = Date.UTC(1899, 11, 30);
const MS_POR_DIA = 24 * 60 * 60 * 1000;
function fechaISO(serial: number): string {
  return new Date(EPOCA_EXCEL_MS + Math.floor(serial) * MS_POR_DIA).toISOString().slice(0, 10);
}

const wb = XLSX.readFile(RUTA);
const hoja = wb.Sheets['Reporte Diario viejo'];
const filas: unknown[][] = XLSX.utils.sheet_to_json(hoja, { header: 1, raw: true, defval: null });

let inicioDatos = -1;
for (let i = 0; i < filas.length; i++) {
  const f = filas[i];
  if (typeof f[0] === 'number' && f[0] > 40000 && typeof f[2] === 'string') {
    inicioDatos = i;
    break;
  }
}
console.log('primera fila de datos en indice', inicioDatos, JSON.stringify(filas[inicioDatos]));

const seriales = new Set<number>();
let filasValidas = 0;
let filasVacias = 0;
for (let i = inicioDatos; i < filas.length; i++) {
  const f = filas[i];
  if (typeof f[0] !== 'number') continue;
  seriales.add(Math.floor(f[0] as number));
  const entrada = f[3];
  const salida = f[4];
  if ((entrada === 0 || entrada === null) && (salida === 0 || salida === null)) {
    filasVacias++;
  } else {
    filasValidas++;
  }
}
const fechasOrdenadas = [...seriales].sort((a, b) => a - b);
console.log('rango de fechas:', fechaISO(fechasOrdenadas[0]), 'a', fechaISO(fechasOrdenadas[fechasOrdenadas.length - 1]));
console.log('fechas distintas:', fechasOrdenadas.map(fechaISO));
console.log('filas con horas:', filasValidas, '| filas vacias:', filasVacias);
