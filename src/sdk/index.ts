import { ethers } from 'ethers';
import type { Asset, KYCData, Listing } from '../types';

// Import contract ABIs
// @ts-ignore - JSON imports
import RWAvenueKYCABI from '../contracts/abis/RWAvenueKYC.json';
// @ts-ignore - JSON imports
import RWAvenueMarketplaceABI from '../contracts/abis/RWAvenueMarketplace.json';
// @ts-ignore - JSON imports
import RWAvenueTokenABI from '../contracts/abis/RWAvenueToken.json';
// @ts-ignore - JSON imports
import RWAvenueTokenFactoryABI from '../contracts/abis/RWAvenueTokenFactory.json';

export interface Web3Provider {
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
  address: string;
}

export interface SDKConfig {
  rpcUrl?: string;
  networkId?: number;
  contracts?: {
    marketplace?: string;
    token?: string;
    kyc?: string;
    tokenFactory?: string;
  };
}

export enum AssetStatus {
  Pending = 0,
  Validated = 1,
  Rejected = 2,
  ActionRequired = 3
}

export enum ListingType {
  Fixed = 0,
  Auction = 1,
  Swap = 2
}

export enum TokenizationType {
  Fractional = 0,
  Whole = 1
}

export enum KYCStatus {
  Pending = 0,
  Verified = 1,
  Rejected = 2
}

export enum RiskLevel {
  Low = 0,
  Medium = 1,
  High = 2
}

export class RWAvenueSDK {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private address: string = '';
  private config: SDKConfig;
  private kycContract: ethers.Contract | null = null;
  private marketplaceContract: ethers.Contract | null = null;
  private tokenContract: ethers.Contract | null = null;
  private tokenFactoryContract: ethers.Contract | null = null;

  constructor(config: SDKConfig = {}) {
    this.config = {
      rpcUrl: config.rpcUrl || 'http://localhost:8545',
      networkId: config.networkId || 1,
      contracts: {
        marketplace: config.contracts?.marketplace,
        token: config.contracts?.token,
        kyc: config.contracts?.kyc,
        tokenFactory: config.contracts?.tokenFactory,
      },
    };
  }

  /**
   * Connect to Web3 provider and initialize contracts
   */
  async connect(): Promise<Web3Provider> {
    if (typeof window === 'undefined' || !(window as any).ethereum) {
      throw new Error('Web3 provider not found');
    }

    try {
      // Request account access
      await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.providers.Web3Provider((window as any).ethereum);
      this.signer = this.provider.getSigner();
      this.address = await this.signer.getAddress();

      // Initialize contracts if addresses are provided
      if (this.config.contracts?.kyc) {
        this.kycContract = new ethers.Contract(
          this.config.contracts.kyc,
          RWAvenueKYCABI,
          this.signer
        );
      }

      if (this.config.contracts?.marketplace) {
        this.marketplaceContract = new ethers.Contract(
          this.config.contracts.marketplace,
          RWAvenueMarketplaceABI,
          this.signer
        );
      }

      if (this.config.contracts?.token) {
        this.tokenContract = new ethers.Contract(
          this.config.contracts.token,
          RWAvenueTokenABI,
          this.signer
        );
      }
      
      if (this.config.contracts?.tokenFactory) {
        this.tokenFactoryContract = new ethers.Contract(
          this.config.contracts.tokenFactory,
          RWAvenueTokenFactoryABI,
          this.signer
        );
      }

      return {
        provider: this.provider,
        signer: this.signer,
        address: this.address,
      };
    } catch (error: any) {
      throw new Error(`Failed to connect: ${error.message}`);
    }
  }

  /**
   * Check if specific contracts are initialized
   * This utility method is used throughout the SDK to ensure contracts are available
   * @param contract The contract to check
   * @param contractName The name of the contract for error messages
   * @returns The contract (for TypeScript type narrowing)
   */
  private checkContractAvailability<T extends ethers.Contract>(contract: T | null, contractName: string): T {
    if (!contract) {
      throw new Error(`${contractName} contract not initialized`);
    }
    return contract;
  }

