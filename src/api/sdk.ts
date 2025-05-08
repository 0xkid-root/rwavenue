import { ethers } from 'ethers';
import type { AssetDetails, ListingDetails, KYCData } from '../types';

export interface RWAvenueSDK {
  // Asset Management
  createAsset(
    title: string,
    description: string,
    category: string,
    price: ethers.BigNumber,
    tokenizationType: number,
    totalTokens: number,
    pricePerToken: ethers.BigNumber,
    listingType: number,
    auctionEndTime: number,
    royaltyReceiver: string,
    royaltyFraction: number
  ): Promise<number>;

  getAssetDetails(assetId: number): Promise<AssetDetails>;

  // Listing Management
  createListing(
    assetId: number,
    paymentToken: string,
    price: ethers.BigNumber,
    tokenAmount: number,
    listingType: number,
    auctionEndTime: number
  ): Promise<number>;

  getListingDetails(listingId: number): Promise<ListingDetails>;

  buyListing(listingId: number, value?: ethers.BigNumber): Promise<void>;

  // KYC Management
  submitKYC(
    governmentId: string,
    proofOfAddress: string,
    additionalDocs: string[],
    nationality: string
  ): Promise<void>;

  getKYCStatus(address: string): Promise<number>;

  getKYCData(address: string): Promise<KYCData>;

  // Token Management
  balanceOf(address: string, tokenId: number): Promise<ethers.BigNumber>;

  safeTransferFrom(
    from: string,
    to: string,
    tokenId: number,
    amount: number,
    data?: string
  ): Promise<void>;
}