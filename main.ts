import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ResponseInterceptor } from './src/core/interceptor/ResponseInterceptor.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ExceptionResult } from 'src/core/exceptionFilter/ExceptionResult.filter';
import * as chalk from 'chalk';
import { AuthCheckGuard } from 'src/core/guard/authCheck.guard';
import { CustomValidationPipe } from 'src/core/pipe/customValidation.pipe';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 创建应用
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: false,
  });

  // 使用 Winston 作为全局 logger
  const wc = app.get('WinstonCustom');
  const logger = wc.genLogger('');
  logger.log(`Starting Nest application...`);
  app.useLogger(logger);

  // 设置全局路由前缀
  app.setGlobalPrefix('api/v1/');

  // auth守卫
  const authCheckGuard = app.get(AuthCheckGuard);
  app.useGlobalGuards(authCheckGuard);

  // 异常拦截
  app.useGlobalFilters(new ExceptionResult(wc));

  // 过滤器: 统一非200的数据返回格式
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 管道:过滤x字段，参数校验，自定义主要是去捕获错误
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 确保开启类型转换，用于dto中转换生效
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

  // 兜底处理
  // 捕获未捕获的异常，比如redis断联
  process.on('uncaughtException', (error) => {
    // 打印异常
    const wc = app.get('WinstonCustom');
    const logger = wc.genLogger(error.name);
    logger.error(`${error.message.replace('Error: ', '')} \n`);
  });

  // 监听端口
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// 捕获应用外的异常，比如mysql断联
process.on('uncaughtException', (error) => {
  const appname = chalk.red('EasyAdmin');
  const level = chalk.red('ERROR ');
  const label = chalk.yellow(error.name);
  const pid = chalk.red(`${process.pid} - `);
  const timestamp = getFormattedDate();
  const message = error.message
    ? chalk.red(error.message)
    : chalk.red('uncaughtException');
  console.log(
    `[${appname}]  ${pid} ${timestamp}  ${level}[${label}] ${message} \n ${error.stack}`,
  );
});

function getFormattedDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() 返回 0-11，表示 1-12 月
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}
