import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalExceptionFilter());
  const port = process.env.PORT;
  app.enableCors();
  await app.listen(port);
  console.log(
    `========== Nest server successfully started on port ${port} ==========`,
  );
}
bootstrap();
