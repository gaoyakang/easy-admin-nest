import { Controller, Post, Body, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { isPublic } from 'src/core/decorators/isPublic.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @isPublic() // 放行, 不检测token
  @Post('/login')
  login(@Body() createLoginDto: CreateLoginDto) {
    return this.authService.login(createLoginDto);
  }

  @Post('/logout')
  logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  // 获取用户信息
  @Get('/info')
  info(@Request() req) {
    return this.authService.info(req.user);
  }
}
