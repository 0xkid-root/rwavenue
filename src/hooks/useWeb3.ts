import { useCallback, useEffect, useState } from 'react';
import { RWAvenueSDK, Web3Provider } from '../sdk';

interface UseWeb3Return {
  sdk: RWAvenueSDK | null;
  provider: Web3Provider | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnecting: boolean;
  error: Error | null;
}

export const useWeb3 = (): UseWeb3Return => {
  const [sdk, setSdk] = useState<RWAvenueSDK | null>(null);
  const [provider, setProvider] = useState<Web3Provider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const instance = new RWAvenueSDK();
    setSdk(instance);

    return () => {
      instance.disconnect();
    };
  }, []);

  const connect = useCallback(async () => {
    if (!sdk) return;

    try {
      setIsConnecting(true);
      setError(null);
      const web3Provider = await sdk.connect();
      setProvider(web3Provider);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to connect'));
    } finally {
      setIsConnecting(false);
    }
  }, [sdk]);

  const disconnect = useCallback(() => {
    if (sdk) {
      sdk.disconnect();
      setProvider(null);
    }
  }, [sdk]);

  return {
    sdk,
    provider,
    connect,
    disconnect,
    isConnecting,
    error,
  };
};