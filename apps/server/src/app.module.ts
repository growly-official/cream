import { Module } from '@nestjs/common';
import { EvmModule } from './modules/evm/evm.module';
import { SonicModule } from './modules/sonic/sonic.module';
import { SonicApiService } from './modules/sonic/sonic.service';
import { EvmChainService } from './modules/evm/evm.service';

@Module({
  imports: [EvmModule, SonicModule],
  providers: [EvmChainService, SonicApiService],
})
export class AppModule {}
