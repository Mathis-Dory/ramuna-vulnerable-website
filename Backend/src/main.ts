import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
  app.enableCors();
  await app.listen(port);
  console.log(`========== Nest server successfully started on port ${port} ==========`);
}
bootstrap();
