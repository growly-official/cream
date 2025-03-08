import { Body, Controller, Inject, Post } from '@nestjs/common';
import { SonicService } from './sonic.service.ts';
import type {
  TAddress,
  TTokenTransferActivity,
  TTokenPortfolio,
  TNftBalance,
} from 'chainsmith-sdk/types';
import { TSonicUserPointsStats } from 'chainsmith-sdk/plugins';

@Controller('/sonic')
export class SonicController {
  constructor(@Inject(SonicService) private readonly service: SonicService) {}

  @Post('/portfolio')
  async getTokenPortfolio(@Body() payload: { walletAddress: TAddress }): Promise<TTokenPortfolio> {
    return this.service.getTokenPortfolio(payload.walletAddress);
  }

  @Post('/points')
  async getUserPointStats(
    @Body() payload: { walletAddress: TAddress }
  ): Promise<TSonicUserPointsStats> {
    return this.service.getUserPointStats(payload.walletAddress);
  }

  @Post('/nfts')
  async getNftCollectibles(@Body() payload: { walletAddress: TAddress }): Promise<TNftBalance[]> {
    return this.service.getNftCollectibles(payload.walletAddress);
  }

  @Post('/activity')
  async listTokenTransferActivities(
    @Body() payload: { walletAddress: TAddress }
  ): Promise<TTokenTransferActivity[]> {
    return this.service.listTokenTransferActivities(payload.walletAddress);
  }
}
