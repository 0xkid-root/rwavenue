import { create } from 'zustand';
import { RWAvenueSDK, Web3Provider } from '../sdk';

interface Web3State {
  sdk: RWAvenueSDK | null;
  provider: Web3Provider | null;
  isConnecting: boolean;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  setError: (error: Error | null) => void;
}

export const useWeb3Store = create<Web3State>((set, get) => ({
  sdk: new RWAvenueSDK(),
  provider: null,
  isConnecting: false,
  error: null,

  connect: async () => {
    const { sdk } = get();
    if (!sdk) return;

    try {
      set({ isConnecting: true, error: null });
      const provider = await sdk.connect();
      set({ provider });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to connect');
      set({ error });
    } finally {
      set({ isConnecting: false });
    }
  },

  disconnect: () => {
    const { sdk } = get();
    if (sdk) {
      sdk.disconnect();
      set({ provider: null });
    }
  },

  setError: (error) => set({ error }),
}));