  /**
   * Check if user is connected
   */
  private checkConnected(): void {
    if (!this.provider || !this.signer || !this.address) {
      throw new Error('Not connected to Web3 provider');
    }
  }

  /**
   * Get all assets from the marketplace
   */
  async getAssets(): Promise<Asset[]> {
    this.checkConnected();
    const marketplaceContract = this.checkContractAvailability(this.marketplaceContract, 'Marketplace');

    try {
      // Get the total number of assets
      const assetCount = await marketplaceContract.getAssetCount();
      const assets: Asset[] = [];

      // Fetch each asset
      for (let i = 1; i <= assetCount.toNumber(); i++) {
        const assetDetails = await marketplaceContract.getAssetDetails(i);
        
        const asset: Asset = {
          id: assetDetails.id.toString(),
          owner: assetDetails.owner,
          title: assetDetails.title,
          description: assetDetails.description,
          category: assetDetails.category,
          status: assetDetails.status,
          price: ethers.utils.formatEther(assetDetails.price),
          tokenizationType: assetDetails.tokenizationType,
          totalTokens: assetDetails.totalTokens.toString(),
          availableTokens: assetDetails.availableTokens.toString(),
          pricePerToken: ethers.utils.formatEther(assetDetails.pricePerToken),
          listingType: assetDetails.listingType,
          isVerified: assetDetails.isVerified,
          createdAt: new Date(assetDetails.createdAt.toNumber() * 1000),
          updatedAt: new Date(assetDetails.updatedAt.toNumber() * 1000),
          auctionEndTime: assetDetails.auctionEndTime.toNumber() > 0 
            ? new Date(assetDetails.auctionEndTime.toNumber() * 1000) 
            : undefined,
          royaltyReceiver: assetDetails.royaltyReceiver,
          royaltyFraction: assetDetails.royaltyFraction.toNumber() / 100, // Convert basis points to percentage
        };
        
        assets.push(asset);
      }

      return assets;
    } catch (error: any) {
      throw new Error(`Failed to get assets: ${error.message}`);
    }
  }

  /**
   * Get user's assets
   */
  async getUserAssets(): Promise<Asset[]> {
    this.checkConnected();
    const marketplaceContract = this.checkContractAvailability(this.marketplaceContract, 'Marketplace');

    try {
      const userAssetIds = await marketplaceContract.getUserAssets(this.address);
      const assets: Asset[] = [];

      for (const assetId of userAssetIds) {
        const assetDetails = await marketplaceContract.getAssetDetails(assetId);
        
        const asset: Asset = {
          id: assetDetails.id.toString(),
          owner: assetDetails.owner,
          title: assetDetails.title,
          description: assetDetails.description,
          category: assetDetails.category,
          status: assetDetails.status,
          price: ethers.utils.formatEther(assetDetails.price),
          tokenizationType: assetDetails.tokenizationType,
          totalTokens: assetDetails.totalTokens.toString(),
          availableTokens: assetDetails.availableTokens.toString(),
          pricePerToken: ethers.utils.formatEther(assetDetails.pricePerToken),
          listingType: assetDetails.listingType,
          isVerified: assetDetails.isVerified,
          createdAt: new Date(assetDetails.createdAt.toNumber() * 1000),
          updatedAt: new Date(assetDetails.updatedAt.toNumber() * 1000),
          auctionEndTime: assetDetails.auctionEndTime.toNumber() > 0 
            ? new Date(assetDetails.auctionEndTime.toNumber() * 1000) 
            : undefined,
          royaltyReceiver: assetDetails.royaltyReceiver,
          royaltyFraction: assetDetails.royaltyFraction.toNumber() / 100,
        };
        
        assets.push(asset);
      }

      return assets;
    } catch (error: any) {
      throw new Error(`Failed to get user assets: ${error.message}`);
    }
  }

