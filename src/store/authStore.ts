import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ethers } from 'ethers';

interface KYCData {
  status: 'pending' | 'verified' | 'rejected';
  idVerified: boolean;
  addressVerified: boolean;
  documents: {
    governmentId?: string;
    proofOfAddress?: string;
    additionalDocs?: string[];
  };
  verificationDate?: Date;
}

interface WalletData {
  address: string;
  isConnected: boolean;
  provider?: string;
  chainId?: number;
  balance?: string;
}

interface User {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  preferences?: {
    assetCategories: string[];
    notifications: boolean;
    language: string;
  };
  kyc?: KYCData;
  wallet?: WalletData;
  roles: {
    isBuyer: boolean;
    isSeller: boolean;
  };
  stats: {
    buyerRating?: number;
    sellerRating?: number;
    totalPurchases: number;
    totalSales: number;
  };
  bankAccount?: {
    isVerified: boolean;
    last4: string;
    type: string;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  submitKYC: (documents: KYCData['documents']) => Promise<void>;
  updateKYCStatus: (status: KYCData['status']) => Promise<void>;
  toggleRole: (role: 'buyer' | 'seller', enabled: boolean) => Promise<void>;
  connectBankAccount: (accountDetails: any) => Promise<void>;
  clearError: () => void; // Added clearError to the interface
}

const mockUsers = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'password123',
    name: 'Demo User',
    roles: {
      isBuyer: true,
      isSeller: false,
    },
    stats: {
      totalPurchases: 0,
      totalSales: 0,
    },
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const user = mockUsers.find(
            (u) => u.email === email && u.password === password
          );
          if (!user) {
            throw new Error('Invalid email or password');
          }
          const { password: _, ...userData } = user;
          set({
            isAuthenticated: true,
            user: userData as User,
            loading: false,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            loading: false,
          });
        }
      },

      register: async (email: string, password: string, name: string) => {
        try {
          set({ loading: true, error: null });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const newUser = {
            id: crypto.randomUUID(),
            email,
            name,
            roles: {
              isBuyer: true,
              isSeller: false,
            },
            stats: {
              totalPurchases: 0,
              totalSales: 0,
            },
          };
          set({
            isAuthenticated: true,
            user: newUser,
            loading: false,
          });
        } catch (error) {
          set({
            error: (error as Error).message,
            loading: false,
          });
        }
      },

      logout: async () => {
        try {
          console.log('Starting logout process...');
          set({ loading: true, error: null });
          const currentUser = get().user;
          if (currentUser?.wallet?.isConnected) {
            console.log('Wallet connected, disconnecting...');
            await get().disconnectWallet();
          } else {
            console.log('No wallet connected, clearing state...');
            set({
              isAuthenticated: false,
              user: null,
              error: null,
              loading: false,
            });
            localStorage.removeItem('auth-storage');
            sessionStorage.clear();
            console.log('State cleared, redirecting to /');
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Logout error:', error);
          set({
            error: (error as Error).message,
            loading: false,
          });
        }
      },

      resetPassword: async (email: string) => {
        try {
          set({ loading: true, error: null });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ loading: false });
        } catch (error) {
          set({
            error: (error as Error).message,
            loading: false,
          });
        }
      },

      updateProfile: async (updates: Partial<User>) => {
        try {
          set({ loading: true, error: null });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set((state) => ({
            user: state.user ? { ...state.user, ...updates } : null,
            loading: false,
          }));
        } catch (error) {
          set({
            error: (error as Error).message,
            loading: false,
          });
        }
      },

      connectWallet: async () => {
        try {
          set({ loading: true, error: null });
      
          if (!(window as any).ethereum) {
            throw new Error('Please install MetaMask or another Web3 wallet.');
          }
      
          const provider = new ethers.providers.Web3Provider((window as any).ethereum);
          const network = await provider.getNetwork();
      
          // Check if the current network is Pharos Devnet (Chain ID 50002)
          const PHAROS_DEVNET_CHAIN_ID = 50002;
          if (network.chainId !== PHAROS_DEVNET_CHAIN_ID) {
            try {
              await (window as any).ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ethers.utils.hexlify(PHAROS_DEVNET_CHAIN_ID) }],
              });
            } catch (switchError) {
              if ((switchError as any).code === 4902) {
                // Chain not added, add Pharos Devnet
                await (window as any).ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: ethers.utils.hexlify(PHAROS_DEVNET_CHAIN_ID),
                      chainName: 'Pharos Devnet',
                      rpcUrls: ['https://devnet.dplabs-internal.com'],
                      nativeCurrency: {
                        name: 'Pharos',
                        symbol: 'pharos',
                        decimals: 18,
                      },
                      blockExplorerUrls: ['https://pharosscan.xyz'],
                    },
                  ],
                });
              } else {
                throw new Error('Failed to switch to Pharos Devnet. Please switch manually.');
              }
            }
          }
      
          // Request accounts after ensuring the correct network
          const accounts = await provider.send('eth_requestAccounts', []);
          const address = accounts[0];
      
          // Fetch balance (with timeout to handle potential RPC delays)
          const balance = await Promise.race([
            provider.getBalance(address),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Timeout fetching balance')), 5000)
            ),
          ]);
          const formattedBalance = ethers.utils.formatEther(balance);
      
          const userId = crypto.randomUUID();
          const newUser = {
            id: userId,
            wallet: {
              address,
              isConnected: true,
              provider: 'metamask',
              chainId: Number(network.chainId),
              balance: formattedBalance,
            },
            roles: {
              isBuyer: true,
              isSeller: false,
            },
            stats: {
              totalPurchases: 0,
              totalSales: 0,
            },
          };
      
          // Set up event listeners
          (window as any).ethereum.removeAllListeners('accountsChanged'); // Avoid duplicate listeners
          (window as any).ethereum.removeAllListeners('chainChanged');
      
          (window as any).ethereum.on('accountsChanged', async (accounts: string[]) => {
            if (accounts.length === 0) {
              await get().disconnectWallet();
            } else {
              // Avoid recursive calls by checking current state
              const currentState = get();
              if (!currentState.isAuthenticated || currentState.user?.wallet?.address !== accounts[0]) {
                await get().connectWallet();
              }
            }
          });
      
          (window as any).ethereum.on('chainChanged', async () => {
            // Refresh connection instead of full reload
            await get().connectWallet();
          });
      
          set({
            isAuthenticated: true,
            user: newUser,
            loading: false,
          });
        } catch (error) {
          let errorMessage = 'Failed to connect wallet. Please try again.';
          if (error instanceof Error) {
            if (error.message.includes('user rejected')) {
              errorMessage = 'Wallet connection was rejected.';
            } else if (error.message.includes('MetaMask')) {
              errorMessage = 'Please install MetaMask to continue.';
            } else if (error.message.includes('switch') || error.message.includes('chain')) {
              errorMessage = 'Please switch to Pharos Devnet manually in MetaMask.';
            } else if (error.message.includes('timeout')) {
              errorMessage = 'Timeout connecting to Pharos Devnet. Check your internet or RPC.';
            }
          }
          set({
            error: errorMessage,
            loading: false,
          });
        }
      },
      
      disconnectWallet: async () => {
        try {
          set({ loading: true, error: null });
          if ((window as any).ethereum) {
            (window as any).ethereum.removeAllListeners('accountsChanged');
            (window as any).ethereum.removeAllListeners('chainChanged');
          }
          set({
            isAuthenticated: false,
            user: null,
            loading: false,
            error: null,
          });
          localStorage.removeItem('auth-storage');
          sessionStorage.clear();
          window.location.href = '/';
        } catch (error) {
          set({
            error: (error as Error).message,
            loading: false,
          });
        }
      },

      submitKYC: async (documents: KYCData['documents']) => {
        try {
          set({ loading: true, error: null });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  kyc: {
                    status: 'pending',
                    idVerified: false,
                    addressVerified: false,
                    documents,
                    verificationDate: new Date(),
                  },
                }
              : null,
            loading: false,
          }));
        } catch (error) {
          set({
            error: (error as Error).message,
            loading: false,
          });
        }
      },

      updateKYCStatus: async (status: KYCData['status']) => {
        try {
          set({ loading: true, error: null });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set((state) => ({
            user: state.user && state.user.kyc
              ? {
                  ...state.user,
                  kyc: {
                    ...state.user.kyc,
                    status,
                    idVerified: status === 'verified',
                    addressVerified: status === 'verified',
                  },
                }
              : null,
            loading: false,
          }));
        } catch (error) {
          set({
            error: (error as Error).message,
            loading: false,
          });
        }
      },

      toggleRole: async (role: 'buyer' | 'seller', enabled: boolean) => {
        try {
          set({ loading: true, error: null });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  roles: {
                    ...state.user.roles,
                    [role === 'buyer' ? 'isBuyer' : 'isSeller']: enabled,
                  },
                }
              : null,
            loading: false,
          }));
        } catch (error) {
          set({
            error: (error as Error).message,
            loading: false,
          });
        }
      },

      connectBankAccount: async (accountDetails: any) => {
        try {
          set({ loading: true, error: null });
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  bankAccount: {
                    isVerified: true,
                    last4: accountDetails.last4,
                    type: accountDetails.type,
                  },
                }
              : null,
            loading: false,
          }));
        } catch (error) {
          set({
            error: (error as Error).message,
            loading: false,
          });
        }
      },

      clearError: () => set({ error: null }), // Implementation of clearError
    }),
    {
      name: 'auth-storage',
    }
  )
);