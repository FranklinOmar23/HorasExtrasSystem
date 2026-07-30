# Graph Report - .  (2026-07-30)

## Corpus Check
- 346 files · ~79,662 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2496 nodes · 6350 edges · 151 communities (118 shown, 33 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 50 edges (avg confidence: 0.69)
- Token cost: 240,724 input · 0 output

## Community Hubs (Navigation)
- Periodo Repository Fake (Tests)
- Auth Password & Token Ports
- Usuario Repository Port
- App Module Wiring
- Salario Repository Port
- Auditoria Repository Port
- Empleado Repository Fake (Tests)
- Excel Parser & Duplicate Detection
- RegistroHoras Repository Fake (Tests)
- Crear Periodo & Domain Errors
- Turno Repository Fake (Tests)
- Periodo Repository Port
- Reportes & Periodo DTOs
- Frontend Dependencies
- RegistroHoras Port & Recalculo Tests
- Registros Controller
- Frontend Auditoria & Auth API
- Empleado Port & Crear Asignacion Turno
- AsignacionTurno Repository Fake (Tests)
- Auditoria Controller
- Nest Controller Decorators (misc)
- Frontend Configuracion/Feriados API
- Actualizar Asignacion Turno & Recalculo
- Empleado & Salario Use Cases
- Calcular Desglose Service
- Periodo Use Cases (Cerrar/Eliminar)
- Periodos Controller
- AsignacionesTurno Controller
- Frontend Registros API
- Backend Dev Dependencies
- Empleados Controller
- Frontend Empleados API
- Frontend Auditoria/Historico UI Components
- Frontend Importaciones API & Confetti UI
- Frontend TS Config (app)
- Project Conventions & Docs (CLAUDE.md)
- Feriado Repository Fake (Tests)
- Periodo Papelera (Eliminar/Restaurar)
- Reportes Use Cases & Controller
- Nest Controller Decorators (misc)
- Backend TS Config
- Paginacion Util & Listar Empleados
- Empleados Paginados/Filtro
- RegistroHoras Repository Port
- Turno Port & Use Cases
- Reporte Excel Builder
- Feriados Controller
- Feriado Port & Crear Use Case
- Frontend Periodos API
- Prisma Module & Seed
- Importacion Repository Port
- TipoHoraExtra Repository Port
- Frontend TS Config (node)
- Importaciones Controller
- Backend Runtime Dependencies
- Empleado Repository Port
- Reglas de Negocio: Periodos & Importacion (docs/02)
- Backend npm Scripts
- TiposHoraExtra Controller
- Reglas de Negocio & Modelo de Datos (docs/02-03)
- Frontend Reporte Export UI
- Health Controller
- Frontend App Shell & Layout
- AsignacionTurno Repository Port
- Importacion Repository (Prisma)
- Turno Repository Port & Use Case
- Hora Util & Motor Calculo
- XLSX Parser Adapter
- CrearEmpleado DTO
- Motor Calculo Tests
- Frontend Usuarios API & PageHeader
- Jest Config
- Crear Turno Use Case
- Configuracion Controller
- RegistroHoras Repository (Prisma)
- Frontend AsignacionesTurno API
- TipoHoraExtra Port & Entity
- Reporte Periodo Service & Historico
- Resolver Turno del Empleado Tests
- ListarEmpleados Query DTO
- AsignacionTurno Repository (Prisma)
- Periodo Repository (Prisma)
- Turno Repository (Prisma)
- Crear Empleado Use Case & Errors
- TipoHoraExtra Use Cases
- Feriado Repository (Prisma)
- CrearRegistro DTO
- Frontend Oxlint Config
- Feriado Eliminar/Listar Use Cases
- Usuario Repository (Prisma)
- CrearAsignacionTurno DTO
- ListarFeriados Query DTO
- Importacion Respuesta DTO & Mapper
- Historico Query DTO
- CrearTurno DTO
- Backend TS Build Config
- Plan de Trabajo & Formula Salario/Hora (docs/06)
- Extraer Reporte Viejo (script temp)
- Backend package.json Metadata
- TipoHoraExtra Repository (Prisma)
- ActualizarAsignacionTurno DTO
- Parsear Importacion Respuesta DTO
- ActualizarRegistro DTO
- ActualizarTipoHoraExtra DTO
- ActualizarTurno DTO
- Nest CLI Config
- XLSX Parser Tests
- Recalcular Registros por Turno (misc)
- CrearFeriado DTO
- ConfirmarImportacion DTO
- PreviewCalculo DTO
- Frontend Scaffold (Vite/React/TS)
- ActualizarConfiguracion DTO
- Arquitectura Clean Architecture (CLAUDE.md)
- Modelo de Datos: Auditoria/Empleado & Vistas SQL
- RolesGuard
- Social Icons Sprite
- AsignacionTurno Fake (partial)
- Auditoria Module
- Frontend TS Config Root
- bcrypt Dependency
- class-validator Dependency
- exceljs Dependency
- @nestjs/core Dependency
- @nestjs/jwt Dependency
- @nestjs/swagger Dependency
- passport Dependency
- @prisma/adapter-mssql Dependency
- rxjs Dependency
- eslint-plugin-prettier Dependency
- globals Dependency
- jest Dependency
- @nestjs/schematics Dependency
- @nestjs/testing Dependency
- ts-jest Dependency
- ts-node Dependency
- tsconfig-paths Dependency
- @types/bcrypt Dependency
- @types/express Dependency
- @types/jest Dependency
- @types/multer Dependency
- @types/node Dependency
- @types/passport-jwt Dependency
- TypeScript Dependency
- typescript-eslint Dependency
- Docs & GitHub Icons
- Favicon Icon (App Logo)
- Vite Logo (Boilerplate Asset)

## God Nodes (most connected - your core abstractions)
1. `Periodo` - 131 edges
2. `Usuario` - 79 edges
3. `PeriodoRepository` - 78 edges
4. `RegistroConCalculos` - 73 edges
5. `Empleado` - 73 edges
6. `Turno` - 64 edges
7. `DomainError` - 62 edges
8. `EmpleadoRepository` - 61 edges
9. `AsignacionTurno` - 53 edges
10. `RegistroHorasRepository` - 45 edges

## Surprising Connections (you probably didn't know these)
- `Modelo Turno (turnos)` --references--> `ResolverTurnoDelEmpleadoUseCase`  [EXTRACTED]
  docs/03-modelo-datos.md → backend/src/application/use-cases/asignaciones-turno/resolver-turno-del-empleado.use-case.ts
- `Cerrar periodo (inmutable de forma permanente)` --references--> `CerrarPeriodoUseCase`  [EXTRACTED]
  docs/02-reglas-de-negocio.md → backend/src/application/use-cases/periodos/cerrar-periodo.use-case.ts
- `PeriodoCerradoError` --conceptually_related_to--> `Periodo quincenal (ABIERTO/CERRADO)`  [EXTRACTED]
  backend/src/domain/errors/periodo-cerrado.error.ts → docs/02-reglas-de-negocio.md
- `Anti-duplicado: no pagar la misma jornada dos veces en periodos distintos` --references--> `RegistroDuplicadoEnOtroPeriodoError`  [EXTRACTED]
  docs/02-reglas-de-negocio.md → backend/src/domain/errors/registro-duplicado-en-otro-periodo.error.ts
- `MotorCalculo` --conceptually_related_to--> `porcentajeAplicado y salarioHoraUsado se congelan por cálculo`  [EXTRACTED]
  backend/src/domain/services/motor-calculo.ts → CLAUDE.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Ciclo de vida y validación de Periodo** — backend_src_domain_errors_periodo_cerrado_error_periodocerradoerror, backend_src_domain_errors_periodo_no_encontrado_error_periodonoencontradoerror, backend_src_domain_errors_periodo_fechas_duplicadas_error_periodofechasduplicadaserror, backend_src_domain_errors_periodo_rango_fechas_invalido_error_periodorangofechasinvalidoerror, concept_modelo_periodo [INFERRED 0.85]
- **Flujo de asignación de turno** — backend_src_application_use_cases_asignaciones_turno_resolver_turno_del_empleado_use_case_resolverturnodelempleadousecase, backend_src_application_use_cases_asignaciones_turno_crear_asignacion_turno_use_case_crearasignacionturnousecase, backend_src_application_use_cases_asignaciones_turno_actualizar_asignacion_turno_use_case_actualizarasignacionturnousecase, backend_src_domain_errors_asignacion_solapada_error_asignacionsolapadaerror, concept_asignacion_turno [EXTRACTED 1.00]
- **Flujo de importación de Excel (parsear → confirmar)** — backend_src_application_use_cases_importaciones_parsear_importacion_use_case_parsearimportacionusecase, backend_src_application_use_cases_importaciones_confirmar_importacion_use_case_confirmarimportacionusecase, backend_src_application_services_validar_filas_importacion_service_validarfilasimportacionservice, backend_src_infrastructure_excel_xlsx_parser_adapter_xlsxparseradapter, concept_modelo_importacion [EXTRACTED 1.00]
- **Social / external-link icon sprite group** — frontend_public_icons_bluesky, frontend_public_icons_discord, frontend_public_icons_github, frontend_public_icons_x [INFERRED 0.85]

## Communities (151 total, 33 thin omitted)

### Community 0 - "Periodo Repository Fake (Tests)"
Cohesion: 0.04
Nodes (10): CrearPeriodoDatos, PeriodoRepositoryFake, PeriodoRepositoryFake, PeriodoRepositoryFake, PeriodoRepositoryFake, PeriodoRepositoryFake, PeriodoRepositoryFake, PeriodoRepositoryFake (+2 more)

### Community 1 - "Auth Password & Token Ports"
Cohesion: 0.05
Nodes (36): PASSWORD_HASHER, PasswordHasher, TOKEN_SERVICE, TokenPayload, TokenService, AutenticarUsuarioComando, AutenticarUsuarioResultado, AutenticarUsuarioUseCase (+28 more)

### Community 2 - "Usuario Repository Port"
Cohesion: 0.09
Nodes (21): ActualizarUsuarioDatos, CrearUsuarioDatos, USUARIO_REPOSITORY, UsuarioRepository, ActualizarUsuarioComando, ActualizarUsuarioUseCase, USUARIO, UsuarioRepositoryFake (+13 more)

### Community 3 - "App Module Wiring"
Cohesion: 0.07
Nodes (34): AppModule, Module, ASIGNACION_TURNO_REPOSITORY, CONFIGURACION_REPOSITORY, ConfiguracionRepository, EMPLEADO_REPOSITORY, FERIADO_REPOSITORY, PERIODO_REPOSITORY (+26 more)

### Community 4 - "Salario Repository Port"
Cohesion: 0.07
Nodes (18): CrearSalarioDatos, SalarioRepository, SalarioRepositoryFake, EMPLEADO_ACTIVO, EMPLEADO_INACTIVO, PERIODO, PERIODO_ANTERIOR, SALARIO_VIGENTE (+10 more)

### Community 5 - "Auditoria Repository Port"
Cohesion: 0.13
Nodes (22): AUDITORIA_REPOSITORY, AuditoriaConUsuario, AuditoriaPaginada, AuditoriaRepository, FiltroAuditoria, RegistrarAuditoriaDatos, FiltroListarAuditoria, ListarAuditoriaUseCase (+14 more)

### Community 6 - "Empleado Repository Fake (Tests)"
Cohesion: 0.07
Nodes (9): CrearEmpleadoDatos, EmpleadoRepositoryFake, EmpleadoRepositoryFake, EmpleadoRepositoryFake, EmpleadoRepositoryFake, EmpleadoRepositoryFake, EmpleadoRepositoryFake, EmpleadoRepositoryFake (+1 more)

### Community 7 - "Excel Parser & Duplicate Detection"
Cohesion: 0.08
Nodes (31): EXCEL_PARSER, ExcelParserPort, FilaExcelCruda, BuscarRegistroDuplicadoService, RegistroDuplicado, calculo(), aFechaISO(), agravar() (+23 more)

### Community 8 - "RegistroHoras Repository Fake (Tests)"
Cohesion: 0.08
Nodes (8): ActualizarRegistroDatos, RegistroConCalculos, RegistroHorasRepositoryFake, RegistroHorasRepositoryFake, RegistroHorasRepositoryFake, RegistroHorasRepositoryFake, RegistroHorasRepositoryFake, FilaCalculo

### Community 9 - "Crear Periodo & Domain Errors"
Cohesion: 0.08
Nodes (16): aFechaISO(), CredencialesInvalidasError, DomainError, ImportacionFormatoInvalidoError, ImportacionNoEncontradaError, ImportacionYaConfirmadaError, PeriodoFechasDuplicadasError, PeriodoRangoFechasInvalidoError (+8 more)

### Community 10 - "Turno Repository Fake (Tests)"
Cohesion: 0.08
Nodes (9): ActualizarTurnoDatos, TurnoRepositoryFake, TurnoRepositoryFake, ResolucionTurno, TurnoRepositoryFake, RegistroConCalculosYTurno, TurnoRepositoryFake, TurnoRepositoryFake (+1 more)

### Community 11 - "Periodo Repository Port"
Cohesion: 0.09
Nodes (13): PeriodoRepository, CerrarPeriodoUseCase, CrearPeriodoUseCase, EliminarPeriodoPermanentementeUseCase, EliminarPeriodoUseCase, ListarPeriodosEliminadosUseCase, ListarPeriodosUseCase, ObtenerPeriodoUseCase (+5 more)

### Community 12 - "Reportes & Periodo DTOs"
Cohesion: 0.12
Nodes (28): DesgloseTipoHora, PeriodoRespuestaDto, ApiProperty, ApiPropertyOptional, DesgloseTipoHoraDto, ApiProperty, DiaReporteEmpleadoDto, ApiProperty (+20 more)

### Community 13 - "Frontend Dependencies"
Cohesion: 0.05
Nodes (37): axios, dependencies, axios, react, react-dom, react-dropzone, react-router-dom, @tanstack/react-query (+29 more)

### Community 14 - "RegistroHoras Port & Recalculo Tests"
Cohesion: 0.12
Nodes (22): CrearRegistroDatos, PERIODO_ABIERTO, PERIODO_CERRADO, CONFIGURACION_FIJA, EMPLEADO_10, EMPLEADO_40, PERIODO, CrearRegistroComando (+14 more)

### Community 15 - "Registros Controller"
Cohesion: 0.11
Nodes (27): aFechaISO(), RegistrosController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body, Controller (+19 more)

### Community 16 - "Frontend Auditoria & Auth API"
Cohesion: 0.09
Nodes (31): AuditoriaPaginada, FiltroAuditoria, login(), apiClient, borrarToken(), guardarToken(), obtenerToken(), ArchivoDescargado (+23 more)

### Community 17 - "Empleado Port & Crear Asignacion Turno"
Cohesion: 0.12
Nodes (12): ActualizarEmpleadoDatos, CrearAsignacionTurnoUseCase, EMPLEADO, RegistroHorasRepositoryVacioFake, TURNO_NOCTURNO, PreviewCalculoComando, ResultadoPreviewCalculo, EMPLEADO (+4 more)

### Community 18 - "AsignacionTurno Repository Fake (Tests)"
Cohesion: 0.10
Nodes (5): CrearAsignacionTurnoDatos, AsignacionTurnoRepositoryFake, AsignacionTurnoRepositoryFake, AsignacionTurnoRepositoryFake, AsignacionTurno

### Community 19 - "Auditoria Controller"
Cohesion: 0.09
Nodes (26): AuditoriaController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Controller, Get, Inject (+18 more)

### Community 20 - "Nest Controller Decorators (misc)"
Cohesion: 0.08
Nodes (26): ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body, Controller, Get, Param (+18 more)

### Community 21 - "Frontend Configuracion/Feriados API"
Cohesion: 0.13
Nodes (27): actualizarConfiguracion(), actualizarTipoHoraExtra(), ActualizarTipoHoraExtraInput, crearFeriado(), CrearFeriadoInput, eliminarFeriado(), listarFeriados(), listarTiposHoraExtra() (+19 more)

### Community 22 - "Actualizar Asignacion Turno & Recalculo"
Cohesion: 0.13
Nodes (12): ActualizarAsignacionTurnoDatos, RecalcularRegistrosPorCambioDeTurnoService, ASIGNACION, RegistroHorasRepositoryVacioFake, TURNO_DIURNO, TURNO_NOCTURNO, EliminarAsignacionTurnoUseCase, ASIGNACION (+4 more)

### Community 23 - "Empleado & Salario Use Cases"
Cohesion: 0.12
Nodes (20): ActualizarEmpleadoUseCase, CrearEmpleadoUseCase, ObtenerEmpleadoUseCase, CrearSalarioUseCase, ListarSalariosUseCase, Inject, ActualizarEmpleadoDto, ApiPropertyOptional (+12 more)

### Community 24 - "Calcular Desglose Service"
Cohesion: 0.11
Nodes (15): aFechaISO(), CalcularDesgloseService, diaSiguiente(), ConfiguracionCalculoParseada, MINUTOS_POR_CLAVE_REDONDEO, parsearConfiguracionCalculo(), redondeoMinutosDesdeConfig(), CLAVE_POR_CODIGO (+7 more)

### Community 25 - "Periodo Use Cases (Cerrar/Eliminar)"
Cohesion: 0.21
Nodes (9): FilaReportePeriodo, PERIODO_ABIERTO, PERIODO_ABIERTO, ActualizarRegistroComando, ReporteEmpleadoPeriodo, PeriodoCerradoError, PeriodoEliminadoError, PeriodoNoEncontradoError (+1 more)

### Community 26 - "Periodos Controller"
Cohesion: 0.19
Nodes (14): formatRangoPeriodo(), PeriodosController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body, Controller (+6 more)

### Community 27 - "AsignacionesTurno Controller"
Cohesion: 0.14
Nodes (20): aFechaISO(), AsignacionesTurnoController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body, Controller (+12 more)

### Community 28 - "Frontend Registros API"
Cohesion: 0.13
Nodes (22): actualizarRegistro(), ActualizarRegistroInput, crearRegistro(), CrearRegistroInput, eliminarRegistro(), listarRegistros(), previewCalculo(), PreviewCalculoInput (+14 more)

### Community 29 - "Backend Dev Dependencies"
Cohesion: 0.08
Nodes (25): devDependencies, eslint, eslint-config-prettier, @eslint/eslintrc, @eslint/js, mssql, @nestjs/cli, prettier (+17 more)

### Community 30 - "Empleados Controller"
Cohesion: 0.16
Nodes (17): EmpleadosController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body, Controller, Get (+9 more)

### Community 31 - "Frontend Empleados API"
Cohesion: 0.15
Nodes (21): actualizarEmpleado(), ActualizarEmpleadoInput, crearEmpleado(), CrearEmpleadoInput, crearSalario(), CrearSalarioInput, EmpleadoConSalario, EmpleadosPaginados (+13 more)

### Community 32 - "Frontend Auditoria/Historico UI Components"
Cohesion: 0.13
Nodes (19): listarAuditoria(), obtenerHistorico(), Badge(), Tono, ANCHOS_VARIADOS, SkeletonCircle(), SkeletonLine(), SkeletonTableRows() (+11 more)

### Community 33 - "Frontend Importaciones API & Confetti UI"
Cohesion: 0.13
Nodes (19): confirmarImportacion(), subirImportacion(), COLORES, Confetti(), generarPiezas(), Pieza, EmpleadoNuevoPendiente, EmpleadosNuevosModal() (+11 more)

### Community 34 - "Frontend TS Config (app)"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 35 - "Project Conventions & Docs (CLAUDE.md)"
Cohesion: 0.10
Nodes (23): backend/README.md (NestJS starter, adaptado), CLAUDE.md — Sistema de Horas Extras Hartemanía, Código en inglés, UI y errores de negocio en español, Commits convencionales (feat/fix/refactor/test/docs), @prisma/adapter-mssql driver adapter en PrismaService, Knowledge graph del proyecto en graphify-out/, JWT Auth, mssql como devDependency solo para tipar la conexión (+15 more)

### Community 36 - "Feriado Repository Fake (Tests)"
Cohesion: 0.13
Nodes (4): FeriadoRepositoryFake, FeriadoRepositoryFake, FeriadoRepositoryFake, Feriado

### Community 37 - "Periodo Papelera (Eliminar/Restaurar)"
Cohesion: 0.16
Nodes (9): PERIODO_ACTIVO, PERIODO_EN_PAPELERA, limiteRestauracion(), PERIODO_ABIERTO, PERIODO_ELIMINADO_EXPIRADO, PERIODO_ELIMINADO_RECIENTE, EstadoPeriodo, PeriodoNoEliminadoError (+1 more)

### Community 38 - "Reportes Use Cases & Controller"
Cohesion: 0.17
Nodes (13): ObtenerReporteEmpleadoUseCase, ObtenerReportePeriodoUseCase, ReportesController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Controller (+5 more)

### Community 39 - "Nest Controller Decorators (misc)"
Cohesion: 0.15
Nodes (17): ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body, Controller, Delete, Get (+9 more)

### Community 40 - "Backend TS Config"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 41 - "Paginacion Util & Listar Empleados"
Cohesion: 0.15
Nodes (13): EmpleadoConSalario, normalizarPaginacion(), ParametrosPaginacion, totalPaginas(), FiltroListarEmpleados, ListarEmpleadosUseCase, ResultadoListarEmpleados, EmpleadoListaRespuestaDto (+5 more)

### Community 42 - "Empleados Paginados/Filtro"
Cohesion: 0.16
Nodes (6): EmpleadosPaginados, FiltroEmpleados, aConSalario(), aDominio(), EmpleadoPrismaRepository, Injectable

### Community 43 - "RegistroHoras Repository Port"
Cohesion: 0.10
Nodes (6): RegistroHorasRepository, ActualizarRegistroUseCase, CrearRegistroUseCase, EliminarRegistroUseCase, ListarRegistrosUseCase, Inject

### Community 44 - "Turno Port & Use Cases"
Cohesion: 0.19
Nodes (8): CODIGOS_POR_DEFECTO, EliminarTurnoUseCase, TURNO_DIURNO, TURNO_NOCTURNO, TurnoConAsignacionesError, TurnoNoEncontradoError, TurnoPorDefectoNoEliminableError, Catálogo de turnos (DIURNO, SABADO, NOCTURNO)

### Community 45 - "Reporte Excel Builder"
Cohesion: 0.19
Nodes (21): aFechaISO(), agregarEncabezado(), agregarFilaEncabezadoTabla(), agregarHojaCuadre(), agregarHojaDetalleEmpleado(), agregarHojaDetalleGlobal(), agregarHojaResumenEmpleado(), COLUMNAS_CUADRE (+13 more)

### Community 46 - "Feriados Controller"
Cohesion: 0.13
Nodes (17): FeriadosController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body, Controller, Delete (+9 more)

### Community 47 - "Feriado Port & Crear Use Case"
Cohesion: 0.20
Nodes (5): CrearFeriadoDatos, FeriadoRepository, CrearFeriadoUseCase, FeriadoFechaDuplicadaError, FeriadoNoEncontradoError

### Community 48 - "Frontend Periodos API"
Cohesion: 0.20
Nodes (17): crearPeriodo(), CrearPeriodoInput, eliminarPeriodo(), eliminarPeriodoPermanentemente(), listarPeriodos(), listarPeriodosEliminados(), restaurarPeriodo(), hoy() (+9 more)

### Community 49 - "Prisma Module & Seed"
Cohesion: 0.13
Nodes (7): main(), PrismaModule, Global, Module, PrismaService, Injectable, parsearSqlServerUrl()

### Community 50 - "Importacion Repository Port"
Cohesion: 0.15
Nodes (5): ImportacionRepository, ResultadoConfirmarImportacion, ImportacionRepositoryFake, ListarImportacionesUseCase, Importacion

### Community 51 - "TipoHoraExtra Repository Port"
Cohesion: 0.16
Nodes (5): TipoHoraExtraRepository, TipoHoraExtraRepositoryFake, TipoHoraExtraRepositoryFake, TipoHoraExtraRepositoryFake, TipoHoraExtra

### Community 52 - "Frontend TS Config (node)"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 53 - "Importaciones Controller"
Cohesion: 0.15
Nodes (16): ApiBody, ApiConsumes, aFechaISO(), ImportacionesController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags (+8 more)

### Community 54 - "Backend Runtime Dependencies"
Cohesion: 0.11
Nodes (19): dependencies, class-transformer, decimal.js, @nestjs/common, @nestjs/config, @nestjs/passport, @nestjs/platform-express, passport-jwt (+11 more)

### Community 56 - "Reglas de Negocio: Periodos & Importacion (docs/02)"
Cohesion: 0.12
Nodes (19): Asignación de turno (asignaciones_turno), Auditoría: bitácora de solo lectura de toda mutación relevante, Por qué NO se replica el bug de valorización horas.minutos de la hoja manual, Bug corregido 2026-07-17: horas corridas ~4h32min por cellDates y zona horaria, Cerrar periodo (inmutable de forma permanente), Eliminar permanentemente un periodo (irreversible, desde la papelera), Eliminar periodo abierto (soft-delete, restaurable 30 días), Importación de Excel: formatos Simple y Time Card (+11 more)

### Community 57 - "Backend npm Scripts"
Cohesion: 0.11
Nodes (18): scripts, build, db:deploy, db:generate, db:migrate, db:seed, db:studio, format (+10 more)

### Community 58 - "TiposHoraExtra Controller"
Cohesion: 0.15
Nodes (14): TiposHoraExtraController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body, Controller, Get (+6 more)

### Community 59 - "Reglas de Negocio & Modelo de Datos (docs/02-03)"
Cohesion: 0.12
Nodes (18): Anti-duplicado: no pagar la misma jornada dos veces en periodos distintos, porcentajeAplicado y salarioHoraUsado se congelan por cálculo, Enums de dominio modelados como String (SQL Server no soporta enums nativos), Importación en dos pasos: parsear (preview) y confirmar (persiste), Índices únicos filtrados aplicados manualmente (Prisma no los expresa), Modelo Calculo (calculos, onDelete Cascade), Modelo Configuracion (clave-valor), Modelo Feriado (feriados) (+10 more)

### Community 60 - "Frontend Reporte Export UI"
Cohesion: 0.22
Nodes (14): mensajeError(), cerrarPeriodo(), descargarReporteEmpleadoExcel(), obtenerReporteEmpleado(), obtenerReportePeriodo(), BotonExportarExcel(), Spinner(), ArchivoDescargado (+6 more)

### Community 61 - "Health Controller"
Cohesion: 0.14
Nodes (10): HealthController, ApiOperation, ApiTags, Controller, Get, Public(), JwtAuthGuard, Injectable (+2 more)

### Community 62 - "Frontend App Shell & Layout"
Cohesion: 0.20
Nodes (11): App(), queryClient, useAuth(), ProtectedLayout(), iconProps, iniciales(), navItems, Sidebar() (+3 more)

### Community 63 - "AsignacionTurno Repository Port"
Cohesion: 0.13
Nodes (4): AsignacionTurnoRepository, ActualizarAsignacionTurnoUseCase, ListarAsignacionesPorEmpleadoUseCase, Inject

### Community 64 - "Importacion Repository (Prisma)"
Cohesion: 0.18
Nodes (7): CrearImportacionDatos, IMPORTACION_REPOSITORY, aDominio(), ImportacionPrismaRepository, ImportacionSinContenido, SELECT_SIN_CONTENIDO, Injectable

### Community 65 - "Turno Repository Port & Use Case"
Cohesion: 0.13
Nodes (4): TurnoRepository, ActualizarTurnoUseCase, ListarTurnosUseCase, Inject

### Community 66 - "Hora Util & Motor Calculo"
Cohesion: 0.25
Nodes (6): entradaSalidaAjustadas(), parsearHora(), solapeMinutos(), MotorCalculo, Tests unitarios exhaustivos del motor de cálculo (sin DB ni Nest), Todo parámetro de cálculo es configurable, nunca hardcodeado

### Community 67 - "XLSX Parser Adapter"
Cohesion: 0.17
Nodes (14): ALIAS_CODIGO, ALIAS_ENTRADA, ALIAS_FECHA, ALIAS_NOMBRE, ALIAS_SALIDA, ColumnasDetectadas, detectarColumnas(), EPOCA_EXCEL_MS (+6 more)

### Community 68 - "CrearEmpleado DTO"
Cohesion: 0.14
Nodes (14): CrearEmpleadoDto, ApiProperty, ApiPropertyOptional, IsInt, IsNotEmpty, IsOptional, IsString, Type (+6 more)

### Community 69 - "Motor Calculo Tests"
Cohesion: 0.15
Nodes (11): DOMINGO, LUNES, Opciones, PARAMETROS, SABADO, SALARIO_HORA, TIPOS, TURNO_DIURNO (+3 more)

### Community 70 - "Frontend Usuarios API & PageHeader"
Cohesion: 0.31
Nodes (10): actualizarUsuario(), ActualizarUsuarioInput, crearUsuario(), CrearUsuarioInput, listarUsuarios(), PageHeader(), UsuarioDrawer(), RolUsuario (+2 more)

### Community 71 - "Jest Config"
Cohesion: 0.15
Nodes (13): jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment, testRegex, transform (+5 more)

### Community 72 - "Crear Turno Use Case"
Cohesion: 0.23
Nodes (3): CrearTurnoDatos, CrearTurnoUseCase, TurnoCodigoDuplicadoError

### Community 73 - "Configuracion Controller"
Cohesion: 0.18
Nodes (10): ConfiguracionController, ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, Body, Controller, Get (+2 more)

### Community 74 - "RegistroHoras Repository (Prisma)"
Cohesion: 0.31
Nodes (5): aDominio(), aDominioRegistro(), datosCalculos(), RegistroHorasPrismaRepository, Injectable

### Community 75 - "Frontend AsignacionesTurno API"
Cohesion: 0.28
Nodes (10): actualizarAsignacionTurno(), ActualizarAsignacionTurnoInput, crearAsignacionTurno(), CrearAsignacionTurnoInput, eliminarAsignacionTurno(), listarAsignacionesPorEmpleado(), listarTurnos(), AsignacionesTurnoPage() (+2 more)

### Community 76 - "TipoHoraExtra Port & Entity"
Cohesion: 0.44
Nodes (4): ActualizarTipoHoraExtraDatos, TIPO, ModoValorizacion, TipoHoraExtraNoEncontradoError

### Community 77 - "Reporte Periodo Service & Historico"
Cohesion: 0.27
Nodes (5): desgloseCero(), ReportePeriodoService, fechaCorteHaceMeses(), HistoricoPeriodo, ObtenerReporteHistoricoUseCase

### Community 78 - "Resolver Turno del Empleado Tests"
Cohesion: 0.17
Nodes (4): AsignacionTurnoRepositoryFake, TURNO_DIURNO, TURNO_NOCTURNO, TURNO_SABADO

### Community 79 - "ListarEmpleados Query DTO"
Cohesion: 0.17
Nodes (11): ListarEmpleadosQueryDto, ApiPropertyOptional, IsBoolean, IsInt, IsOptional, IsString, Max, Min (+3 more)

### Community 80 - "AsignacionTurno Repository (Prisma)"
Cohesion: 0.25
Nodes (3): aDominio(), AsignacionTurnoPrismaRepository, Injectable

### Community 81 - "Periodo Repository (Prisma)"
Cohesion: 0.31
Nodes (3): aDominio(), PeriodoPrismaRepository, Injectable

### Community 82 - "Turno Repository (Prisma)"
Cohesion: 0.27
Nodes (3): aDominio(), Injectable, TurnoPrismaRepository

### Community 83 - "Crear Empleado Use Case & Errors"
Cohesion: 0.36
Nodes (3): EmpleadoCedulaDuplicadaError, EmpleadoCodigoDuplicadoError, ETAPA 1 — Recurso Empleados (completada)

### Community 84 - "TipoHoraExtra Use Cases"
Cohesion: 0.22
Nodes (3): ActualizarTipoHoraExtraUseCase, ListarTiposHoraExtraUseCase, Inject

### Community 85 - "Feriado Repository (Prisma)"
Cohesion: 0.31
Nodes (3): aDominio(), FeriadoPrismaRepository, Injectable

### Community 86 - "CrearRegistro DTO"
Cohesion: 0.22
Nodes (8): CrearRegistroDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID, Matches

### Community 87 - "Frontend Oxlint Config"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 88 - "Feriado Eliminar/Listar Use Cases"
Cohesion: 0.25
Nodes (3): EliminarFeriadoUseCase, ListarFeriadosUseCase, Inject

### Community 89 - "Usuario Repository (Prisma)"
Cohesion: 0.39
Nodes (3): aDominio(), Injectable, UsuarioPrismaRepository

### Community 90 - "CrearAsignacionTurno DTO"
Cohesion: 0.25
Nodes (7): CrearAsignacionTurnoDto, ApiProperty, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID

### Community 91 - "ListarFeriados Query DTO"
Cohesion: 0.25
Nodes (7): ListarFeriadosQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type

### Community 92 - "Importacion Respuesta DTO & Mapper"
Cohesion: 0.32
Nodes (6): ImportacionRespuestaDto, ApiProperty, ApiPropertyOptional, aFechaISO(), aFilaImportacionRespuestaDto(), aImportacionRespuestaDto()

### Community 93 - "Historico Query DTO"
Cohesion: 0.25
Nodes (7): HistoricoQueryDto, ApiPropertyOptional, IsInt, IsOptional, Max, Min, Type

### Community 94 - "CrearTurno DTO"
Cohesion: 0.25
Nodes (7): CrearTurnoDto, ApiProperty, IsBoolean, IsNotEmpty, IsString, Matches, MaxLength

### Community 95 - "Backend TS Build Config"
Cohesion: 0.25
Nodes (7): exclude, extends, dist, node_modules, **/*spec.ts, test, ./tsconfig.json

### Community 96 - "Plan de Trabajo & Formula Salario/Hora (docs/06)"
Cohesion: 0.29
Nodes (8): Bug corregido 2026-07-17: salario diario usado como salario/hora (~8× de más), DomainError declara su propio httpStatus (evita mapa manual desactualizado), ETAPA 2 — Recurso Configuración (completada), ETAPA 4 — Recurso Registros de horas (completada), ETAPA 6 — Recurso Reportes + Usuarios (completada), salario/hora = (salario mensual ÷ divisor_salario) ÷ horas_jornada, Caso de aceptación maestro: abril 2026, 46 empleados, RD$99,540.60, Plan de trabajo — Backend

### Community 97 - "Extraer Reporte Viejo (script temp)"
Cohesion: 0.29
Nodes (5): EPOCA_EXCEL_MS, fechasOrdenadas, filas, seriales, wb

### Community 98 - "Backend package.json Metadata"
Cohesion: 0.29
Nodes (6): author, description, license, name, private, version

### Community 99 - "TipoHoraExtra Repository (Prisma)"
Cohesion: 0.38
Nodes (3): aDominio(), TipoHoraExtraPrismaRepository, Injectable

### Community 100 - "ActualizarAsignacionTurno DTO"
Cohesion: 0.29
Nodes (6): ActualizarAsignacionTurnoDto, ApiPropertyOptional, IsDateString, IsOptional, IsString, IsUUID

### Community 101 - "Parsear Importacion Respuesta DTO"
Cohesion: 0.38
Nodes (6): FilaImportacionRespuestaDto, ApiProperty, ApiPropertyOptional, ParsearImportacionRespuestaDto, ResumenImportacionDto, ApiProperty

### Community 102 - "ActualizarRegistro DTO"
Cohesion: 0.29
Nodes (6): ActualizarRegistroDto, ApiPropertyOptional, IsDateString, IsOptional, IsString, Matches

### Community 103 - "ActualizarTipoHoraExtra DTO"
Cohesion: 0.29
Nodes (6): ActualizarTipoHoraExtraDto, ApiPropertyOptional, IsBoolean, IsOptional, IsString, Matches

### Community 104 - "ActualizarTurno DTO"
Cohesion: 0.29
Nodes (6): ActualizarTurnoDto, ApiPropertyOptional, IsBoolean, IsOptional, IsString, Matches

### Community 105 - "Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 106 - "XLSX Parser Tests"
Cohesion: 0.40
Nodes (4): xlsx, libroDesdeFilas(), libroTimeCard(), xlsx

### Community 108 - "CrearFeriado DTO"
Cohesion: 0.33
Nodes (5): CrearFeriadoDto, ApiProperty, IsDateString, IsNotEmpty, IsString

### Community 109 - "ConfirmarImportacion DTO"
Cohesion: 0.33
Nodes (5): ConfirmarImportacionDto, ApiProperty, ApiPropertyOptional, IsBoolean, IsOptional

### Community 110 - "PreviewCalculo DTO"
Cohesion: 0.33
Nodes (5): PreviewCalculoDto, ApiProperty, IsDateString, IsUUID, Matches

### Community 111 - "Frontend Scaffold (Vite/React/TS)"
Cohesion: 0.40
Nodes (6): React, TypeScript, Vite, frontend/index.html (HEHM app shell), frontend/README.md (React + TypeScript + Vite template), src/main.tsx (entrypoint montado en #root)

### Community 112 - "ActualizarConfiguracion DTO"
Cohesion: 0.40
Nodes (4): ActualizarConfiguracionDto, ApiPropertyOptional, IsOptional, IsString

### Community 113 - "Arquitectura Clean Architecture (CLAUDE.md)"
Cohesion: 0.40
Nodes (5): Clean Architecture pragmática (presentation→application→domain), domain/ es TypeScript puro (cero imports de Nest/Prisma), DTOs class-validator en presentation/dtos, mapeados en el controller, Cableado de providers solo en presentation/modules, application/ports define interfaces; infrastructure las implementa

### Community 114 - "Modelo de Datos: Auditoria/Empleado & Vistas SQL"
Cohesion: 0.40
Nodes (5): Modelo Auditoria (auditorias), Modelo Empleado (empleados), Paginación real de servidor (skip/take + count), vw_auditoria — vista SQL de solo lectura (VwAuditoria), vw_empleados — vista SQL (VwEmpleado), fix del N+1 de salario

### Community 116 - "Social Icons Sprite"
Cohesion: 0.50
Nodes (4): Bluesky icon, Discord icon, Social (generic people/contact) icon, X (Twitter) icon

### Community 118 - "Auditoria Module"
Cohesion: 0.67
Nodes (3): AuditoriaModule, Global, Module

## Ambiguous Edges - Review These
- `Discord icon` → `Social (generic people/contact) icon`  [AMBIGUOUS]
  frontend/public/icons.svg · relation: conceptually_related_to

## Knowledge Gaps
- **345 isolated node(s):** `EPOCA_EXCEL_MS`, `wb`, `filas`, `seriales`, `fechasOrdenadas` (+340 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Discord icon` and `Social (generic people/contact) icon`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Usuario` connect `Usuario Repository Port` to `Auth Password & Token Ports`, `TiposHoraExtra Controller`, `Auditoria Repository Port`, `Nest Controller Decorators (misc)`, `Configuracion Controller`, `Periodo Repository Port`, `Feriados Controller`, `Registros Controller`, `Nest Controller Decorators (misc)`, `Importaciones Controller`, `Empleado & Salario Use Cases`, `Usuario Repository (Prisma)`, `Periodos Controller`, `AsignacionesTurno Controller`, `Empleados Controller`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Backend Runtime Dependencies` to `rxjs Dependency`, `Backend package.json Metadata`, `XLSX Parser Tests`, `bcrypt Dependency`, `class-validator Dependency`, `exceljs Dependency`, `@nestjs/core Dependency`, `@nestjs/jwt Dependency`, `@nestjs/swagger Dependency`, `passport Dependency`, `@prisma/adapter-mssql Dependency`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `xlsx` connect `XLSX Parser Tests` to `XLSX Parser Adapter`, `Backend Runtime Dependencies`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `EPOCA_EXCEL_MS`, `wb`, `filas` to the rest of the system?**
  _345 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Periodo Repository Fake (Tests)` be split into smaller, more focused modules?**
  _Cohesion score 0.038461538461538464 - nodes in this community are weakly interconnected._
- **Should `Auth Password & Token Ports` be split into smaller, more focused modules?**
  _Cohesion score 0.04811507936507937 - nodes in this community are weakly interconnected._