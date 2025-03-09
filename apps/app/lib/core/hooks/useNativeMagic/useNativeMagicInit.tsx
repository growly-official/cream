import { useEffect } from 'react';
import { useNativeMagic } from '.';
import { useAccount } from 'wagmi';

export const useNativeMagicInit = () => {
  const {
    mutate: { letsDoSomeMagic },
  } = useNativeMagic();
  const { address } = useAccount();

  useEffect(() => {
    letsDoSomeMagic(address as any);
  }, [address]);
};
