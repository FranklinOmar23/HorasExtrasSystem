import { FileInterceptor } from '@nestjs/platform-express';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConfirmarImportacionUseCase } from '../../application/use-cases/importaciones/confirmar-importacion.use-case';
import { ListarImportacionesUseCase } from '../../application/use-cases/importaciones/listar-importaciones.use-case';
import { ParsearImportacionUseCase } from '../../application/use-cases/importaciones/parsear-importacion.use-case';
import { Usuario } from '../../domain/entities/usuario.entity';
import { ImportacionFormatoInvalidoError } from '../../domain/errors/importacion-formato-invalido.error';
import { UsuarioActual } from '../decorators/usuario-actual.decorator';
import { ConfirmarImportacionDto } from '../dtos/importaciones/confirmar-importacion.dto';
import { ImportacionRespuestaDto } from '../dtos/importaciones/importacion-respuesta.dto';
import { ParsearImportacionRespuestaDto } from '../dtos/importaciones/parsear-importacion-respuesta.dto';
import {
  aFilaImportacionRespuestaDto,
  aImportacionRespuestaDto,
} from '../mappers/importacion.mapper';

const LIMITE_TAMANO_ARCHIVO_BYTES = 10 * 1024 * 1024;

@ApiTags('importaciones')
@ApiBearerAuth()
@Controller()
export class ImportacionesController {
  constructor(
    @Inject(ParsearImportacionUseCase)
    private readonly parsearImportacion: ParsearImportacionUseCase,
    @Inject(ConfirmarImportacionUseCase)
    private readonly confirmarImportacion: ConfirmarImportacionUseCase,
    @Inject(ListarImportacionesUseCase)
    private readonly listarImportaciones: ListarImportacionesUseCase,
  ) {}

  @Post('periodos/:periodoId/importaciones')
  @UseInterceptors(
    FileInterceptor('archivo', {
      limits: { fileSize: LIMITE_TAMANO_ARCHIVO_BYTES },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['archivo'],
      properties: { archivo: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({
    summary:
      'Sube un .xlsx, lo valida y devuelve el desglose fila por fila SIN persistir registros',
  })
  @ApiResponse({ status: 201, type: ParsearImportacionRespuestaDto })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  @ApiResponse({ status: 409, description: 'El periodo está cerrado' })
  @ApiResponse({
    status: 422,
    description: 'El archivo no tiene un formato reconocible',
  })
  async parsear(
    @Param('periodoId') periodoId: string,
    @UploadedFile() archivo: Express.Multer.File | undefined,
    @UsuarioActual() usuario: Usuario,
  ): Promise<ParsearImportacionRespuestaDto> {
    if (!archivo) {
      throw new ImportacionFormatoInvalidoError(
        'no se recibió ningún archivo (campo "archivo").',
      );
    }

    const { importacion, filas } = await this.parsearImportacion.ejecutar({
      periodoId,
      usuarioId: usuario.id,
      nombreArchivo: archivo.originalname,
      contenido: archivo.buffer,
    });

    return {
      importacionId: importacion.id,
      filas: filas.map(aFilaImportacionRespuestaDto),
      resumen: {
        ok: importacion.filasOk,
        advertencias: importacion.filasAdvertencia,
        errores: importacion.filasError,
      },
    };
  }

  @Post('importaciones/:id/confirmar')
  @ApiOperation({
    summary:
      'Confirma una importación: persiste las filas válidas como registros de horas y las calcula',
  })
  @ApiResponse({ status: 201, type: ImportacionRespuestaDto })
  @ApiResponse({
    status: 404,
    description: 'Importación o periodo no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'La importación ya fue confirmada o el periodo está cerrado',
  })
  async confirmar(
    @Param('id') id: string,
    @Body() dto: ConfirmarImportacionDto,
  ): Promise<ImportacionRespuestaDto> {
    const importacion = await this.confirmarImportacion.ejecutar({
      importacionId: id,
      incluirAdvertencias: dto.incluirAdvertencias,
    });
    return aImportacionRespuestaDto(importacion);
  }

  @Get('periodos/:periodoId/importaciones')
  @ApiOperation({ summary: 'Historial de importaciones de un periodo' })
  @ApiResponse({ status: 200, type: [ImportacionRespuestaDto] })
  @ApiResponse({ status: 404, description: 'Periodo no encontrado' })
  async listar(
    @Param('periodoId') periodoId: string,
  ): Promise<ImportacionRespuestaDto[]> {
    const importaciones = await this.listarImportaciones.ejecutar(periodoId);
    return importaciones.map(aImportacionRespuestaDto);
  }
}
