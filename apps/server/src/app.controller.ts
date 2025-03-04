import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service.ts';
import type {
  TTokenPortfolio,
  TTokenTransferActivity,
  TAddress,
  TChainMetadataListResponse,
  TChainName,
  TMultichain,
} from 'chainsmith-sdk/types/index.ts';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/portfolio')
  async getWalletTokenPortfolio(
    @Body() payload: { walletAddress: TAddress; chainNames: TChainName[] }
  ): Promise<TTokenPortfolio> {
    if (payload.chainNames.length === 0) throw new Error('No chain provided');
    return this.appService.getWalletTokenPortfolio(payload.walletAddress, payload.chainNames);
  }

  @Post('/activity')
  async listMultichainTokenTransferActivities(
    @Body() payload: { walletAddress: TAddress; chainNames: TChainName[] }
  ): Promise<TMultichain<TTokenTransferActivity[]>> {
    if (payload.chainNames.length === 0) throw new Error('No chain provided');
    return this.appService.listMultichainTokenTransferActivities(
      payload.walletAddress,
      payload.chainNames
    );
  }

  @Get('/chainlist/:id')
  async getChainMetadata(
    @Param() params: { id: number }
  ): Promise<TChainMetadataListResponse | undefined> {
    return this.appService.getChainMetadata(params.id);
  }
}
