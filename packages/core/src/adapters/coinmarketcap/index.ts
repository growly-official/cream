import axios from 'axios';
import { Files } from '../../data';
import { TChainName, TMarketToken, TToken, TTokenId, TTokenSymbol } from '../../types';
import { TCMCDetailMap, TCMCStaticMap, TCMCTokenDetail, TCMCTokenIDDetail } from './types';
import { Logger } from 'tslog';
import { autoInjectable } from 'tsyringe';
import { IMarketDataAdapter } from '../adapter';

// Some tokens have a conflict symbol with others, like Ethereum and The Inifinite Garden.
const NATIVE_TOKEN_MAP = {
  ETH: {
    id: 1027,
    rank: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    slug: 'ethereum',
    is_active: 1,
    first_historical_data: '2015-08-07T14:45:00.000Z',
    last_historical_data: '2024-10-16T13:35:00.000Z',
    platform: null,
  },
};

@autoInjectable()
export class CoinMarketcapAdapter implements IMarketDataAdapter {
  name = 'CoinMarketcapAdapter';
  logger = new Logger({ name: this.name });

  apiUrl: string;
  apiKey: string;
  tokenSymbolMap: Record<TTokenSymbol, TCMCTokenIDDetail>;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.tokenSymbolMap = this.intoTokenSymbolMap(Files.TokenList.CoinMarketcapTokenList as any);
  }

  fetchTokenWithPrice = async (
    _chain: TChainName,
    token: TToken
  ): Promise<TMarketToken | undefined> => {
    const tokenSymbolMap = this.getTokenSymbolMap([token]);
    const prices = await this.getTokenPriceMap(
      Object.values(tokenSymbolMap).map(value => value.id)
    );
    const cmcTokenDetail = tokenSymbolMap[token.symbol];
    if (!cmcTokenDetail) return undefined;

    const tokenPriceData = prices[cmcTokenDetail.id];
    const price = tokenPriceData.quote.USD.price;
    const usdValue = price * token.balance;
    return {
      ...token,
      usdValue,
      marketPrice: price,
    };
  };

  fetchTokensWithPrice = async (
    _chainName: TChainName,
    tokens: TToken[]
  ): Promise<{ tokens: TMarketToken[]; totalUsdValue: number }> => {
    // Get token USD values from CoinMarketcap adapter.
    const tokenSymbolMap = this.getTokenSymbolMap(tokens);
    console.log(tokenSymbolMap);
    const prices = await this.getTokenPriceMap(
      Object.values(tokenSymbolMap).map(value => value.id)
    );

    // Map token with its USD value.
    let totalUsdValue = 0;
    const marketTokens: TMarketToken[] = [];
    for (const token of tokens) {
      const cmcTokenDetail = tokenSymbolMap[token.symbol];
      if (!cmcTokenDetail) {
        continue;
      }

      const tokenPriceData = prices[cmcTokenDetail.id];
      const price = tokenPriceData.quote.USD.price;
      const usdValue = price * token.balance;
      totalUsdValue += usdValue;
      marketTokens.push({
        ...token,
        usdValue,
        marketPrice: price,
      });
    }
    return {
      tokens: marketTokens,
      totalUsdValue,
    };
  };

  // Map symbol to CoinMarketCap coin details.
  intoTokenSymbolMap = (m: TCMCStaticMap) => {
    const cmcTokenIdList = m.data;
    const result: Record<TTokenSymbol, TCMCTokenIDDetail> = {};
    for (const token of cmcTokenIdList) {
      result[token.symbol] = token;
    }
    return result;
  };

  getTokenSymbolMap = (tokens: TToken[]): Record<TTokenSymbol, TCMCTokenIDDetail> => {
    try {
      const tokenIdMap: Record<string, TCMCTokenIDDetail> = {};
      for (const token of tokens) {
        const tokenSymbol = token.symbol;
        const nativeToken = (NATIVE_TOKEN_MAP as any)[token.symbol];
        if (token.type === 'native' && nativeToken) {
          tokenIdMap[tokenSymbol] = nativeToken;
        } else {
          const cmcToken = this.tokenSymbolMap[tokenSymbol];
          if (!cmcToken) continue;
          tokenIdMap[tokenSymbol] = this.tokenSymbolMap[tokenSymbol];
        }
      }
      return tokenIdMap;
    } catch (error: any) {
      this.logger.error(`Failed to get token symbol map: ${error.message}`);
      throw new Error(error);
    }
  };

  getTokenPriceMap = async (tokenIds: TTokenId[]): Promise<Record<TTokenId, TCMCTokenDetail>> => {
    try {
      if (tokenIds.length == 0) return {};
      const query = `id=${tokenIds.join(',')}&aux=tags,date_added`;
      const res = await axios.get<TCMCDetailMap>(
        `${this.apiUrl}/v1/cryptocurrency/quotes/latest?${query}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'PostmanRuntime/7.40.0',
            'X-CMC_PRO_API_KEY': this.apiKey,
          },
        }
      );
      return res.data.data;
    } catch (error: any) {
      this.logger.error(`Failed to get price map: ${error.message}`);
      throw new Error(error);
    }
  };
}
