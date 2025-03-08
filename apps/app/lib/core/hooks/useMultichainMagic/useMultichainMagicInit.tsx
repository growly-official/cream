import { useWallets } from '@privy-io/react-auth';
import { useMultichainMagic } from './useMultichainMagic';
import { useMultichainMagicContext } from './useMultichainMagicContext';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { selectState } from '../../utils';

export const useMultichainMagicInit = () => {
  const { wallets } = useWallets();
  const {
    mutate: { letsDoSomeMagic },
  } = useMultichainMagic();
  const { selectedNetworks } = useMultichainMagicContext();
  const { address } = useAccount();

  useEffect(() => {
    if (wallets.length > 0) {
      letsDoSomeMagic(address);
      // letsDoSomeMagic('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as any);
    }
  }, [address, wallets, selectState(selectedNetworks)]);
};
