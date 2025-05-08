import React, { createContext, useContext, ReactNode } from 'react';
import { useRWAvenue, UseRWAvenueConfig } from '../hooks/useRWAvenue';
import type { AssetDetails, ListingDetails, KYCData } from '../types';

interface RWAvenueContextType {
  isConnected: boolean;
  address: string | null;
  loading: boolean;
  error: string | null;
  createAsset: (asset: {
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
  }) => Promise<number>;
  getAssetDetails: (assetId: number) => Promise<AssetDetails>;
  createListing: (listing: {
    assetId: number;
    paymentToken: string;
    price: string;
    tokenAmount: number;
    listingType: number;
    auctionEndTime: number;
  }) => Promise<number>;
  getListingDetails: (listingId: number) => Promise<ListingDetails>;
  buyListing: (listingId: number, value?: string) => Promise<void>;
  submitKYC: (kyc: {
    governmentId: string;
    proofOfAddress: string;
    additionalDocs: string[];
    nationality: string;
  }) => Promise<void>;
  getKYCStatus: (address: string) => Promise<number>;
  getKYCData: (address: string) => Promise<KYCData>;
  getTokenBalance: (address: string, tokenId: number) => Promise<string>;
  transferToken: (
    from: string,
    to: string,
    tokenId: number,
    amount: number,
    data?: string
  ) => Promise<void>;
  disconnect: () => Promise<void>;
}

const RWAvenueContext = createContext<RWAvenueContextType | null>(null);

export function RWAvenueProvider({
  config,
  children
}: {
  config: UseRWAvenueConfig;
  children: ReactNode;
}) {
  const rwAvenue = useRWAvenue(config);

  return (
    <RWAvenueContext.Provider value={rwAvenue}>
      {children}
    </RWAvenueContext.Provider>
  );
}

export function useRWAvenueContext() {
  const context = useContext(RWAvenueContext);
  if (!context) {
    throw new Error('useRWAvenueContext must be used within a RWAvenueProvider');
  }
  return context;
}