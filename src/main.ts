import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './interceptor/ResponseInterceptor.interceptor';
import { ExceptionResult } from './exceptionFilter/ExceptionResult.filter';
// import { ErrorResponse } from './exceptionFilter/ErrorResponse.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 验证传参格式
  app.useGlobalPipes(new ValidationPipe());

  // // 异常拦截
  app.useGlobalFilters(new ExceptionResult());

  // 过滤器: 统一非200的数据返回格式
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT ?? 3000);
  console.log('server listen on http://localhost:3000');
}
bootstrap();
