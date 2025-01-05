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
}
