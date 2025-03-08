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
    // letsDoSomeMagic('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' as any);
  }, [address]);
};
