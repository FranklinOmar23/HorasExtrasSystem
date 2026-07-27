import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // `exposedHeaders` es necesario para que el frontend pueda leer el nombre
  // de archivo real (Content-Disposition) al descargar el Excel del reporte
  // — por defecto el navegador no expone ese header a JS entre orígenes.
  app.enableCors({ exposedHeaders: ['Content-Disposition'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainErrorFilter());

  const config = new DocumentBuilder()
    .setTitle('Sistema de Horas Extras — Hartemanía')
    .setDescription(
      'API para calcular y pagar horas extras por quincena en Hartemanía.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documento);

  const port = process.env.PORT ?? 5000;
  await app.listen(port);
}
void bootstrap();
