import { Module } from '@nestjs/common';
import { EvmChainController } from './evm.controller.ts';
import { EvmChainService } from './evm.service.ts';

@Module({
  imports: [],
  controllers: [EvmChainController],
  providers: [EvmChainService],
})
export class EvmModule {}
