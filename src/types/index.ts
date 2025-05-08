import { BigNumber } from 'ethers';

// Enums for better type safety and consistency
export enum AssetCategory {
  REAL_ESTATE = 'real-estate',
  ART = 'art',
  WATCHES = 'watches',
  JEWELRY = 'jewelry',
  COLLECTIBLES = 'collectibles',
  VEHICLES = 'vehicles',
  OTHER = 'other'
}

export enum AssetStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  REJECTED = 'rejected',
  ACTION_REQUIRED = 'action_required'
}

export enum ListingType {
  FIXED_PRICE = 0,
  AUCTION = 1,
  SWAP = 2
}

export enum TokenizationType {
  FRACTIONAL = 0,
  WHOLE = 1
}

export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
  VALIDATOR = 'validator',
  ADMIN = 'admin'
}

export enum KYCStatus {
  NOT_SUBMITTED = 0,
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface KYCData {
  governmentId: string; // IPFS URI or hash
  proofOfAddress: string; // IPFS URI or hash
  additionalDocs: string[]; // Additional document URIs
  nationality: string;
  status: KYCStatus;
  verifiedAt: number;
  updatedAt: number;
  rejectionReason?: string;
}

export interface Listing {
  id: number;
  assetId: number;
  seller: string;
  paymentToken: string; // address(0) for ETH
  price: BigNumber;
  tokenAmount: number;
  listingType: ListingType;
  auctionEndTime: number;
  status: ListingStatus;
  createdAt: number;
  updatedAt: number;
}

export interface ListingDetails extends Listing {
  asset: AssetDetails;
  highestBid?: BigNumber;
  highestBidder?: string;
}

export enum ListingStatus {
  ACTIVE = 0,
  SOLD = 1,
  CANCELLED = 2,
  EXPIRED = 3
}

export interface Asset {
  id: number;
  title: string;
  description: string;
  category: AssetCategory;
  price: BigNumber;
  tokenizationType: TokenizationType;
  totalTokens: number;
  pricePerToken: BigNumber;
  listingType: ListingType;
  auctionEndTime: number;
  royaltyReceiver: string;
  royaltyFraction: number;
  creator: string;
  status: AssetStatus;
  createdAt: number;
  updatedAt: number;
}

export interface AssetDetails extends Asset {
  currentOwner: string;
  totalSupply: BigNumber;
  availableSupply: BigNumber;
  isListed: boolean;
  currentListingId?: number;
}

// Event Types
export interface AssetEvent {
  assetId: number;
  eventType: AssetEventType;
  from: string;
  to: string;
  amount: BigNumber;
  timestamp: number;
}

export enum AssetEventType {
  CREATED = 'CREATED',
  TRANSFER = 'TRANSFER',
  LISTED = 'LISTED',
  SOLD = 'SOLD',
  DELISTED = 'DELISTED'
}

// Transaction Types
export interface TransactionResponse {
  hash: string;
  confirmations: number;
  from: string;
  to: string;
  value: BigNumber;
  timestamp: number;
}

export interface TransactionReceipt {
  status: boolean;
  transactionHash: string;
  blockNumber: number;
  gasUsed: BigNumber;
}

// Configuration Types
export interface RWAvenueConfig {
  rpcUrl: string;
  tokenAddress: string;
  kycAddress: string;
  marketplaceAddress: string;
}

// Document Types
export enum DocumentType {
  TITLE_DEED = 'title_deed',
  CERTIFICATE = 'certificate',
  VALUATION_REPORT = 'valuation_report',
  OTHER = 'other'
}

export interface AssetDocument {
  id: string;
  type: DocumentType;
  uri: string; // IPFS URI
  file?: File; // For file upload operations
  description?: string;
  name: string;
  verified: boolean;
  uploadedAt: number;
  verifiedAt?: number;
  verifiedBy?: string;
}

// Validation Types
export interface AssetValidation {
  status: AssetStatus;
  validatedBy?: string;
  validatedAt?: number;
  comments?: string;
  documents?: AssetDocument[];
  riskLevel?: RiskLevel;
}

// Bid Types
export interface Bid {
  listingId: number;
  bidder: string;
  amount: BigNumber;
  timestamp: number;
  status: BidStatus;
  transactionHash?: string;
}

export enum BidStatus {
  ACTIVE = 'active',
  WON = 'won',
  LOST = 'lost',
  CANCELLED = 'cancelled'
}
export interface Review {
  targetId: string; // User or Asset ID being reviewed
  type: 'user' | 'asset';
  rating: number;
  comment: string;
  createdAt: Date;
  helpful: number;
  reported: boolean;
}

export interface Filter {
  category?: AssetCategory;
  priceRange?: [number, number];
  verifiedOnly: boolean;
  sort: 'newest' | 'price-low-high' | 'price-high-low' | 'ending-soon';
}

export type { Transaction, TransactionType } from './transaction';

export interface AssetFilter {
  category?: AssetCategory;
  priceRange?: [number, number];
  location?: string;
  listingType?: ListingType;
  tokenizationType?: TokenizationType;
  status?: AssetStatus;
  verified?: boolean;
}

export interface SortOption {
  field: 'price' | 'createdAt' | 'popularity' | 'endTime';
  direction: 'asc' | 'desc';
}