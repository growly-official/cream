import { calculateMultichainTokenPortfolio } from 'chainsmith-sdk/utils';
import { calculateMultichainNFTPortfolio, delayMs, selectState, setState } from '../../utils';
import { BinaryState, StateEvent, ThreeStageState } from '../../types/state.type';
import { useMultichainMagicContext } from './useMultichainMagicContext';
import { TAddress, TChainName } from 'chainsmith-sdk/types';
import { EvmApiService } from '../../services';
import { buildCachePayload, getRevalidatedJsonData } from '../../helpers';
import { useAsyncDispatch } from '..';
import { MULTICHAIN_TOKEN_PORTFOLIO } from '../../constants';

const service = new EvmApiService();

export const MultichainEvent = {
  [StateEvent.ActivityStats]: ThreeStageState,
  [StateEvent.GetAddress]: BinaryState,
  [StateEvent.GetTokenPortfolio]: ThreeStageState,
  [StateEvent.GetNftPortfolio]: ThreeStageState,
  [StateEvent.GetTokenActivity]: ThreeStageState,
  [StateEvent.GetNftActivity]: ThreeStageState,
  [StateEvent.GetTalentScore]: BinaryState,
  [StateEvent.GetMultichainData]: ThreeStageState,
};

export const useMultichainMagic = () => {
  const {
    stateEvents,
    setStateEvents,
    selectedNetworks,
    // Raw
    allTransactions,
    tokenPortfolio,
    nftPortfolio,
    nftActivity,

    // Insights
    chainStats,
    activityStats,
    tokenPortfolioStats,
    totalGasInETH,
    nftPortfolioStats,
    nftActivityStats,
  } = useMultichainMagicContext();

  const { newAsyncDispatch, stateCheck, dispatchStateEvent } = useAsyncDispatch(MultichainEvent, [
    stateEvents,
    setStateEvents,
  ]);

  const getNetworks = () => selectState(selectedNetworks)['evm'] || [];

  const fetchActivityStats = async (addressInput: TAddress) => {
    return newAsyncDispatch(
      StateEvent.ActivityStats,
      {
        onStartEvent: MultichainEvent.ActivityStats.InProgress,
        onErrorEvent: { value: MultichainEvent.ActivityStats.Idle },
        onFinishEvent: {
          value: MultichainEvent.ActivityStats.Finished,
          toast: 'Activity stats fetched.',
        },
        onResetEvent: MultichainEvent.ActivityStats.Idle,
      },
      async () => {
        const stats = await service.fetchActivityStats(addressInput, getNetworks());
        setState(allTransactions)(stats.multichainTxs);
        setState(totalGasInETH)(stats.totalGasInETH);
        setState(activityStats)(stats.activityStats);
        setState(chainStats)(stats.chainStats);
        return stats;
      }
    );
  };

  const fetchMultichainTokenPortfolio = async (addressInput: TAddress, hardRefresh?: boolean) => {
    return newAsyncDispatch(
      StateEvent.GetTokenPortfolio,
      {
        onStartEvent: MultichainEvent.GetTokenPortfolio.InProgress,
        onErrorEvent: {
          value: MultichainEvent.GetTokenPortfolio.Idle,
          toast: 'Failed to fetch multichain token portfolio.',
        },
        onFinishEvent: {
          value: MultichainEvent.GetTokenPortfolio.Finished,
          toast: 'Fetched token portfolio.',
        },
        onResetEvent: MultichainEvent.GetTokenPortfolio.Idle,
      },
      async () => {
        const networks = selectState(selectedNetworks)['evm'] || [];
        const [key, expiration] = MULTICHAIN_TOKEN_PORTFOLIO(addressInput);
        const cachedTokenPortfolio = await getRevalidatedJsonData(
          key,
          async () => {
            const tokenPortfolio = await service.getWalletTokenPortfolio(addressInput, networks);
            return buildCachePayload(tokenPortfolio, expiration);
          },
          {
            forceRefetch: hardRefresh,
          }
        );
        if (cachedTokenPortfolio) {
          setState(tokenPortfolio)(cachedTokenPortfolio);
          const _tokenPortfolioStats = calculateMultichainTokenPortfolio(cachedTokenPortfolio);
          setState(tokenPortfolioStats)(_tokenPortfolioStats);
        }
      }
    );
  };

  const fetchMultichainNftPortfolio = async (addressInput: TAddress) => {
    return newAsyncDispatch(
      StateEvent.GetNftPortfolio,
      {
        onStartEvent: MultichainEvent.GetNftPortfolio.InProgress,
        onErrorEvent: {
          value: MultichainEvent.GetNftPortfolio.Idle,
          toast: 'Failed to fetch NFT portfolio.',
        },
        onFinishEvent: {
          value: MultichainEvent.GetNftPortfolio.Finished,
          toast: 'Fetched NFT portfolio.',
        },
        onResetEvent: MultichainEvent.GetNftPortfolio.Idle,
      },
      async () => {
        const allNftBalances = await service.getMultichainNftCollectibles(
          addressInput,
          getNetworks()
        );
        setState(nftPortfolio)(allNftBalances);

        const _nftPortfolio = calculateMultichainNFTPortfolio(allNftBalances);
        // console.log("_nftPortfolio", _nftPortfolio);
        setState(nftPortfolioStats)(_nftPortfolio);
      }
    );
  };

  const fetchMultichainNftActivity = async (addressInput: TAddress) => {
    return newAsyncDispatch(
      StateEvent.GetNftActivity,
      {
        onStartEvent: MultichainEvent.GetNftActivity.InProgress,
        onErrorEvent: {
          value: MultichainEvent.GetNftActivity.Idle,
          toast: 'Failed to fetch multichain NFT activities.',
        },
        onFinishEvent: {
          value: MultichainEvent.GetNftActivity.Finished,
          toast: 'Fetched NFT activities.',
        },
        onResetEvent: MultichainEvent.GetNftActivity.Idle,
      },
      async () => {
        const activityData = await service.fetchMultichainNftActivity(addressInput, getNetworks());
        setState(nftActivity)(activityData.allNftActivities);
        setState(nftActivityStats)(activityData.nftActivityStats);
      }
    );
  };

  const letsDoSomeMagic = async (
    addressInput: TAddress | undefined,
    networks: TChainName[],
    hardRefresh?: boolean
  ) => {
    await newAsyncDispatch(
      StateEvent.GetMultichainData,
      {
        onStartEvent: MultichainEvent.GetMultichainData.InProgress,
        onErrorEvent: {
          value: MultichainEvent.GetMultichainData.Idle,
          toast: 'Failed to fetch multichain data.',
        },
        onFinishEvent: {
          value: MultichainEvent.GetMultichainData.Finished,
          toast: 'Fetched token portfolio.',
        },
        onResetEvent: MultichainEvent.GetMultichainData.Idle,
      },
      async () => {
        if (networks.length > 0 && addressInput) {
          await fetchMultichainTokenPortfolio(addressInput, hardRefresh);
          await fetchActivityStats(addressInput);
          await fetchMultichainNftPortfolio(addressInput);
          await fetchMultichainNftActivity(addressInput);
          await delayMs(1000);
        }
      }
    );
  };

  return {
    query: {
      fetchActivityStats,
      fetchMultichainTokenPortfolio,
      stateCheck,
    },
    mutate: {
      letsDoSomeMagic,
      dispatchStateEvent,
      newAsyncDispatch,
    },
  };
};
