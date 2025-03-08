import Dashboard from './Dashboard';
import { useAccount } from 'wagmi';
import Connect from './Connect';
import { isValidStorageKey } from '../../lib/core/helpers';
import MultichainOnboarding from './MultichainOnboarding';

const GettingStarted = () => {
  const { isConnected } = useAccount();

  if (!isConnected) return <Connect />;

  if (!isValidStorageKey('')) return <MultichainOnboarding />;

  return <Dashboard />;
};

export default GettingStarted;
