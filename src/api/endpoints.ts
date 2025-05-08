import { ethers } from 'ethers';
import type { Asset, AssetDetails, ListingDetails, KYCData } from '../types';
import { RWAvenueAPI } from './index';

export class APIEndpoints {
  private api: RWAvenueAPI;

  constructor(api: RWAvenueAPI) {
    this.api = api;
  }

  // Asset Endpoints
  async createAsset(req: {
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
  }): Promise<{ assetId: number }> {
    try {
      const assetId = await this.api.createAsset(req);
      return { assetId };
    } catch (error) {
      throw new Error(`Failed to create asset: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAssetDetails(assetId: number): Promise<AssetDetails> {
    try {
      return await this.api.getAssetDetails(assetId);
    } catch (error) {
      throw new Error(`Failed to get asset details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Listing Endpoints
  async createListing(req: {
    assetId: number;
    paymentToken: string;
    price: string;
    tokenAmount: number;
    listingType: number;
    auctionEndTime: number;
  }): Promise<{ listingId: number }> {
    try {
      const listingId = await this.api.createListing(req);
      return { listingId };
    } catch (error) {
      throw new Error(`Failed to create listing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getListingDetails(listingId: number): Promise<ListingDetails> {
    try {
      return await this.api.getListingDetails(listingId);
    } catch (error) {
      throw new Error(`Failed to get listing details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async buyListing(listingId: number, value?: string): Promise<{ success: boolean }> {
    try {
      await this.api.buyListing(listingId, value);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to buy listing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // KYC Endpoints
  async submitKYC(req: {
    governmentId: string;
    proofOfAddress: string;
    additionalDocs: string[];
    nationality: string;
  }): Promise<{ success: boolean }> {
    try {
      await this.api.submitKYC(req);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to submit KYC: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getKYCStatus(address: string): Promise<{ status: number }> {
    try {
      const status = await this.api.getKYCStatus(address);
      return { status };
    } catch (error) {
      throw new Error(`Failed to get KYC status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getKYCData(address: string): Promise<KYCData> {
    try {
      return await this.api.getKYCData(address);
    } catch (error) {
      throw new Error(`Failed to get KYC data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Token Endpoints
  async getTokenBalance(address: string, tokenId: number): Promise<{ balance: string }> {
    try {
      const balance = await this.api.getTokenBalance(address, tokenId);
      return { balance };
    } catch (error) {
      throw new Error(`Failed to get token balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async transferToken(req: {
    from: string;
    to: string;
    tokenId: number;
    amount: number;
    data?: string;
  }): Promise<{ success: boolean }> {
    try {
      await this.api.transferToken(req.from, req.to, req.tokenId, req.amount, req.data);
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to transfer token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Utility Endpoints
  async getConnectionStatus(): Promise<{ connected: boolean; address?: string }> {
    try {
      const connected = await this.api.isConnected();
      const address = connected ? await this.api.getConnectedAddress() : undefined;
      return { connected, address };
    } catch (error) {
      throw new Error(`Failed to get connection status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async disconnect(): Promise<{ success: boolean }> {
    try {
      await this.api.disconnect();
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default APIEndpoints;