import { Injectable } from '@nestjs/common';
import {
  TAddress,
  TChainName,
  TMultichain,
  TTokenPortfolio,
  TTokenTransferActivity,
} from 'chainsmith-sdk/types/index.ts';
import { AdapterRegistry, initChainsmithSdk } from '../../config/index.ts';
import { multiple } from 'chainsmith-sdk/adapters/index.ts';

@Injectable()
export class SonicApiService {
  async getSonicTokenPortfolio(walletAddress: TAddress): Promise<TTokenPortfolio> {
    const sdk = initChainsmithSdk(['sonic']);
    return sdk.portfolio.getTokenPortfolio([
      multiple([AdapterRegistry.ShadowExchangeApi, AdapterRegistry.CoinMarketcap]),
      AdapterRegistry.ShadowExchange,
    ])(walletAddress);
  }

  async listSonicTokenPortfolio(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TMultichain<TTokenTransferActivity[]>> {
    const sdk = initChainsmithSdk(chainNames);
    return sdk.token.listMultichainTokenTransferActivities(AdapterRegistry.Evmscan)(
      walletAddress,
      sdk.storage.readDisk('chains')
    );
  }
}
