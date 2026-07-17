import { SalarioInicialDto } from './salario-inicial.dto';
export declare class CrearEmpleadoDto {
    codigo: number;
    nombre: string;
    cedula?: string;
    posicion: string;
    salarioInicial: SalarioInicialDto;
}
