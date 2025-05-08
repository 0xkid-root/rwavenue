import { ethers } from 'ethers';
import type { AssetDetails, ListingDetails, KYCData } from '../types';
import type { RWAvenueSDK } from './sdk';

export class RWAvenueSDKImpl implements RWAvenueSDK {
  private tokenContract: ethers.Contract;
  private kycContract: ethers.Contract;
  private marketplaceContract: ethers.Contract;

  constructor(
    tokenAddress: string,
    kycAddress: string,
    marketplaceAddress: string,
    provider: ethers.providers.Web3Provider,
    signer: ethers.Signer
  ) {
    // Initialize contracts with addresses and ABI
    this.tokenContract = new ethers.Contract(tokenAddress, [], signer);
    this.kycContract = new ethers.Contract(kycAddress, [], signer);
    this.marketplaceContract = new ethers.Contract(marketplaceAddress, [], signer);
  }

  async createAsset(
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
  ): Promise<number> {
    const tx = await this.marketplaceContract.createAsset(
      title,
      description,
      category,
      price,
      tokenizationType,
      totalTokens,
      pricePerToken,
      listingType,
      auctionEndTime,
      royaltyReceiver,
      royaltyFraction
    );
    const receipt = await tx.wait();
    // Extract assetId from event logs
    return 0; // Placeholder
  }

  async getAssetDetails(assetId: number): Promise<AssetDetails> {
    const details = await this.marketplaceContract.getAssetDetails(assetId);
    return details;
  }

  async createListing(
    assetId: number,
    paymentToken: string,
    price: ethers.BigNumber,
    tokenAmount: number,
    listingType: number,
    auctionEndTime: number
  ): Promise<number> {
    const tx = await this.marketplaceContract.createListing(
      assetId,
      paymentToken,
      price,
      tokenAmount,
      listingType,
      auctionEndTime
    );
    const receipt = await tx.wait();
    // Extract listingId from event logs
    return 0; // Placeholder
  }

  async getListingDetails(listingId: number): Promise<ListingDetails> {
    const details = await this.marketplaceContract.getListingDetails(listingId);
    return details;
  }

  async buyListing(listingId: number, value?: ethers.BigNumber): Promise<void> {
    const tx = await this.marketplaceContract.buyListing(listingId, { value });
    await tx.wait();
  }

  async submitKYC(
    governmentId: string,
    proofOfAddress: string,
    additionalDocs: string[],
    nationality: string
  ): Promise<void> {
    const tx = await this.kycContract.submitKYC(governmentId, proofOfAddress, additionalDocs, nationality);
    await tx.wait();
  }

  async getKYCStatus(address: string): Promise<number> {
    return await this.kycContract.getKYCStatus(address);
  }

  async getKYCData(address: string): Promise<KYCData> {
    const data = await this.kycContract.getKYCData(address);
    return data;
  }

  async balanceOf(address: string, tokenId: number): Promise<ethers.BigNumber> {
    return await this.tokenContract.balanceOf(address, tokenId);
  }

  async safeTransferFrom(
    from: string,
    to: string,
    tokenId: number,
    amount: number,
    data: string = '0x'
  ): Promise<void> {
    const tx = await this.tokenContract.safeTransferFrom(from, to, tokenId, amount, data);
    await tx.wait();
  }
}