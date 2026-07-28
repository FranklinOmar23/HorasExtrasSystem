export type RolUsuario = 'ADMIN' | 'RRHH';
export type EstadoPeriodo = 'ABIERTO' | 'CERRADO';
export type OrigenRegistro = 'EXCEL' | 'MANUAL';
export type TipoHoraExtraCodigo = 'HE_35' | 'HE_100' | 'NOCTURNA_15' | 'FERIADO';
export type EstadoFilaImportacion = 'OK' | 'ADVERTENCIA' | 'ERROR';
export type AccionAuditoria = 'CREAR' | 'ACTUALIZAR' | 'ELIMINAR' | 'CERRAR' | 'RESTAURAR' | 'CONFIRMAR';
export type EntidadAuditoria =
  | 'PERIODO'
  | 'EMPLEADO'
  | 'SALARIO'
  | 'CONFIGURACION'
  | 'FERIADO'
  | 'TIPO_HORA_EXTRA'
  | 'REGISTRO_HORAS'
  | 'IMPORTACION'
  | 'USUARIO'
  | 'TURNO'
  | 'ASIGNACION_TURNO';

export interface UsuarioActual {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  activo: boolean;
}

export interface LoginRespuesta {
  accessToken: string;
  usuario: UsuarioActual;
}

export interface Empleado {
  id: string;
  codigo: number;
  nombre: string;
  cedula: string | null;
  posicion: string;
  activo: boolean;
}

export interface Salario {
  id: string;
  empleadoId: string;
  montoMensual: string;
  vigenteDesde: string;
  vigenteHasta: string | null;
}

export interface TipoHoraExtra {
  id: string;
  codigo: string;
  nombre: string;
  porcentaje: string;
  activo: boolean;
}

export type Configuracion = Record<string, string>;

export interface Feriado {
  id: string;
  fecha: string;
  descripcion: string;
}

export interface Periodo {
  id: string;
  fechaInicio: string;
  fechaFin: string;
  estado: EstadoPeriodo;
  cerradoEn: string | null;
  cerradoPorId: string | null;
  eliminadoEn: string | null;
  eliminadoPorId: string | null;
}

export interface Turno {
  id: string;
  codigo: string;
  nombre: string;
  horaInicio: string;
  horaFin: string;
  horasJornada: string;
  cruzaMedianoche: boolean;
  descuentaAlmuerzo: boolean;
  activo: boolean;
}

export interface AsignacionTurno {
  id: string;
  empleadoId: string;
  turnoId: string;
  fechaDesde: string;
  fechaHasta: string | null;
  comentario: string | null;
  creadoPorId: string;
  createdAt: string;
}

export interface Auditoria {
  id: string;
  usuarioId: string;
  usuarioNombre: string;
  accion: AccionAuditoria;
  entidad: EntidadAuditoria;
  entidadId: string | null;
  descripcion: string;
  creadoEn: string;
}

export interface Calculo {
  tipoHoraCodigo: TipoHoraExtraCodigo;
  cantidadHoras: string;
  porcentajeAplicado: string;
  salarioHoraUsado: string;
  monto: string;
}

export interface RegistroHoras {
  id: string;
  periodoId: string;
  empleadoId: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  origen: OrigenRegistro;
  comentario: string | null;
  calculos: Calculo[];
}

export interface Importacion {
  id: string;
  periodoId: string;
  usuarioId: string;
  archivo: string;
  filasOk: number;
  filasAdvertencia: number;
  filasError: number;
  importadoEn: string;
  confirmadaEn: string | null;
}

export interface FilaImportacion {
  linea: number;
  fecha: string | null;
  codigo: number | null;
  nombre: string | null;
  entrada: string | null;
  salida: string | null;
  estado: EstadoFilaImportacion;
  mensajes: string[];
}

export interface ParsearImportacionRespuesta {
  importacionId: string;
  filas: FilaImportacion[];
  resumen: { ok: number; advertencias: number; errores: number };
}

export interface DesgloseTipoHora {
  he35: string;
  he100: string;
  nocturna: string;
  feriado: string;
}

export interface EmpleadoReporte {
  id: string;
  codigo: number;
  nombre: string;
}

export interface FilaReportePeriodo {
  empleado: EmpleadoReporte;
  salarioHora: string;
  horas: DesgloseTipoHora;
  montos: DesgloseTipoHora;
  total: string;
}

export interface ReportePeriodo {
  periodo: Periodo;
  filas: FilaReportePeriodo[];
  granTotal: string;
}

export interface DiaReporteEmpleado {
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  turnoCodigo: string;
  turnoNombre: string;
  calculos: Calculo[];
  total: string;
}

export interface ReporteEmpleado {
  periodo: Periodo;
  empleado: EmpleadoReporte;
  salarioHora: string;
  dias: DiaReporteEmpleado[];
  horas: DesgloseTipoHora;
  montos: DesgloseTipoHora;
  total: string;
}

export interface HistoricoPeriodo {
  periodo: Periodo;
  granTotal: string;
}

export interface ApiErrorBody {
  statusCode: number;
  error: string;
  message: string;
}
