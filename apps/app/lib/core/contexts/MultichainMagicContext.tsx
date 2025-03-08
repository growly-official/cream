'use client';
import React, { useState } from 'react';
import {
  TActivityStats,
  TChainName,
  TChainStats,
  TMultichain,
  TMultiEcosystem,
  TTokenPortfolio,
  TTokenPortfolioStats,
  TTokenTransferActivity,
} from 'chainsmith-sdk/types';
import { SetState, StateEventRegistry, UseState } from '../types';
import { BackgroundChains } from '../chainsmith';

const defaultTokenPortfolioStats: TTokenPortfolioStats = {
  aggregatedBalanceByToken: {},
  aggregatedBalanceByChain: {},
  chainRecordsWithTokens: {},
  mostValuableToken: {
    allocations: {},
    marketData: {
      chainId: 0,
      decimals: 0,
      marketPrice: 0,
      name: '',
      symbol: '',
      tags: [],
    },
    totalBalance: 0,
    totalUsdValue: 0,
  },
  sumMemeUSDValue: 0,
  sumPortfolioUSDValue: 0,
  totalUsdValue: 0,
};

const defaultChainStats: TChainStats = {
  totalChains: [],
  noActivityChains: [],
  mostActiveChainName: '',
  countUniqueDaysActiveChain: 0,
  countActiveChainTxs: 0,
};

export enum MultichainAppStage {
  DisplayProfile = 0,
  GetBased = 1,
}

export interface IMultichainMagicContext {
  appStage: UseState<MultichainAppStage>;
  stateEvents: StateEventRegistry;
  setStateEvents: SetState<StateEventRegistry>;

  // Networks
  selectedNetworks: UseState<TMultiEcosystem<TChainName[]>>;

  // Raw
  allTransactions: UseState<TMultichain<TTokenTransferActivity[]>>;
  tokenPortfolio: UseState<TTokenPortfolio>;

  // Insights
  chainStats: UseState<TChainStats>;
  activityStats: UseState<TMultichain<TActivityStats>>;
  tokenPortfolioStats: UseState<TTokenPortfolioStats>;
  totalGasInETH: UseState<number>;
}

export const MultichainMagicContext = React.createContext<IMultichainMagicContext>(
  undefined as any
);

interface Props {
  children: React.ReactElement | React.ReactNode;
}

export const MultichainMagicProvider = ({ children }: Props) => {
  const selectedNetworks = useState<TMultiEcosystem<TChainName[]>>({
    evm: BackgroundChains,
  });
  const [stateEvents, setStateEvents] = useState<StateEventRegistry>({});

  const appStage = useState<MultichainAppStage>(MultichainAppStage.DisplayProfile);
  // All transactions and activity stats
  const allTransactions = useState<TMultichain<TTokenTransferActivity[]>>({});
  const activityStats = useState<TMultichain<TActivityStats>>({});
  const chainStats = useState<TChainStats>(defaultChainStats);

  // Multi-chain token portfolio
  const tokenPortfolio = useState<TTokenPortfolio>({
    aggregatedBalanceByChain: {},
    aggregatedBalanceByToken: {},
    chainRecordsWithTokens: {},
    totalUsdValue: 0,
  });
  const tokenPortfolioStats = useState<TTokenPortfolioStats>(defaultTokenPortfolioStats);
  const totalGasInETH = useState(0);

  return (
    <MultichainMagicContext.Provider
      value={{
        appStage,
        stateEvents,
        setStateEvents,
        selectedNetworks,

        // Raw
        tokenPortfolio,
        tokenPortfolioStats,
        allTransactions,

        // Insight
        activityStats,
        chainStats,
        totalGasInETH,
      }}>
      {children}
    </MultichainMagicContext.Provider>
  );
};
