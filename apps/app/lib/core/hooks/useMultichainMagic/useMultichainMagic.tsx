import { calculateGasInETH, calculateMultichainTokenPortfolio } from 'chainsmith-sdk/utils';
import { toast } from 'react-toastify';
import { delayMs, selectState, setState } from '../../utils';
import {
  BinaryState,
  StateEvent,
  StateOption,
  ThreeStageState,
  Toastable,
} from '../../types/state.type';
import { useMultichainMagicContext } from './useMultichainMagicContext';
import {
  TActivityStats,
  TAddress,
  TChainName,
  TChainStats,
  TMultichain,
} from 'chainsmith-sdk/types';
import { calculateEVMStreaksAndMetrics } from 'chainsmith-sdk/adapters';
import { EvmApiService } from '../../services';
import { buildCachePayload, getRevalidatedJsonData } from '../../helpers';

export const MultichainStateSubEvents = {
  [StateEvent.ActivityStats]: ThreeStageState,
  [StateEvent.GetAddress]: BinaryState,
  [StateEvent.GetTokenPortfolio]: ThreeStageState,
  [StateEvent.GetNftPortfolio]: ThreeStageState,
  [StateEvent.GetTokenActivity]: ThreeStageState,
  [StateEvent.GetNftActivity]: ThreeStageState,
  [StateEvent.GetTalentScore]: BinaryState,
};

export const useMultichainMagic = () => {
  const magicContext = useMultichainMagicContext();
  const {
    stateEvents,
    setStateEvents,
    selectedNetworks,
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
    return stateEvents[event] === (MultichainStateSubEvents[event] as any)[option];
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
        onStartEvent: MultichainStateSubEvents.ActivityStats.InProgress,
        onErrorEvent: { value: MultichainStateSubEvents.ActivityStats.Idle },
        onFinishEvent: {
          value: MultichainStateSubEvents.ActivityStats.Finished,
          toast: 'Activity stats fetched.',
        },
        onResetEvent: MultichainStateSubEvents.ActivityStats.Idle,
      },
      async () => {
        const multichainTxs = await new EvmApiService().listMultichainTokenTransferActivities(
          addressInput,
          selectState(selectedNetworks)['evm'] || []
        );
        setState(allTransactions)(multichainTxs);

        const totalChains: TChainName[] = Object.keys(multichainTxs) as TChainName[];
        const filteredTransactions = Object.values(multichainTxs)
          .flat()
          .filter(tx => tx.from.toLowerCase() === addressInput.toLowerCase());
        const _totalGasInETH = filteredTransactions.reduce(
          (acc, curr) =>
            acc + calculateGasInETH(Number.parseInt(curr.gasUsed), Number.parseInt(curr.gasPrice)),
          0
        );

        // console.log("_totalGasInETH:", _totalGasInETH);
        setState(totalGasInETH)(_totalGasInETH);

        let mostActiveChainName: TChainName = totalChains.reduce((a, b) =>
          (multichainTxs[a]?.length || 0) > (multichainTxs[b]?.length || 0) ? a : b
        );

        // Default chain should be 'Base'
        if (multichainTxs[mostActiveChainName]?.length === 0) mostActiveChainName = 'base';

        const _countActiveChainTxs = multichainTxs[mostActiveChainName]?.length || 0;

        // Get Activity Stats
        const stats: TMultichain<TActivityStats> = {};
        for (const chain of totalChains) {
          const chainTxs = multichainTxs[chain];
          if (chainTxs?.length || 0 > 0) {
            stats[chain] = calculateEVMStreaksAndMetrics(chainTxs || [], addressInput);
          }
        }
        setState(activityStats)(stats);

        // Get chain stats
        const noActivityChains = totalChains.filter(
          chain => multichainTxs[chain]?.length || 0 === 0
        );
        // Get unique active day, on most active chain 🫠
        const { uniqueActiveDays } = calculateEVMStreaksAndMetrics(
          multichainTxs[mostActiveChainName] || [],
          addressInput
        );

        const _chainStats: TChainStats = {
          totalChains,
          mostActiveChainName,
          noActivityChains,
          countUniqueDaysActiveChain: uniqueActiveDays,
          countActiveChainTxs: _countActiveChainTxs,
        };
        setState(chainStats)(_chainStats);

        return stats;
      }
    );
  };

  const fetchMultichainTokenPortfolio = async (addressInput: TAddress, hardRefresh?: boolean) => {
    return newAsyncDispatch(
      StateEvent.GetTokenPortfolio,
      {
        onStartEvent: MultichainStateSubEvents.GetTokenPortfolio.InProgress,
        onErrorEvent: {
          value: MultichainStateSubEvents.GetTokenPortfolio.Idle,
          toast: 'Failed to fetch multichain token portfolio.',
        },
        onFinishEvent: {
          value: MultichainStateSubEvents.GetTokenPortfolio.Finished,
          toast: 'Fetched token portfolio.',
        },
        onResetEvent: MultichainStateSubEvents.GetTokenPortfolio.Idle,
      },
      async () => {
        const cachedTokenPortfolio = await getRevalidatedJsonData(
          `${addressInput}.multichainTokenPortfolio`,
          async () => {
            const tokenPortfolio = await new EvmApiService().getWalletTokenPortfolio(
              addressInput,
              selectState(selectedNetworks)['evm'] || []
            );
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

  const letsDoSomeMagic = async (addressInput: TAddress | undefined, hardRefresh?: boolean) => {
    try {
      const networks = Object.values(selectState(selectedNetworks)).flat();
      if (networks.length > 0 && addressInput) {
        await fetchMultichainTokenPortfolio(addressInput, hardRefresh);
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
