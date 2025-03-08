import Dashboard from './Dashboard';
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const GettingStarted = () => {
  const { isConnected } = useAccount();
  return (
    <React.Fragment>
      {!isConnected ? (
        <div className="h-[80vh] flex flex-col justify-center">
          <div className="py-3 px-4 rounded-[50px] flex flex-col max-w-[500px] w-full bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg">
            <div className="py-7 px-7 rounded-[50px] flex flex-col justify-center items-center gap-4 shadow-xl w-full min-h-[400px] bg-white">
              <img src="/logo.png" width={100} className="rounded-[20px] shadow-xl" />
              <h1 className="font-bold text-2xl mt-5 mb-1">Cream</h1>
              <p className="mb-4 text-center">Manage your onchain portfolio smarter with AI!</p>
              <ConnectButton
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <Dashboard />
      )}
    </React.Fragment>
  );
};

export default GettingStarted;
