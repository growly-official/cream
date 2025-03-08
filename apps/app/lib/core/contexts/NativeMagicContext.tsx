'use client';
import React, { useState } from 'react';
import {
  TActivityStats,
  TChainName,
  TChainStats,
  TTokenPortfolio,
  TTokenPortfolioStats,
  TTokenTransferActivity,
} from 'chainsmith-sdk/types';
import { SetState, StateEventRegistry, UseState } from '../types';

const defaultActivityStats: TActivityStats = {
  totalTxs: 0,
  firstActiveDay: null,
  uniqueActiveDays: 0,
  longestStreakDays: 0,
  currentStreakDays: 0,
  activityPeriod: 0,
};

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

export enum ChainAppStage {
  DisplayProfile = 0,
  GetBased = 1,
}

export interface INativeMagicContext {
  appStage: UseState<ChainAppStage>;
  stateEvents: StateEventRegistry;
  setStateEvents: SetState<StateEventRegistry>;

  // Raw
  currentNativeChain: UseState<TChainName>;
  allTransactions: UseState<TTokenTransferActivity[]>;
  tokenPortfolio: UseState<TTokenPortfolio>;

  // Insights
  chainStats: UseState<TChainStats>;
  activityStats: UseState<TActivityStats>;
  tokenPortfolioStats: UseState<TTokenPortfolioStats>;
  totalGasInETH: UseState<number>;
}

export const NativeMagicContext = React.createContext<INativeMagicContext>(undefined as any);

interface Props {
  children: React.ReactElement | React.ReactNode;
}

export const NativeMagicProvider = ({ children }: Props) => {
  const currentNativeChain = useState<TChainName>('sonic');
  const [stateEvents, setStateEvents] = useState<StateEventRegistry>({});

  const appStage = useState<ChainAppStage>(ChainAppStage.DisplayProfile);
  // All transactions and activity stats
  const allTransactions = useState<TTokenTransferActivity[]>([]);
  const activityStats = useState<TActivityStats>(defaultActivityStats);
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
    <NativeMagicContext.Provider
      value={{
        appStage,
        stateEvents,
        setStateEvents,
        currentNativeChain,

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
    </NativeMagicContext.Provider>
  );
};
