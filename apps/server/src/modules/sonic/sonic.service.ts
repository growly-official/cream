import { Injectable } from '@nestjs/common';
import { AdapterRegistry, chainsmithSdk } from '../../config';
import type {
  TAddress,
  TChainName,
  TNftBalance,
  TTokenPortfolio,
  TTokenTransferActivity,
} from 'chainsmith-sdk';
import type { TSonicUserPointsStats } from 'chainsmith-sdk/plugins';

@Injectable()
export class SonicService {
  CHAIN_NAME: TChainName = 'sonic';

  sdk = chainsmithSdk([this.CHAIN_NAME]);

  async getTokenPortfolio(walletAddress: TAddress): Promise<TTokenPortfolio> {
    return this.sdk.portfolio.getTokenPortfolio([
      AdapterRegistry.ShadowExchangeApi,
      AdapterRegistry.ShadowExchange,
    ])(walletAddress);
  }

  async getUserPointStats(walletAddress: TAddress): Promise<TSonicUserPointsStats> {
    return this.sdk.sonicPoint.fetchUserPointsStats(walletAddress);
  }

  async getNftCollectibles(walletAddress: TAddress): Promise<TNftBalance[]> {
    return this.sdk.token.getNftCollectibles(AdapterRegistry.PaintSwap)(
      this.CHAIN_NAME,
      walletAddress
    );
  }

  async listTokenTransferActivities(walletAddress: TAddress): Promise<TTokenTransferActivity[]> {
    return this.sdk.token.listChainTokenTransferActivities(AdapterRegistry.Evmscan)(walletAddress);
  }
}