  /**
   * Get active listings
   */
  async getActiveListings(): Promise<Listing[]> {
    this.checkConnected();
    const marketplaceContract = this.checkContractAvailability(this.marketplaceContract, 'Marketplace');

    try {
      const activeListingIds = await marketplaceContract.getActiveListingIds();
      const listings: Listing[] = [];

      for (const listingId of activeListingIds) {
        const listingDetails = await marketplaceContract.listings(listingId);
        
        const listing: Listing = {
          id: listingDetails.id.toString(),
          assetId: listingDetails.assetId.toString(),
          seller: listingDetails.seller,
          paymentToken: listingDetails.paymentToken,
          price: ethers.utils.formatEther(listingDetails.price),
          tokenAmount: listingDetails.tokenAmount.toString(),
          listingType: listingDetails.listingType,
          active: listingDetails.active,
          createdAt: new Date(listingDetails.createdAt.toNumber() * 1000),
          auctionEndTime: listingDetails.auctionEndTime.toNumber() > 0 
            ? new Date(listingDetails.auctionEndTime.toNumber() * 1000) 
            : undefined,
        };
        
        listings.push(listing);
      }

      return listings;
    } catch (error: any) {
      throw new Error(`Failed to get active listings: ${error.message}`);
    }
  }

  /**
   * Purchase an asset from a fixed price listing
   */
  async purchaseAsset(listingId: string, amount: string = '1'): Promise<string> {
    this.checkConnected();
    const marketplaceContract = this.checkContractAvailability(this.marketplaceContract, 'Marketplace');

    try {
      // Get listing details
      const listing = await marketplaceContract.listings(listingId);
      
      // Check if listing is active
      if (!listing.active) {
        throw new Error('Listing is not active');
      }
      
      // Check if listing is fixed price
      if (listing.listingType !== ListingType.Fixed) {
        throw new Error('Listing is not a fixed price listing');
      }

      // Purchase the asset
      const tx = await marketplaceContract.purchaseListing(
        listingId,
        ethers.utils.parseUnits(amount, 'ether'),
        { value: listing.price.mul(ethers.utils.parseUnits(amount, 'ether')).div(listing.tokenAmount) }
      );
      
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error: any) {
      throw new Error(`Failed to purchase asset: ${error.message}`);
    }
  }

  /**
   * Place a bid on an auction listing
   */
  async placeBid(listingId: string, bidAmount: string): Promise<string> {
    this.checkConnected();
    const marketplaceContract = this.checkContractAvailability(this.marketplaceContract, 'Marketplace');

    try {
      // Get listing details
      const listing = await marketplaceContract.listings(listingId);
      
      // Check if listing is active
      if (!listing.active) {
        throw new Error('Listing is not active');
      }
      
      // Check if listing is an auction
      if (listing.listingType !== ListingType.Auction) {
        throw new Error('Listing is not an auction');
      }
      
      // Check if auction is still active
      const currentTime = Math.floor(Date.now() / 1000);
      if (listing.auctionEndTime.toNumber() <= currentTime) {
        throw new Error('Auction has ended');
      }

      // Place bid
      const tx = await marketplaceContract.placeBid(
        listingId,
        { value: ethers.utils.parseEther(bidAmount) }
      );
      
      const receipt = await tx.wait();
      return receipt.transactionHash;
    } catch (error: any) {
      throw new Error(`Failed to place bid: ${error.message}`);
    }
  }

  /**
   * Create a new asset
   */
  async createAsset(asset: {
    title: string;
    description: string;
    category: string;
    price: string;
    tokenizationType: TokenizationType;
    totalTokens: string;
    pricePerToken: string;
    listingType: ListingType;
    auctionEndTime?: Date;
    royaltyReceiver?: string;
    royaltyFraction?: number;
  }): Promise<string> {
    this.checkConnected();
    const marketplaceContract = this.checkContractAvailability(this.marketplaceContract, 'Marketplace');

    try {
      // Check if user is KYC verified
      const isVerified = await this.isKYCVerified();
      if (!isVerified) {
        throw new Error('User is not KYC verified');
      }

      const auctionEndTime = asset.auctionEndTime 
        ? Math.floor(asset.auctionEndTime.getTime() / 1000) 
        : 0;
      
      const royaltyReceiver = asset.royaltyReceiver || this.address;
      const royaltyFraction = asset.royaltyFraction 
        ? Math.floor(asset.royaltyFraction * 100) // Convert percentage to basis points
        : 0;

      // Create the asset
      const tx = await marketplaceContract.createAsset(
        asset.title,
        asset.description,
        asset.category,
        ethers.utils.parseEther(asset.price),
        asset.tokenizationType,
        ethers.BigNumber.from(asset.totalTokens),
        ethers.utils.parseEther(asset.pricePerToken),
        asset.listingType,
        auctionEndTime,
        royaltyReceiver,
        royaltyFraction
      );
      
      const receipt = await tx.wait();
      
      // Get the asset ID from the event
      const event = receipt.events?.find((e: any) => e.event === 'AssetCreated');
      const assetId = event?.args?.assetId.toString();
      
      return assetId;
    } catch (error: any) {
      throw new Error(`Failed to create asset: ${error.message}`);
    }
  }

