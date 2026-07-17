import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { RolUsuario } from '../../../domain/enums/rol-usuario.enum';

export class ActualizarUsuarioDto {
  @ApiPropertyOptional({ example: 'Ana Familia' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ enum: RolUsuario })
  @IsOptional()
  @IsEnum(RolUsuario, { message: 'El rol debe ser ADMIN o RRHH.' })
  rol?: RolUsuario;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ description: 'Si se envía, reemplaza la contraseña.' })
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password?: string;
}
