import { ethers } from 'ethers';
import type { AssetDetails, ListingDetails, KYCData } from '../types';
import type { RWAvenueSDK } from './sdk';
import { RWAvenueSDKImpl } from './sdk.impl';

export class RWAvenueAPI {
  private sdk: RWAvenueSDK;
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor(config: {
    rpcUrl: string;
    tokenAddress: string;
    kycAddress: string;
    marketplaceAddress: string;
  }) {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new ethers.providers.Web3Provider((window as any).ethereum);
      this.signer = this.provider.getSigner();
    }

    // Initialize SDK with contract addresses
    this.sdk = new RWAvenueSDKImpl(
      config.tokenAddress,
      config.kycAddress,
      config.marketplaceAddress,
      this.provider!,
      this.signer!
    );
  }

  // Asset Management
  async createAsset(asset: {
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
  }): Promise<number> {
    try {
      const price = ethers.utils.parseEther(asset.price);
      const pricePerToken = ethers.utils.parseEther(asset.pricePerToken);

      return await this.sdk.createAsset(
        asset.title,
        asset.description,
        asset.category,
        price,
        asset.tokenizationType,
        asset.totalTokens,
        pricePerToken,
        asset.listingType,
        asset.auctionEndTime,
        asset.royaltyReceiver,
        asset.royaltyFraction
      );
    } catch (error) {
      throw new Error(`Failed to create asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAssetDetails(assetId: number): Promise<AssetDetails> {
    try {
      return await this.sdk.getAssetDetails(assetId);
    } catch (error) {
      throw new Error(`Failed to get asset details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Listing Management
  async createListing(listing: {
    assetId: number;
    paymentToken: string;
    price: string;
    tokenAmount: number;
    listingType: number;
    auctionEndTime: number;
  }): Promise<number> {
    try {
      const price = ethers.utils.parseEther(listing.price);

      return await this.sdk.createListing(
        listing.assetId,
        listing.paymentToken,
        price,
        listing.tokenAmount,
        listing.listingType,
        listing.auctionEndTime
      );
    } catch (error) {
      throw new Error(`Failed to create listing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getListingDetails(listingId: number): Promise<ListingDetails> {
    try {
      return await this.sdk.getListingDetails(listingId);
    } catch (error) {
      throw new Error(`Failed to get listing details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async buyListing(listingId: number, value?: string): Promise<void> {
    try {
      const parsedValue = value ? ethers.utils.parseEther(value) : undefined;
      await this.sdk.buyListing(listingId, parsedValue);
    } catch (error) {
      throw new Error(`Failed to buy listing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // KYC Management
  async submitKYC(kyc: {
    governmentId: string;
    proofOfAddress: string;
    additionalDocs: string[];
    nationality: string;
  }): Promise<void> {
    try {
      await this.sdk.submitKYC(
        kyc.governmentId,
        kyc.proofOfAddress,
        kyc.additionalDocs,
        kyc.nationality
      );
    } catch (error) {
      throw new Error(`Failed to submit KYC: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getKYCStatus(address: string): Promise<number> {
    try {
      return await this.sdk.getKYCStatus(address);
    } catch (error) {
      throw new Error(`Failed to get KYC status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getKYCData(address: string): Promise<KYCData> {
    try {
      return await this.sdk.getKYCData(address);
    } catch (error) {
      throw new Error(`Failed to get KYC data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Token Management
  async getTokenBalance(address: string, tokenId: number): Promise<string> {
    try {
      const balance = await this.sdk.balanceOf(address, tokenId);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      throw new Error(`Failed to get token balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async transferToken(
    from: string,
    to: string,
    tokenId: number,
    amount: number,
    data: string = '0x'
  ): Promise<void> {
    try {
      await this.sdk.safeTransferFrom(from, to, tokenId, amount, data);
    } catch (error) {
      throw new Error(`Failed to transfer token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Utility Functions
  async isConnected(): Promise<boolean> {
    return this.provider !== null && this.signer !== null;
  }

  async getConnectedAddress(): Promise<string> {
    if (!this.signer) throw new Error('No signer connected');
    return await this.signer.getAddress();
  }

  async disconnect(): Promise<void> {
    this.provider = null;
    this.signer = null;
  }
}

export default RWAvenueAPI;