import { container, singleton } from 'tsyringe';
import {
  MultichainPortfolioPlugin,
  MultichainTokenPlugin,
  MultiPlatformSocialPlugin,
  StoragePlugin,
} from './plugins/index.ts';
import type { TChain } from './types/index.d.ts';

@singleton()
export default class ChainsmithSdk {
  constructor(
    public portfolio: MultichainPortfolioPlugin,
    public token: MultichainTokenPlugin,
    public social: MultiPlatformSocialPlugin,
    public storage: StoragePlugin
  ) {}

  public static init(chains?: TChain[]) {
    const sdk = container.resolve(ChainsmithSdk);
    if (chains) sdk.storage.writeToDisk('chains', chains);
    return sdk;
  }
}
