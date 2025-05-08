import { AssetCategory, AssetDocument, AssetStatus } from './index';

export interface ValidatorProfile {
  id: string;
  name: string;
  avatar?: string;
  expertise: AssetCategory[];
  jurisdiction: string;
  licenses: AssetDocument[];
  reputation: number;
  validationCount: number;
  availableForValidation: boolean;
  fees: {
    base: number;
    currency: string;
    rushFee?: number;
  };
  languages: string[];
  responseTime: number; // Average response time in hours
  contactInfo: {
    email: string;
    phone?: string;
    office?: string;
  };
}

export interface ValidationTask {
  id: string;
  assetId: string;
  validatorId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  priority: 'normal' | 'rush';
  submittedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  documents: AssetDocument[];
  validationChecklist: {
    item: string;
    status: 'pending' | 'passed' | 'failed';
    comments?: string;
  }[];
  result?: {
    status: AssetStatus;
    comments: string;
    recommendations?: string[];
    valuation?: {
      value: number;
      currency: string;
      basis: string;
    };
  };
}

export interface ValidationMetrics {
  totalValidations: number;
  averageResponseTime: number;
  completionRate: number;
  accuracyRate: number;
  clientSatisfaction: number;
  recentActivity: {
    date: Date;
    action: string;
    assetId: string;
  }[];
}

export interface ValidationRequest {
  id: string;
  assetId: string;
  ownerId: string;
  preferredValidators?: string[];
  requirements: {
    expertise: AssetCategory[];
    jurisdiction?: string[];
    languages?: string[];
    deadline?: Date;
    rushRequired: boolean;
  };
  documents: AssetDocument[];
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}