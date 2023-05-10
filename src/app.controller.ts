import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  welcome() {
    return this.appService.welcome();
  }
}
