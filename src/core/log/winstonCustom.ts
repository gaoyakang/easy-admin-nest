import { Module, Global, Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as chalk from 'chalk';

// 自定义的winston日志服务
@Injectable()
export class WinstonCustom extends WinstonModule {
  private logger;

  constructor(private readonly configService: ConfigService) {
    super();
    this.logger = this.genLogger();
  }

  genLogger(label: string = 'sys') {
    const logger = WinstonModule.createLogger({
      level: this.configService.get('log.level'),
      transports: [
        // console日志
        this.configService.get('log.console')
          ? new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp({
                  format: this.configService.get('log.format'),
                }),
                winston.format.errors({ stack: true }), // 确保错误堆栈被包含
                winston.format.printf(({ level, message, timestamp }) => {
                  let logName, pid;
                  if (!label) {
                    label = this.configService.get('log.label');
                  }
                  if (level.toUpperCase() === 'ERROR') {
                    level = chalk.red(level.toUpperCase());
                    message = chalk.red(message);
                    label = chalk.yellow(label);
                    logName = `[${chalk.red(this.configService.get('log.name'))}]`;
                    pid = ` ${chalk.red(process.pid)} - `;
                    timestamp = `${chalk.white(timestamp)}`;
                  } else {
                    level = chalk.green(level.toUpperCase());
                    label = chalk.yellow(label);
                    logName = `[${chalk.green(this.configService.get('log.name'))}]`;
                    pid = ` ${chalk.green(process.pid)} - `;
                  }
                  return `${logName} ${pid} ${timestamp}  ${level} [${label}] ${message}`;
                }),
              ),
            })
          : null,
        // 保存到文件
        new winston.transports.DailyRotateFile({
          filename: this.configService.get('log.filename'),
          datePattern: this.configService.get('log.datePattern'),
          zippedArchive: this.configService.get('log.zippedArchive'),
          maxSize: this.configService.get('log.maxSize'),
          maxFiles: this.configService.get('log.maxFiles'),
          format: winston.format.combine(
            winston.format.timestamp({
              format: this.configService.get('log.format'),
            }),
            winston.format.printf(({ level, message, timestamp, label }) => {
              if (!label) {
                label = this.configService.get('log.label');
              }
              return `[${this.configService.get('log.name')}] ${process.pid} - ${timestamp}  ${level.toUpperCase()} [${label}] ${message}`;
            }),
          ),
        }),
      ],
    });
    return logger;
  }

  // 各个级别的log
  public log(level: string, message: string) {
    this.logger.log(level, message);
  }

  public error(message: string, error?: Error) {
    if (error) {
      this.logger.error(message, { stack: error.stack });
    } else {
      this.logger.error(message);
    }
  }

  public info(message: string) {
    this.logger.info(message);
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'WinstonCustom',
      useFactory: (configService: ConfigService) => {
        return new WinstonCustom(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['WinstonCustom'],
})
export class WinstonCustomModule {}
