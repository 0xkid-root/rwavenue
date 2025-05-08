import { NextApiRequest, NextApiResponse } from 'next';
import { Asset } from '@/types';
import { mockAssets } from '@/data/mockData';

// Type assertion to treat mockAssets as Asset[] for API compatibility
const assetsData = mockAssets as unknown as Asset[];

// Helper function to filter and sort assets
const filterAndSortAssets = (
  assets: Asset[],
  category?: string,
  searchQuery?: string,
  sortBy?: string
) => {
  let result = [...assets];

  // Apply category filter
  if (category) {
    result = result.filter(asset => asset.category === category);
  }

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(asset =>
      asset.title.toLowerCase().includes(query) ||
      asset.description.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  switch (sortBy) {
    case 'recent':
      result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'price-high':
      result = result.sort((a, b) => b.price.toNumber() - a.price.toNumber());
      break;
    case 'price-low':
      result = result.sort((a, b) => a.price.toNumber() - b.price.toNumber());
      break;
    case 'name':
      result = result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }

  return result;
};

// GET /api/assets/my-assets
export async function getMyAssets(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { category, search, sortBy, page = '1', limit = '10' } = req.query;

    // Filter and sort assets
    const filteredAssets = filterAndSortAssets(
      assetsData,
      category as string,
      search as string,
      sortBy as string
    );

    // Pagination
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = startIndex + limitNumber;
    const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

    res.status(200).json({
      assets: paginatedAssets,
      total: filteredAssets.length,
      page: pageNumber,
      totalPages: Math.ceil(filteredAssets.length / limitNumber)
    });
  } catch (error) {
    console.error('Error in getMyAssets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
}

// GET /api/assets/[id]
export async function getAssetById(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    // Convert id to string for comparison
    const asset = mockAssets.find(a => String(a.id) === String(id));

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.status(200).json(asset);
  } catch (error) {
    console.error('Error in getAssetById:', error);
    res.status(500).json({ error: 'Failed to fetch asset details' });
  }
}

// PATCH /api/assets/[id]
export async function updateAsset(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const updates = req.body;

    // Convert id to string for comparison
    const assetIndex = mockAssets.findIndex(a => String(a.id) === String(id));
    if (assetIndex === -1) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Update asset
    const updatedAsset = {
      ...mockAssets[assetIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    mockAssets[assetIndex] = updatedAsset;

    res.status(200).json(updatedAsset);
  } catch (error) {
    console.error('Error in updateAsset:', error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
}

// DELETE /api/assets/[id]
export async function deleteAsset(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    // Convert id to string for comparison
    const assetIndex = mockAssets.findIndex(a => String(a.id) === String(id));

    if (assetIndex === -1) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    mockAssets.splice(assetIndex, 1);
    res.status(204).end();
  } catch (error) {
    console.error('Error in deleteAsset:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
}

// GET /api/assets/categories
export async function getCategories(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = Array.from(new Set(mockAssets.map(asset => asset.category)));
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

// POST /api/assets/[id]/verify
export async function verifyAsset(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    // Convert id to string for comparison
    const assetIndex = mockAssets.findIndex(a => String(a.id) === String(id));

    if (assetIndex === -1) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Update verification status
    const updatedAsset = {
      ...mockAssets[assetIndex],
      verified: true,
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'System Validator' // In real implementation, this would be the actual validator
    };
    mockAssets[assetIndex] = updatedAsset;

    res.status(200).json(updatedAsset);
  } catch (error) {
    console.error('Error in verifyAsset:', error);
    res.status(500).json({ error: 'Failed to verify asset' });
  }
}

// GET /api/assets/[id]/verification-status
export async function getVerificationStatus(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    // Convert id to string for comparison
    const asset = mockAssets.find(a => String(a.id) === String(id));

    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Create a response with validation status
    res.status(200).json({
      verified: false, // Default value since 'verified' doesn't exist on Asset type
      verifiedAt: undefined,
      verifiedBy: undefined
    });
  } catch (error) {
    console.error('Error in getVerificationStatus:', error);
    res.status(500).json({ error: 'Failed to fetch verification status' });
  }
}
