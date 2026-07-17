import { Module } from '@nestjs/common';
import { EMPLEADO_REPOSITORY } from '../../application/ports/empleado.repository.port';
import type { EmpleadoRepository } from '../../application/ports/empleado.repository.port';
import { EXCEL_PARSER } from '../../application/ports/excel-parser.port';
import type { ExcelParserPort } from '../../application/ports/excel-parser.port';
import { IMPORTACION_REPOSITORY } from '../../application/ports/importacion.repository.port';
import type { ImportacionRepository } from '../../application/ports/importacion.repository.port';
import { PERIODO_REPOSITORY } from '../../application/ports/periodo.repository.port';
import type { PeriodoRepository } from '../../application/ports/periodo.repository.port';
import { REGISTRO_HORAS_REPOSITORY } from '../../application/ports/registro-horas.repository.port';
import type { RegistroHorasRepository } from '../../application/ports/registro-horas.repository.port';
import { SALARIO_REPOSITORY } from '../../application/ports/salario.repository.port';
import type { SalarioRepository } from '../../application/ports/salario.repository.port';
import { CalcularDesgloseService } from '../../application/services/calcular-desglose.service';
import { ValidarFilasImportacionService } from '../../application/services/validar-filas-importacion.service';
import { ConfirmarImportacionUseCase } from '../../application/use-cases/importaciones/confirmar-importacion.use-case';
import { ListarImportacionesUseCase } from '../../application/use-cases/importaciones/listar-importaciones.use-case';
import { ParsearImportacionUseCase } from '../../application/use-cases/importaciones/parsear-importacion.use-case';
import { XlsxParserAdapter } from '../../infrastructure/excel/xlsx-parser.adapter';
import { ImportacionPrismaRepository } from '../../infrastructure/repositories/importacion.prisma.repository';
import { ImportacionesController } from '../controllers/importaciones.controller';
import { EmpleadosModule } from './empleados.module';
import { PeriodosModule } from './periodos.module';
import { RegistrosModule } from './registros.module';

@Module({
  imports: [EmpleadosModule, PeriodosModule, RegistrosModule],
  controllers: [ImportacionesController],
  providers: [
    { provide: IMPORTACION_REPOSITORY, useClass: ImportacionPrismaRepository },
    { provide: EXCEL_PARSER, useClass: XlsxParserAdapter },
    {
      provide: ValidarFilasImportacionService,
      useFactory: (
        empleadoRepo: EmpleadoRepository,
        salarioRepo: SalarioRepository,
        registroRepo: RegistroHorasRepository,
      ) =>
        new ValidarFilasImportacionService(
          empleadoRepo,
          salarioRepo,
          registroRepo,
        ),
      inject: [
        EMPLEADO_REPOSITORY,
        SALARIO_REPOSITORY,
        REGISTRO_HORAS_REPOSITORY,
      ],
    },
    {
      provide: ParsearImportacionUseCase,
      useFactory: (
        periodoRepo: PeriodoRepository,
        excelParser: ExcelParserPort,
        validarFilas: ValidarFilasImportacionService,
        importacionRepo: ImportacionRepository,
      ) =>
        new ParsearImportacionUseCase(
          periodoRepo,
          excelParser,
          validarFilas,
          importacionRepo,
        ),
      inject: [
        PERIODO_REPOSITORY,
        EXCEL_PARSER,
        ValidarFilasImportacionService,
        IMPORTACION_REPOSITORY,
      ],
    },
    {
      provide: ConfirmarImportacionUseCase,
      useFactory: (
        importacionRepo: ImportacionRepository,
        periodoRepo: PeriodoRepository,
        excelParser: ExcelParserPort,
        validarFilas: ValidarFilasImportacionService,
        registroRepo: RegistroHorasRepository,
        calcularDesglose: CalcularDesgloseService,
      ) =>
        new ConfirmarImportacionUseCase(
          importacionRepo,
          periodoRepo,
          excelParser,
          validarFilas,
          registroRepo,
          calcularDesglose,
        ),
      inject: [
        IMPORTACION_REPOSITORY,
        PERIODO_REPOSITORY,
        EXCEL_PARSER,
        ValidarFilasImportacionService,
        REGISTRO_HORAS_REPOSITORY,
        CalcularDesgloseService,
      ],
    },
    {
      provide: ListarImportacionesUseCase,
      useFactory: (
        periodoRepo: PeriodoRepository,
        importacionRepo: ImportacionRepository,
      ) => new ListarImportacionesUseCase(periodoRepo, importacionRepo),
      inject: [PERIODO_REPOSITORY, IMPORTACION_REPOSITORY],
    },
  ],
})
export class ImportacionesModule {}
