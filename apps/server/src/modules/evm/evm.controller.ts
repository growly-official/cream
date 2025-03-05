import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import type {
  TTokenPortfolio,
  TTokenTransferActivity,
  TAddress,
  TChainMetadataListResponse,
  TChainName,
  TMultichain,
} from 'chainsmith-sdk/types/index.ts';
import { EvmChainService } from './evm.service';

@Controller('/evm')
export class EvmChainController {
  constructor(private readonly evmService: EvmChainService) {}

  @Post('/portfolio')
  async getWalletTokenPortfolio(
    @Body() payload: { walletAddress: TAddress; chainNames: TChainName[] }
  ): Promise<TTokenPortfolio> {
    if (payload.chainNames.length === 0) throw new Error('No chain provided');
    return this.evmService.getEvmChainsTokenPortfolio(payload.walletAddress, payload.chainNames);
  }

  @Post('/activity')
  async listMultichainTokenTransferActivities(
    @Body() payload: { walletAddress: TAddress; chainNames: TChainName[] }
  ): Promise<TMultichain<TTokenTransferActivity[]>> {
    if (payload.chainNames.length === 0) throw new Error('No chain provided');
    return this.evmService.listMultichainTokenTransferActivities(
      payload.walletAddress,
      payload.chainNames
    );
  }

  @Get('/chainlist/:id')
  async getChainMetadata(
    @Param() params: { id: number }
  ): Promise<TChainMetadataListResponse | undefined> {
    return this.evmService.getChainMetadata(params.id);
  }
}
