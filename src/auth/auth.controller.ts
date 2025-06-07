import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { loginData } from './dto/login-auth.sto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async singUp(@Body() singupData: SignupAuthDto){
    return this.authService.signup(singupData);

  }

  @Post('login')
  async login(@Body() Credentials: loginData){
    return this.authService.login(Credentials)
  }
}
