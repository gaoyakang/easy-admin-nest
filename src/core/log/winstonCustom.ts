import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import * as chalk from 'chalk';

// 自定义的winston日志
@Injectable()
export class WinstonCustom extends WinstonModule {
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    super();
  }

  genLogger() {
    const logger = WinstonModule.createLogger({
      level: this.configService.get('log.level'),
      transports: [
        // 判断是否开启控制台日志
        this.configService.get('log.console')
          ? // 控制台
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp({
                  format: this.configService.get('log.format'),
                }),
                winston.format.printf(
                  ({
                    level,
                    message,
                    timestamp,
                    label = this.configService.get('log.label'),
                  }) => {
                    if (level.toUpperCase() === 'ERROR') {
                      level = chalk.red(level.toUpperCase());
                      message = chalk.red(message);
                      label = chalk.red(label);
                    } else {
                      level = chalk.green(level.toUpperCase());
                      label = chalk.yellow(label);
                    }
                    return `[${chalk.green(this.configService.get('log.name'))}] ${chalk.green(process.pid)} ${chalk.green('-')} ${timestamp}  ${level} [${label}] ${message}`;
                  },
                ),
              ),
            })
          : null,
        // 每日日志文件
        new winston.transports.DailyRotateFile({
          filename: this.configService.get('log.filename'),
          datePattern: this.configService.get('log.datePattern'),
          zippedArchive: this.configService.get('log.zippedArchive'), // 是否压缩备份文件
          maxSize: this.configService.get('log.maxSize'), // 日志文件的最大大小，超过后自动分割
          maxFiles: this.configService.get('log.maxFiles'), // 最多保留 14 天的日志文件
          format: winston.format.combine(
            winston.format.timestamp({
              format: this.configService.get('log.format'),
            }),
            winston.format.printf(
              ({ level, message, timestamp, label = 'sys' }) => {
                return `[${this.configService.get('log.name')}] ${process.pid} - ${timestamp}  ${level.toUpperCase()} [${label}] ${message}`;
              },
            ),
          ),
        }),
      ],
    });
    return logger;
  }
}
