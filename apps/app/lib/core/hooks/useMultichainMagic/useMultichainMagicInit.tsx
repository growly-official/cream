import { useMultichainMagic } from './useMultichainMagic';
import { useMultichainMagicContext } from './useMultichainMagicContext';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { selectState } from '../../utils';
import { BackgroundChains } from '../../chainsmith';

export const useMultichainMagicInit = () => {
  const {
    mutate: { letsDoSomeMagic },
  } = useMultichainMagic();
  const { selectedNetworks } = useMultichainMagicContext();
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      letsDoSomeMagic(address, BackgroundChains);
    }
  }, [address, selectState(selectedNetworks)]);
};
