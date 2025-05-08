import { InvestorProfile, Investment, InvestmentOpportunity, InvestmentAlert, PortfolioAnalytics } from '../types/investor';

export const investorApi = {
  // Profile Management
  getProfile: async (userId: string): Promise<InvestorProfile> => {
    try {
      // Fetch investor profile from backend using userId
      const response = await fetch(`/api/investors/${userId}/profile`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to get profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  updateProfile: async (profile: Partial<InvestorProfile>): Promise<InvestorProfile> => {
    try {
      // Update investor profile in backend
      const response = await fetch('/api/investors/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Investment Management
  getInvestments: async (investorId: string): Promise<Investment[]> => {
    try {
      // Fetch all investments for the investor
      const response = await fetch(`/api/investors/${investorId}/investments`);
      if (!response.ok) throw new Error('Failed to fetch investments');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to get investments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getInvestmentDetails: async (investmentId: string): Promise<Investment> => {
    try {
      // Fetch specific investment details
      const response = await fetch(`/api/investments/${investmentId}`);
      if (!response.ok) throw new Error('Failed to fetch investment details');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to get investment details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  makeInvestment: async (opportunity: InvestmentOpportunity, amount: number): Promise<Investment> => {
    try {
      // Create new investment
      const response = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: opportunity.id, amount })
      });
      if (!response.ok) throw new Error('Failed to make investment');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to make investment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  exitInvestment: async (investmentId: string): Promise<Investment> => {
    try {
      // Process investment exit
      const response = await fetch(`/api/investments/${investmentId}/exit`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to exit investment');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to exit investment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Investment Opportunities
  getOpportunities: async (filters?: {
    category?: string[];
    minAmount?: number;
    maxAmount?: number;
    type?: 'primary' | 'secondary';
  }): Promise<InvestmentOpportunity[]> => {
    try {
      // Construct query parameters from filters
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category.join(','));
      if (filters?.minAmount) params.append('minAmount', filters.minAmount.toString());
      if (filters?.maxAmount) params.append('maxAmount', filters.maxAmount.toString());
      if (filters?.type) params.append('type', filters.type);

      // Fetch filtered opportunities
      const response = await fetch(`/api/opportunities?${params}`);
      if (!response.ok) throw new Error('Failed to fetch opportunities');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to get opportunities: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getOpportunityDetails: async (opportunityId: string): Promise<InvestmentOpportunity> => {
    try {
      // Fetch specific opportunity details
      const response = await fetch(`/api/opportunities/${opportunityId}`);
      if (!response.ok) throw new Error('Failed to fetch opportunity details');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to get opportunity details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Portfolio Analytics
  getPortfolioAnalytics: async (investorId: string): Promise<PortfolioAnalytics> => {
    try {
      // Fetch portfolio analytics for the investor
      const response = await fetch(`/api/investors/${investorId}/analytics`);
      if (!response.ok) throw new Error('Failed to fetch portfolio analytics');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to get portfolio analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Alerts and Notifications
  getAlerts: async (investorId: string): Promise<InvestmentAlert[]> => {
    try {
      // Fetch alerts for the investor
      const response = await fetch(`/api/investors/${investorId}/alerts`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to get alerts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  markAlertRead: async (alertId: string): Promise<void> => {
    try {
      // Mark alert as read
      const response = await fetch(`/api/alerts/${alertId}/read`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Failed to mark alert as read');
    } catch (error) {
      throw new Error(`Failed to mark alert as read: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Accreditation
  submitAccreditation: async (investorId: string, documents: { type: string; url: string }[]): Promise<void> => {
    try {
      // Submit accreditation documents
      const response = await fetch(`/api/investors/${investorId}/accreditation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents })
      });
      if (!response.ok) throw new Error('Failed to submit accreditation');
    } catch (error) {
      throw new Error(`Failed to submit accreditation: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  getAccreditationStatus: async (investorId: string): Promise<{
    isAccredited: boolean;
    verifiedAt?: Date;
    expiresAt?: Date;
  }> => {
    try {
      // Fetch accreditation status
      const response = await fetch(`/api/investors/${investorId}/accreditation/status`);
      if (!response.ok) throw new Error('Failed to fetch accreditation status');
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to get accreditation status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};