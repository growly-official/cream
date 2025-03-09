import { calculateMultichainTokenPortfolio } from 'chainsmith-sdk/utils';
import { delayMs, setState } from '../../utils';
import { BinaryState, StateEvent, ThreeStageState } from '../../types/state.type';
import { useNativeMagicContext } from './useNativeMagicContext';
import { TAddress } from 'chainsmith-sdk/types';
import { SonicChainApiService } from '../../services';
import { buildCachePayload, getRevalidatedJsonData } from '../../helpers';
import { useAsyncDispatch } from '..';

export const NativeStateSubEvents = {
  [StateEvent.ActivityStats]: ThreeStageState,
  [StateEvent.GetAddress]: BinaryState,
  [StateEvent.GetTokenPortfolio]: ThreeStageState,
  [StateEvent.GetNftPortfolio]: ThreeStageState,
  [StateEvent.GetTokenActivity]: ThreeStageState,
  [StateEvent.GetNftActivity]: ThreeStageState,
  [StateEvent.GetOnchainScore]: ThreeStageState,
};

const service = new SonicChainApiService();

export const useNativeMagic = () => {
  const {
    stateEvents,
    setStateEvents,
    // Raw
    tokenPortfolio,
    sonicPoints,

    // Insights
    tokenPortfolioStats,
  } = useNativeMagicContext();
  const { newAsyncDispatch, stateCheck, dispatchStateEvent } = useAsyncDispatch(
    NativeStateSubEvents,
    [stateEvents, setStateEvents]
  );

  const fetchTokenPortfolio = async (addressInput: TAddress, hardRefresh?: boolean) => {
    return newAsyncDispatch(
      StateEvent.GetTokenPortfolio,
      {
        onStartEvent: NativeStateSubEvents.GetTokenPortfolio.InProgress,
        onErrorEvent: {
          value: NativeStateSubEvents.GetTokenPortfolio.Idle,
          toast: 'Failed to fetch multichain token portfolio.',
        },
        onFinishEvent: {
          value: NativeStateSubEvents.GetTokenPortfolio.Finished,
          toast: 'Fetched token portfolio.',
        },
        onResetEvent: NativeStateSubEvents.GetTokenPortfolio.Idle,
      },
      async () => {
        const cachedTokenPortfolio = await getRevalidatedJsonData(
          `${addressInput}.tokenPortfolio`,
          async () => {
            const tokenPortfolio = await service.getWalletTokenPortfolio(addressInput);
            return buildCachePayload(tokenPortfolio, 1000 * 60 * 60 * 5);
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

  const fetchPoints = async (addressInput: TAddress) => {
    return newAsyncDispatch(
      StateEvent.GetOnchainScore,
      {
        onStartEvent: NativeStateSubEvents.GetOnchainScore.InProgress,
        onErrorEvent: {
          value: NativeStateSubEvents.GetOnchainScore.Idle,
          toast: 'Failed to fetch Sonic points.',
        },
        onFinishEvent: {
          value: NativeStateSubEvents.GetOnchainScore.Finished,
          toast: 'Fetched Sonic points successfully.',
        },
        onResetEvent: NativeStateSubEvents.GetOnchainScore.Idle,
      },
      async () => {
        const points = await service.getPointStats(addressInput);
        setState(sonicPoints)(points);
      }
    );
  };

  const letsDoSomeMagic = async (addressInput: TAddress | undefined, hardRefresh?: boolean) => {
    try {
      if (addressInput) {
        await fetchTokenPortfolio(addressInput, hardRefresh);
        await fetchPoints(addressInput);
        await delayMs(1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    query: {
      fetchTokenPortfolio,
      stateCheck,
    },
    mutate: {
      letsDoSomeMagic,
      dispatchStateEvent,
      newAsyncDispatch,
    },
  };
};
