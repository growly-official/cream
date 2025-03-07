import { Body, Controller, Inject, Post } from '@nestjs/common';
import { EvmChainService } from './evm.service.ts';
import type {
  TChainName,
  TAddress,
  TTokenTransferActivity,
  TMultichain,
  TTokenPortfolio,
} from 'chainsmith-sdk';

@Controller('/evm')
export class EvmController {
  constructor(@Inject(EvmChainService) private readonly service: EvmChainService) {}

  @Post('/portfolio')
  async getWalletTokenPortfolio(
    @Body() payload: { walletAddress: TAddress; chainNames: TChainName[] }
  ): Promise<TTokenPortfolio> {
    if (payload.chainNames.length === 0) throw new Error('No chain provided');
    return this.service.getWalletTokenPortfolio(payload.walletAddress, payload.chainNames);
  }

  @Post('/activity')
  async listMultichainTokenTransferActivities(
    @Body() payload: { walletAddress: TAddress; chainNames: TChainName[] }
  ): Promise<TMultichain<TTokenTransferActivity[]>> {
    if (payload.chainNames.length === 0) throw new Error('No chain provided');
    return this.service.listMultichainTokenTransferActivities(
      payload.walletAddress,
      payload.chainNames
    );
  }
}
