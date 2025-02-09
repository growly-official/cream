import { Injectable } from '@nestjs/common';
import { TAddress, TChainName, TTokenPortfolio } from 'chainsmith/src/types/index.ts';
import { AdapterRegistry, initChainsmithSdk } from './config/index.ts';

@Injectable()
export class AppService {
  async getWalletTokenPortfolio(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TTokenPortfolio> {
    const sdk = initChainsmithSdk(chainNames);
    return sdk.portfolio.getMultichainTokenPortfolio(AdapterRegistry.CoinMarketcap)(
      walletAddress,
      sdk.storage.readDisk('chains')
    );
  }
}
