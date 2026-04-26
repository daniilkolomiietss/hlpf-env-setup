import { NestFactory } from '@nestjs/core';
import { TrimPipe } from './common/pipes/trim.pipe';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  app.useGlobalPipes(
	new TrimPipe(),
	new ValidationPipe({
  	whitelist: true,
  	forbidNonWhitelisted: true,
  	transform: true,
	}),
  );
 
  await app.listen(3000);
}
bootstrap();