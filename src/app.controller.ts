import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { isPublic } from './core/decorators/isPublic.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @isPublic()
  @Get()
  getHello() {
    return this.appService.getHello();
  }

  // 初始化创建
  @isPublic()
  @Get('/init')
  init() {
    return this.appService.init();
  }

  // 清除数据库
  @isPublic()
  @Get('/clear')
  clear() {
    return this.appService.clear();
  }
}
