import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  init(): string {
    return 'Hello app';
  }
}
