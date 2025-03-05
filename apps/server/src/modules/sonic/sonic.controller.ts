import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type {
  TTokenPortfolio,
  TTokenTransferActivity,
  TAddress,
  TChainName,
  TMultichain,
} from 'chainsmith-sdk/types/index.ts';
import { SonicApiService } from './sonic.service';

@Controller('/sonic')
export class SonicApiController {
  constructor(private readonly sonicService: SonicApiService) {}

  @Post('/portfolio')
  async getWalletTokenPortfolio(
    @Body() payload: { walletAddress: TAddress }
  ): Promise<TTokenPortfolio> {
    return this.sonicService.getSonicTokenPortfolio(payload.walletAddress);
  }

  @Post('/activity')
  async listSonicTokenTransferActivities(
    @Body() payload: { walletAddress: TAddress; chainNames: TChainName[] }
  ): Promise<TMultichain<TTokenTransferActivity[]>> {
    if (payload.chainNames.length === 0) throw new Error('No chain provided');
    return this.sonicService.listSonicTokenPortfolio(payload.walletAddress, payload.chainNames);
  }
}