  /**
   * Create a listing for an asset
   */
  async listAsset(params: {
    assetId: string;
    paymentToken: string;
    price: string;
    tokenAmount: string;
    listingType: ListingType;
    auctionEndTime?: Date;
  }): Promise<string> {
    this.checkConnected();
    const marketplaceContract = this.checkContractAvailability(this.marketplaceContract, 'Marketplace');

    try {
      const auctionEndTime = params.auctionEndTime 
        ? Math.floor(params.auctionEndTime.getTime() / 1000) 
        : 0;

      // Create the listing
      const tx = await marketplaceContract.createListing(
        params.assetId,
        params.paymentToken,
        ethers.utils.parseEther(params.price),
        ethers.BigNumber.from(params.tokenAmount),
        params.listingType,
        auctionEndTime
      );
      
      const receipt = await tx.wait();
      
      // Get the listing ID from the event
      const event = receipt.events?.find((e: any) => e.event === 'ListingCreated');
      const listingId = event?.args?.listingId.toString();
      
      return listingId;
    } catch (error: any) {
      throw new Error(`Failed to list asset: ${error.message}`);
    }
  }

  /**
   * Cancel a listing
   */
  async cancelListing(listingId: string): Promise<boolean> {
    this.checkConnected();
    const marketplaceContract = this.checkContractAvailability(this.marketplaceContract, 'Marketplace');

    try {
      const tx = await marketplaceContract.cancelListing(listingId);
      await tx.wait();
      return true;
    } catch (error: any) {
      throw new Error(`Failed to cancel listing: ${error.message}`);
    }
  }

  /**
   * Check if user is KYC verified
   */
  async isKYCVerified(): Promise<boolean> {
    this.checkConnected();
    const kycContract = this.checkContractAvailability(this.kycContract, 'KYC');

    try {
      return await kycContract.isVerified(this.address);
    } catch (error: any) {
      throw new Error(`Failed to check KYC status: ${error.message}`);
    }
  }

  /**
   * Get user's KYC data
   */
  async getKYCData(): Promise<KYCData> {
    this.checkConnected();
    const kycContract = this.checkContractAvailability(this.kycContract, 'KYC');

    try {
      const data = await kycContract.getKYCData(this.address);
      
      return {
        user: data.user,
        status: data.status,
        identityId: data.identityId,
        idVerified: data.idVerified,
        addressVerified: data.addressVerified,
        governmentId: data.governmentId,
        proofOfAddress: data.proofOfAddress,
        additionalDocs: data.additionalDocs,
        nationality: data.nationality,
        riskLevel: data.riskLevel,
        verificationDate: data.verificationDate.toNumber() > 0 
          ? new Date(data.verificationDate.toNumber() * 1000) 
          : undefined,
        lastReviewDate: new Date(data.lastReviewDate.toNumber() * 1000),
        verifiedBy: data.verifiedBy,
      };
    } catch (error: any) {
      throw new Error(`Failed to get KYC data: ${error.message}`);
    }
  }

