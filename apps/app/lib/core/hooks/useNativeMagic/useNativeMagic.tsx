import { calculateGasInETH, calculateMultichainTokenPortfolio } from 'chainsmith-sdk/utils';
import { toast } from 'react-toastify';
import { delayMs, setState } from '../../utils';
import {
  BinaryState,
  StateEvent,
  StateOption,
  ThreeStageState,
  Toastable,
} from '../../types/state.type';
import { useNativeMagicContext } from './useNativeMagicContext';
import { TActivityStats, TAddress, TChainStats } from 'chainsmith-sdk/types';
import { calculateEVMStreaksAndMetrics } from 'chainsmith-sdk/adapters';
import { SonicChainApiService } from '../../services';
import { buildCachePayload, getRevalidatedJsonData } from '../../helpers';

export const NativeStateSubEvents = {
  [StateEvent.ActivityStats]: ThreeStageState,
  [StateEvent.GetAddress]: BinaryState,
  [StateEvent.GetTokenPortfolio]: ThreeStageState,
  [StateEvent.GetNftPortfolio]: ThreeStageState,
  [StateEvent.GetTokenActivity]: ThreeStageState,
  [StateEvent.GetNftActivity]: ThreeStageState,
  [StateEvent.GetTalentScore]: BinaryState,
};

const service = new SonicChainApiService();

export const useNativeMagic = () => {
  const magicContext = useNativeMagicContext();
  const {
    stateEvents,
    setStateEvents,
    // Raw
    allTransactions,
    tokenPortfolio,

    // Insights
    chainStats,
    activityStats,
    tokenPortfolioStats,
    totalGasInETH,
  } = magicContext;

  const dispatchStateEvent = (eventName: StateEvent, status: StateOption) => {
    setStateEvents(stateEvents => ({ ...stateEvents, [eventName]: status }));
  };

  const stateCheck = (event: keyof typeof StateEvent, option: StateOption): boolean => {
    return stateEvents[event] === (NativeStateSubEvents[event] as any)[option];
  };

  async function newAsyncDispatch<Output>(
    eventName: StateEvent,
    eventHooks: {
      onStartEvent: StateOption;
      onFinishEvent: Toastable<StateOption>;
      onErrorEvent: Toastable<StateOption>;
      onResetEvent: StateOption;
    },
    method: () => Promise<Output>
  ): Promise<Output> {
    dispatchStateEvent(eventName, eventHooks.onResetEvent);
    dispatchStateEvent(eventName, eventHooks.onStartEvent);
    try {
      const data = await method();
      const event = eventHooks.onFinishEvent;
      dispatchStateEvent(eventName, event.value);
      if (event.toast) {
        toast(event.toast, {
          type: 'success',
        });
      }
      return data;
    } catch (error: any) {
      const event = eventHooks.onErrorEvent;
      dispatchStateEvent(eventName, event.value);
      if (event.toast) {
        toast(`${event.toast} - Error: ${error.message}`, {
          type: 'error',
        });
      }
      throw new Error(`${eventName} : ${error.message}`);
    }
  }

  const fetchActivityStats = async (addressInput: TAddress) => {
    return newAsyncDispatch(
      StateEvent.ActivityStats,
      {
        onStartEvent: NativeStateSubEvents.ActivityStats.InProgress,
        onErrorEvent: { value: NativeStateSubEvents.ActivityStats.Idle },
        onFinishEvent: {
          value: NativeStateSubEvents.ActivityStats.Finished,
          toast: 'Activity stats fetched.',
        },
        onResetEvent: NativeStateSubEvents.ActivityStats.Idle,
      },
      async () => {
        const txs = await service.listTokenTransferActivities(addressInput);
        setState(allTransactions)(txs);

        const filteredTransactions = Object.values(txs)
          .flat()
          .filter(tx => tx.from.toLowerCase() === addressInput.toLowerCase());
        const _totalGasInETH = filteredTransactions.reduce(
          (acc, curr) =>
            acc + calculateGasInETH(Number.parseInt(curr.gasUsed), Number.parseInt(curr.gasPrice)),
          0
        );

        setState(totalGasInETH)(_totalGasInETH);

        const _countActiveChainTxs = txs?.length || 0;

        // Get Activity Stats
        let stats: TActivityStats | undefined = undefined;
        if (txs?.length || 0 > 0) {
          stats = calculateEVMStreaksAndMetrics(txs || [], addressInput);
          setState(activityStats)(stats);
        }

        // Get unique active day, on most active chain 🫠
        const { uniqueActiveDays } = calculateEVMStreaksAndMetrics(txs || [], addressInput);

        const _chainStats: TChainStats = {
          totalChains: [],
          mostActiveChainName: 'sonic',
          noActivityChains: [],
          countUniqueDaysActiveChain: uniqueActiveDays,
          countActiveChainTxs: _countActiveChainTxs,
        };
        setState(chainStats)(_chainStats);

        return stats;
      }
    );
  };

  const fetchTokenPortfolio = async (addressInput: TAddress) => {
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

  const letsDoSomeMagic = async (addressInput: TAddress | undefined) => {
    try {
      if (addressInput) {
        await fetchTokenPortfolio(addressInput);
        await fetchActivityStats(addressInput);
        await delayMs(1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    query: {
      fetchActivityStats,
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
