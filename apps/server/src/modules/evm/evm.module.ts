import { Module } from '@nestjs/common';
import { EvmChainService } from './evm.service';
import { EvmController } from './evm.controller';

@Module({
  providers: [EvmChainService],
  exports: [EvmChainService],
  controllers: [EvmController],
})
export class EvmModule {}
