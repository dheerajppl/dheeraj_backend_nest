import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGaurd } from './gaurds/gaurds.guard';

@UseGuards(AuthGaurd)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req) {
    return {message: 'Access Resouces', userId: req.user}
  }
}
