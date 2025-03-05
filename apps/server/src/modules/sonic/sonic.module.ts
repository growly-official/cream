import { Module } from '@nestjs/common';
import { SonicApiController } from './sonic.controller.ts';
import { SonicApiService } from './sonic.service.ts';

@Module({
  imports: [],
  controllers: [SonicApiController],
  providers: [SonicApiService],
})
export class SonicModule {}
