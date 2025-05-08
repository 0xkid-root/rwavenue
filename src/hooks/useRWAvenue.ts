import { useState, useEffect } from 'react';
import { RWAvenueAPI } from '../api';
import type { AssetDetails, ListingDetails, KYCData } from '../types';

export interface UseRWAvenueConfig {
  rpcUrl: string;
  tokenAddress: string;
  kycAddress: string;
  marketplaceAddress: string;
}

export function useRWAvenue(config: UseRWAvenueConfig) {
  const [api, setApi] = useState<RWAvenueAPI | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApi = () => {
      try {
        const rwApi = new RWAvenueAPI(config);
        setApi(rwApi);
      } catch (err) {
        setError(`Failed to initialize API: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    initializeApi();
  }, [config]);

  useEffect(() => {
    const checkConnection = async () => {
      if (!api) return;
      try {
        const connected = await api.isConnected();
        setIsConnected(connected);
        if (connected) {
          const addr = await api.getConnectedAddress();
          setAddress(addr);
        }
      } catch (err) {
        setError(`Connection check failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    checkConnection();
  }, [api]);

  const createAsset = async (asset: {
    title: string;
    description: string;
    category: string;
    price: string;
    tokenizationType: number;
    totalTokens: number;
    pricePerToken: string;
    listingType: number;
    auctionEndTime: number;
    royaltyReceiver: string;
    royaltyFraction: number;
  }) => {
    if (!api) throw new Error('API not initialized');
    setLoading(true);
    setError(null);
    try {
      return await api.createAsset(asset);
    } catch (err) {
      setError(`Failed to create asset: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAssetDetails = async (assetId: number): Promise<AssetDetails> => {
    if (!api) throw new Error('API not initialized');
    setLoading(true);
    setError(null);
    try {
      return await api.getAssetDetails(assetId);
    } catch (err) {
      setError(`Failed to get asset details: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createListing = async (listing: {
    assetId: number;
    paymentToken: string;
    price: string;
    tokenAmount: number;
    listingType: number;
    auctionEndTime: number;
  }) => {
    if (!api) throw new Error('API not initialized');
    setLoading(true);
    setError(null);
    try {
      return await api.createListing(listing);
    } catch (err) {
      setError(`Failed to create listing: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getListingDetails = async (listingId: number): Promise<ListingDetails> => {
    if (!api) throw new Error('API not initialized');
    setLoading(true);
    setError(null);
    try {
      return await api.getListingDetails(listingId);
    } catch (err) {
      setError(`Failed to get listing details: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buyListing = async (listingId: number, value?: string) => {
    if (!api) throw new Error('API not initialized');
    setLoading(true);
    setError(null);
    try {
      await api.buyListing(listingId, value);
    } catch (err) {
      setError(`Failed to buy listing: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submitKYC = async (kyc: {
    governmentId: string;
    proofOfAddress: string;
    additionalDocs: string[];
    nationality: string;
  }) => {
    if (!api) throw new Error('API not initialized');
    setLoading(true);
    setError(null);
    try {
      await api.submitKYC(kyc);
    } catch (err) {
      setError(`Failed to submit KYC: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getKYCStatus = async (address: string): Promise<number> => {
    if (!api) throw new Error('API not initialized');
    setLoading(true);
    setError(null);
    try {
      return await api.getKYCStatus(address);
    } catch (err) {
      setError(`Failed to get KYC status: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getKYCData = async (address: string): Promise<KYCData> => {
    if (!api) throw new Error('API not initialized');
    setLoading(true);
    setError(null);
    try {
      return await api.getKYCData(address);
    } catch (err) {
      setError(`Failed to get KYC data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTokenBalance = async (address: string, tokenId: number): Promise<string> => {
    if (!api) throw new Error('API not initialized');
    setLoading(true);
    setError(null);
    try {
      return await api.getTokenBalance(address, tokenId);
    } catch (err) {
      setError(`Failed to get token balance: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const transferToken = async (
    from: string,
    to: string,
    tokenId: number,
    amount: number,
    data: string = '0x'
  ) => {
    if (!api) throw new Error('API not initialized');
    setLoading(true);
    setError(null);
    try {
      await api.transferToken(from, to, tokenId, amount, data);
    } catch (err) {
      setError(`Failed to transfer token: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnect = async () => {
    if (!api) return;
    try {
      await api.disconnect();
      setIsConnected(false);
      setAddress(null);
    } catch (err) {
      setError(`Failed to disconnect: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return {
    isConnected,
    address,
    loading,
    error,
    createAsset,
    getAssetDetails,
    createListing,
    getListingDetails,
    buyListing,
    submitKYC,
    getKYCStatus,
    getKYCData,
    getTokenBalance,
    transferToken,
    disconnect
  };
}