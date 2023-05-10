import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/global-exception.filter';
import { getConnection, Connection } from 'typeorm';
import { getConnectionToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  const port = process.env.BACKEND_PORT;
  app.enableCors();
  // Run migrations
  const connection = app.get<Connection>(getConnectionToken());
  await connection.runMigrations();
  await app.listen(port);
  console.log(
    `========== Nest server successfully started on port ${port} ==========`,
  );
}
bootstrap();
