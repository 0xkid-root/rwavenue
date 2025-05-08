import { AssetCategory, Asset, Transaction } from './index';

export interface InvestorProfile {
  id: string;
  userId: string;
  investmentPreferences: {
    categories: AssetCategory[];
    minInvestment?: number;
    maxInvestment?: number;
    preferredCurrencies: string[];
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    investmentHorizon: 'short' | 'medium' | 'long';
  };
  accreditationStatus: {
    isAccredited: boolean;
    verifiedAt?: Date;
    expiresAt?: Date;
    documents: {
      type: string;
      url: string;
      verifiedAt: Date;
    }[];
  };
  portfolio: {
    totalValue: number;
    totalInvested: number;
    totalReturns: number;
    assetAllocation: {
      category: AssetCategory;
      percentage: number;
      value: number;
    }[];
  };
}

export interface Investment {
  id: string;
  assetId: string;
  investorId: string;
  amount: {
    invested: number;
    currentValue: number;
    currency: string;
  };
  tokens: {
    owned: number;
    percentage: number;
  };
  transactions: Transaction[];
  performance: {
    roi: number;
    unrealizedGains: number;
    realizedGains: number;
  };
  status: 'active' | 'exited' | 'pending';
  investedAt: Date;
  exitedAt?: Date;
}

export interface InvestmentOpportunity {
  id: string;
  assetId: string;
  type: 'primary' | 'secondary';
  availableTokens: number;
  pricePerToken: number;
  minPurchase: number;
  currency: string;
  deadline?: Date;
  terms: {
    lockupPeriod?: number;
    expectedReturns?: number;
    fees: {
      type: string;
      value: number;
    }[];
  };
  status: 'open' | 'filled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentAlert {
  id: string;
  investorId: string;
  type: 'opportunity' | 'portfolio' | 'market';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  relatedAssetId?: string;
  action?: {
    type: string;
    link: string;
  };
  createdAt: Date;
  readAt?: Date;
}

export interface PortfolioAnalytics {
  overview: {
    totalValue: number;
    totalInvested: number;
    totalReturns: number;
    unrealizedGains: number;
    realizedGains: number;
  };
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
    allTime: number;
  };
  diversification: {
    byCategory: {
      category: AssetCategory;
      percentage: number;
      value: number;
    }[];
    byRisk: {
      level: string;
      percentage: number;
      value: number;
    }[];
  };
  history: {
    date: Date;
    value: number;
    change: number;
  }[];
}