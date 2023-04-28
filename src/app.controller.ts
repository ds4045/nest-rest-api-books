import { Controller, Get, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { BadRequestFilter } from './common/request.filter';

@Controller()
@ApiTags()
@UseFilters(BadRequestFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  welcome() {
    return this.appService.welcome();
  }
}
