import { Injectable } from '@nestjs/common';
import {
  TAddress,
  TChainName,
  TMultichain,
  TTokenPortfolio,
  TTokenTransferActivity,
} from 'chainsmith-sdk';
import { AdapterRegistry, chainsmithSdk } from '../../config';

@Injectable()
export class EvmChainService {
  async getWalletTokenPortfolio(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TTokenPortfolio> {
    const sdk = chainsmithSdk(chainNames);
    return sdk.portfolio.getMultichainTokenPortfolio([
      AdapterRegistry.CoinMarketcap,
      AdapterRegistry.Alchemy,
    ])(walletAddress, sdk.storage.readDisk('chains'));
  }

  async listMultichainTokenTransferActivities(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TMultichain<TTokenTransferActivity[]>> {
    return chainsmithSdk(chainNames).token.listMultichainTokenTransferActivities(
      AdapterRegistry.Evmscan
    )(walletAddress);
  }
}
