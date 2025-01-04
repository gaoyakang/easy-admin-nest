import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './src/core/interceptor/ResponseInterceptor.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { ConfigService } from '@nestjs/config';
// import { WinstonCustom } from 'src/core/log/winstonCustom';
// import { ExceptionResult } from 'src/core/exceptionFilter/ExceptionResult.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  });
  // 使用 Winston 作为全局 logger
  // app.get(ConfigService);
  // const wc = new WinstonCustom(app.get(ConfigService));
  // app.useLogger(wc.genLogger());

  // 设置全局路由前缀
  app.setGlobalPrefix('api/v1/');

  // 验证传参格式
  app.useGlobalPipes(new ValidationPipe());

  // 异常拦截
  // app.useGlobalFilters(new ExceptionResult(wc));

  // 过滤器: 统一非200的数据返回格式
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 管道:过滤x字段
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  // 文档
  const config = new DocumentBuilder()
    .setTitle('Easy Admin接口文档')
    .setDescription('Easy Admin接口文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 监听端口
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