  /**
   * Submit KYC data
   */
  async submitKYC(params: {
    governmentId: string;
    proofOfAddress: string;
    additionalDocs: string[];
    nationality: string;
  }): Promise<boolean> {
    this.checkConnected();
    const kycContract = this.checkContractAvailability(this.kycContract, 'KYC');

    try {
      const tx = await kycContract.submitKYC(
        params.governmentId,
        params.proofOfAddress,
        params.additionalDocs,
        params.nationality
      );
      
      await tx.wait();
      return true;
    } catch (error: any) {
      throw new Error(`Failed to submit KYC: ${error.message}`);
    }
  }

  /**
   * Get token balance
   */
  async getTokenBalance(tokenId: string): Promise<string> {
    this.checkConnected();
    const tokenContract = this.checkContractAvailability(this.tokenContract, 'Token');

    try {
      const balance = await tokenContract.balanceOf(this.address, tokenId);
      return balance.toString();
    } catch (error: any) {
      throw new Error(`Failed to get token balance: ${error.message}`);
    }
  }

  /**
   * Get token URI
   */
  async getTokenURI(tokenId: string): Promise<string> {
    this.checkConnected();
    const tokenContract = this.checkContractAvailability(this.tokenContract, 'Token');

    try {
      return await tokenContract.uri(tokenId);
    } catch (error: any) {
      throw new Error(`Failed to get token URI: ${error.message}`);
    }
  }

  /**
   * Transfer tokens
   */
  async transferTokens(to: string, tokenId: string, amount: string): Promise<boolean> {
    this.checkConnected();
    const tokenContract = this.checkContractAvailability(this.tokenContract, 'Token');
    const kycContract = this.checkContractAvailability(this.kycContract, 'KYC');

    try {
      // Check if recipient is KYC verified
      const isRecipientVerified = await kycContract.isVerified(to);
      if (!isRecipientVerified) {
        throw new Error('Recipient is not KYC verified');
      }

      const tx = await tokenContract.safeTransferFrom(
        this.address,
        to,
        tokenId,
        amount,
        '0x'
      );
      
      await tx.wait();
      return true;
    } catch (error: any) {
      throw new Error(`Failed to transfer tokens: ${error.message}`);
    }
  }

  /**
   * Deploy a new token using the token factory
   */
  async deployToken(params: {
    name: string;
    symbol: string;
    identityRegistry?: string;
    compliance?: string;
  }): Promise<string> {
    this.checkConnected();
    const tokenFactoryContract = this.checkContractAvailability(this.tokenFactoryContract, 'Token factory');

    try {
      const tx = await tokenFactoryContract.deployToken(
        this.address, // Admin address (current connected address)
        params.name,
        params.symbol,
        params.identityRegistry || ethers.constants.AddressZero,
        params.compliance || ethers.constants.AddressZero
      );
      
      const receipt = await tx.wait();
      
      // Get the deployed token address from the event
      const event = receipt.events?.find((e: any) => e.event === 'TokenDeployed');
      const tokenAddress = event?.args?.tokenAddress;
      
      return tokenAddress;
    } catch (error: any) {
      throw new Error(`Failed to deploy token: ${error.message}`);
    }
  }

  /**
   * Get the implementation address used by the token factory
   */
  async getTokenImplementation(): Promise<string> {
    this.checkConnected();
    const tokenFactoryContract = this.checkContractAvailability(this.tokenFactoryContract, 'Token factory');

    try {
      return await tokenFactoryContract.getImplementation();
    } catch (error: any) {
      throw new Error(`Failed to get token implementation: ${error.message}`);
    }
  }

  /**
   * Connect to an existing token contract
   */
  async connectToToken(tokenAddress: string): Promise<void> {
    this.checkConnected();
    
    if (!this.signer) {
      throw new Error('Not connected to Web3 provider');
    }
    
    try {
      this.tokenContract = new ethers.Contract(
        tokenAddress,
        RWAvenueTokenABI,
        this.signer
      );
    } catch (error: any) {
      throw new Error(`Failed to connect to token: ${error.message}`);
    }
  }

  /**
   * Disconnect from Web3 provider
   */
  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.address = '';
    this.kycContract = null;
    this.marketplaceContract = null;
    this.tokenContract = null;
    this.tokenFactoryContract = null;
  }
}

export default RWAvenueSDK;