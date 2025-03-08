import { countExistentialObject, filterObject, getChainByName } from 'chainsmith-sdk/utils';
import { BackgroundChains } from '../../lib/core/chainsmith';
import { ChainIcon } from '../../lib/ui/molecules';
import { useState } from 'react';
import { TMultichain } from 'chainsmith-sdk/types';
import clsx from 'clsx';
import { Button } from '../../lib/ui/atoms';
import { useMultichainMagic } from '../../lib/core/hooks';
import { useAccount } from 'wagmi';

const MultichainOnboarding = () => {
  const { address } = useAccount();
  const {
    mutate: { letsDoSomeMagic },
  } = useMultichainMagic();
  const [currentSelectedNetworks, setCurrentSelectedNetworks] = useState<TMultichain<boolean>>({});

  return (
    <div className="h-[100vh] flex flex-col items-center">
      <h1 className="font-bold text-3xl">Which chains have you experienced on?</h1>
      <p className="mt-5 text-2xl">
        You selected {countExistentialObject(currentSelectedNetworks)} networks
      </p>
      {countExistentialObject(currentSelectedNetworks) > 0 && (
        <Button
          onClick={() => {
            letsDoSomeMagic(address, filterObject(currentSelectedNetworks, item => !!item) as any);
          }}
          className="mt-5 shadow-xl"
          variant="solid"
          color="orange">
          👉 Start your journey on Cream!
        </Button>
      )}
      <div className="flex flex-wrap max-w-[800px] items-center justify-center gap-5 mt-10">
        {BackgroundChains.map(chain => (
          <div
            onClick={() =>
              setCurrentSelectedNetworks({
                ...currentSelectedNetworks,
                [chain]: !currentSelectedNetworks[chain],
              })
            }
            className={clsx(
              'bg-white hover:font-bold shadow-md flex gap-3 rounded-xl rounded-xl py-5 px-7 hover:scale-110 cursor-pointer',
              currentSelectedNetworks[chain] && 'border font-bold border-slate-800'
            )}>
            <ChainIcon chainName={chain} /> {getChainByName(chain).name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultichainOnboarding;
