import { Body, Controller, Post, Res, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { TransformInterceptor } from '../interceptors/transform.interceptor';
import { Response } from 'express';
import { SigninDto } from './dto/signin.dto';

@Controller('')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(TransformInterceptor)
  @Post('signup')
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() signupDto: SignupDto,
  ) {
    return await this.authService.signup(res, signupDto);
  }

  @UseInterceptors(TransformInterceptor)
  @Post('signin')
  async signin(
    @Res({ passthrough: true }) res: Response,
    @Body() signinDto: SigninDto,
  ) {
    return await this.authService.signin(res, signinDto);
  }
}
