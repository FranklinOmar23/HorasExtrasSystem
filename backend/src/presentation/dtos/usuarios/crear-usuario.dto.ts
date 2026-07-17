import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';

export class CrearUsuarioDto {
  @ApiProperty({ example: 'Ana Familia' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del usuario es obligatorio.' })
  nombre!: string;

  @ApiProperty({ example: 'ana@hartemania.com' })
  @IsEmail({}, { message: 'El email no tiene un formato válido.' })
  email!: string;

  @ApiProperty({ example: 'contraseña123' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password!: string;

  @ApiProperty({ enum: RolUsuario, example: RolUsuario.RRHH })
  @IsEnum(RolUsuario, { message: 'El rol debe ser ADMIN o RRHH.' })
  rol!: RolUsuario;
}
