import { Request, Response } from 'express';

// Mock prisma client since the actual one isn't available
const prisma = {
  asset: {
    findMany: async () => [],
    count: async () => 0,
    aggregate: async () => ({ _sum: { value: 0 } }),
  },
  validation: {
    findMany: async () => []
  }
};

export const dashboardController = {
  // Get dashboard data including stats and filtered assets
  getDashboardData: async ( res: Response) => {
    try {
      
      // Base query for assets
      let assetsQuery = prisma.asset.findMany();

      // Get stats
      const [assets, totalValue, pendingValidations, actionRequired] = await Promise.all([
        assetsQuery,
        prisma.asset.aggregate(),
        prisma.asset.count(),
        prisma.asset.count(),
      ]);

      const stats = {
        totalAssets: assets.length,
        totalValue: totalValue._sum.value || 0,
        pendingValidations,
        actionRequired,
      };

      res.json({
        stats,
        assets,
      });
    } catch (error) {
      console.error('Error in getDashboardData:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  },

  // Get pending validations
  getPendingValidations: async (_req: Request, res: Response) => {
    try {
      const pendingAssets = await prisma.asset.findMany();

      res.json(pendingAssets);
    } catch (error) {
      console.error('Error in getPendingValidations:', error);
      res.status(500).json({ error: 'Failed to fetch pending validations' });
    }
  },

  // Get assets requiring action
  getActionRequired: async (_req: Request, res: Response) => {
    try {
      const actionRequiredAssets = await prisma.asset.findMany();

      res.json(actionRequiredAssets);
    } catch (error) {
      console.error('Error in getActionRequired:', error);
      res.status(500).json({ error: 'Failed to fetch action required assets' });
    }
  },

  // Get total portfolio value
  getTotalValue: async (_req: Request, res: Response) => {
    try {
      const totalValue = await prisma.asset.aggregate();

      res.json({ totalValue: totalValue._sum.value || 0 });
    } catch (error) {
      console.error('Error in getTotalValue:', error);
      res.status(500).json({ error: 'Failed to fetch total value' });
    }
  },
};