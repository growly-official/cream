import { IEcosystemChainRegistry, TChainName } from 'chainsmith-sdk/types';

export const BackgroundChains: TChainName[] = [
  'mainnet',
  'base',
  'optimism',
  'arbitrum',
  'abstract',
  'zksync',
  'avalanche',
  'berachain',
];

export const LocalEcosystemRegistry: IEcosystemChainRegistry = {
  evm: {
    chains: BackgroundChains,
  },
  svm: {
    chains: [],
  },
  other: {
    chains: [],
  },
};
