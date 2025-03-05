import { rpc, adapters, ChainsmithSdk } from 'chainsmith-sdk/index';
import { EvmTokenPlugin } from 'chainsmith-sdk/plugins/evm/index.ts';
import { alchemy } from 'chainsmith-sdk/rpc/index.ts';
import { TChainName } from 'chainsmith-sdk/types/index.ts';
import { buildEvmChains } from 'chainsmith-sdk/utils/index.ts';

export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';

export const SIMPLE_HASH_API_BASE_URL = process.env.SIMPLE_HASH_API_BASE_URL;
export const SIMPLE_HASH_API_KEY = process.env.SIMPLE_HASH_API_KEY;

export const COINMARKETCAP_API_BASE_URL = 'https://pro-api.coinmarketcap.com';
export const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || '';

export const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/v2/api';
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

export const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY || '';

export const AdapterRegistry = {
  Alchemy: new adapters.AlchemyAdapter(ALCHEMY_API_KEY, new EvmTokenPlugin()),
  CoinMarketcap: new adapters.CoinMarketcapAdapter(
    COINMARKETCAP_API_BASE_URL,
    COINMARKETCAP_API_KEY
  ),
  Uniswap: new adapters.UniswapSdkAdapter(rpc.alchemy(ALCHEMY_API_KEY)),
  Evmscan: new adapters.EvmscanAdapter(ETHERSCAN_BASE_URL, ETHERSCAN_API_KEY),
  DexScreener: new adapters.DexScreenerAdapter(),
  ShadowExchangeApi: new adapters.ShadowExchangeApiAdapter(),
  ShadowExchange: new adapters.ShadowExchangeAdapter(new EvmTokenPlugin()),
  PaintSwap: new adapters.PaintSwapAdapter(),
  MetropolisApi: new adapters.MetropolisApiAdapter(),
  SiloV2Api: new adapters.SiloV2ApiAdapter(),
  BeetsApi: new adapters.BeetsApiAdapter(),
  OriginApi: new adapters.OriginApiAdapter(),
  Reservoir: new adapters.ReservoirAdapter(RESERVOIR_API_KEY),
};

export const buildDefaultChains = (chainNames: TChainName[]) =>
  buildEvmChains(chainNames, alchemy(ALCHEMY_API_KEY));

export const initChainsmithSdk = (chainNames: TChainName[] = []) => {
  let chains = [];
  if (chainNames.length > 0) {
    chains = buildDefaultChains(chainNames);
  }
  return ChainsmithSdk.init(chains);
};
