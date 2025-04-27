import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Loader, X, SlidersHorizontal, Check } from 'lucide-react';
import { useMockDataStore } from '@/store/mockDataStore';
import { AssetCard } from '@/components/AssetCard';
import { Button } from '@/components/ui/Button';
import { AssetCategory, Asset } from '@/types';
import { CategoryFilter } from '@/components/marketplace/CategoryFilter';
import { PriceRangeFilter } from '@/components/marketplace/PriceRangeFilter';
import { Header } from '@/components/layout/Header';

interface CategoryOption {
  label: string;
  value: AssetCategory | undefined;
}

const categories: CategoryOption[] = [
  { label: 'All Categories', value: undefined },
  { label: 'Real Estate', value: 'real-estate' },
  { label: 'Vehicles', value: 'vehicles' },
  { label: 'Art', value: 'art' },
  { label: 'Collectibles', value: 'collectibles' },
  { label: 'Jewelry', value: 'jewelry' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Other', value: 'other' }
];

export default function MarketplacePage() {
  const { assets, loading, loadMoreAssets, filterAssets, searchAssets } = useMockDataStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<'newest' | 'price-low-high' | 'price-high-low' | 'ending-soon'>('newest');
  const [quickViewAsset, setQuickViewAsset] = useState<Asset | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets);

  useEffect(() => {
    let result = assets;
    
    if (searchQuery) {
      result = searchAssets(searchQuery);
    }
    
    result = filterAssets(selectedCategory, priceRange, verifiedOnly);
    
    // Sort assets based on selected option
    result = sortAssets(result, sortOption);
    
    setFilteredAssets(result);
  }, [assets, searchQuery, selectedCategory, priceRange, verifiedOnly, sortOption]);

  const sortAssets = (assetsToSort: Asset[], sortBy: string) => {
    switch (sortBy) {
      case 'price-low-high':
        return [...assetsToSort].sort((a, b) => a.price.amount - b.price.amount);
      case 'price-high-low':
        return [...assetsToSort].sort((a, b) => b.price.amount - a.price.amount);
      case 'ending-soon':
        return [...assetsToSort].sort((a, b) => {
          if (!a.auctionEndTime) return 1;
          if (!b.auctionEndTime) return -1;
          return new Date(a.auctionEndTime).getTime() - new Date(b.auctionEndTime).getTime();
        });
      case 'newest':
      default:
        return assetsToSort;
    }
  };

  const conditions = [
    { id: 'mint', label: 'Mint' },
    { id: 'excellent', label: 'Excellent' },
    { id: 'good', label: 'Good' },
    { id: 'fair', label: 'Fair' },
  ];

  const toggleCondition = (conditionId: string) => {
    setSelectedConditions(prev => 
      prev.includes(conditionId) 
        ? prev.filter(id => id !== conditionId) 
        : [...prev, conditionId]
    );
  };

  const handleCategoryChange = (category: AssetCategory | undefined) => {
    setSelectedCategory(category);
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const handleQuickView = (asset: Asset) => {
    setQuickViewAsset(asset);
  };

  const closeQuickView = () => {
    setQuickViewAsset(null);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'ending-soon', label: 'Auction Ending Soon' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-800">Marketplace</h1>
          <p className="text-neutral-600 mt-2">
            Explore our collection of tokenized real-world assets
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter size={20} />
              Filters
            </Button>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary-100 text-primary-800' : 'text-neutral-600 hover:bg-neutral-100'}`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary-100 text-primary-800' : 'text-neutral-600 hover:bg-neutral-100'}`}
              >
                <List size={20} />
              </button>
            </div>
            <div className="flex-1 md:flex-none ml-auto">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="w-full md:w-auto px-3 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <Button
            onClick={() => setIsMobileFilterOpen(true)}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <SlidersHorizontal size={18} />
            Show All Filters
          </Button>
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange} 
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Desktop Filters */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '300px' }}
                exit={{ opacity: 0, width: 0 }}
                className="hidden md:block w-full md:w-72 shrink-0"
              >
                <div className="bg-white p-6 rounded-lg border border-neutral-200 sticky top-24">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Filters</h2>
                    <button onClick={() => setIsFilterOpen(false)} className="text-neutral-500 hover:text-neutral-700">
                      <X size={20} />
                    </button>
                  </div>

                  <PriceRangeFilter 
                    priceRange={priceRange} 
                    onPriceRangeChange={handlePriceRangeChange} 
                  />

                  {/* Condition Filter */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Condition</h3>
                    <div className="space-y-2">
                      {conditions.map(condition => (
                        <div key={condition.id} className="flex items-center">
                          <button
                            onClick={() => toggleCondition(condition.id)}
                            className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${selectedConditions.includes(condition.id) ? 'bg-primary-500 border-primary-500' : 'border-neutral-300'}`}
                          >
                            {selectedConditions.includes(condition.id) && (
                              <Check size={14} className="text-white" />
                            )}
                          </button>
                          <span>{condition.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verified Only Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Verified Only</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={verifiedOnly} 
                          onChange={() => setVerifiedOnly(!verifiedOnly)} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedCategory(undefined);
                      setPriceRange([0, 1000000]);
                      setVerifiedOnly(false);
                      setSelectedConditions([]);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Asset Grid */}
          <div className="flex-1">
            <div className={viewMode === 'grid' ? 
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : 
              "space-y-4"}
            >
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={viewMode === 'list' ? "w-full" : ""}
                  >
                    <AssetCard 
                      asset={asset} 
                      onQuickView={() => handleQuickView(asset)}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-neutral-500 text-lg">No assets found matching your criteria</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSelectedCategory(undefined);
                      setPriceRange([0, 1000000]);
                      setVerifiedOnly(false);
                      setSelectedConditions([]);
                      setSearchQuery('');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {filteredAssets.length > 0 && (
              <div className="mt-10 text-center">
                <Button
                  onClick={loadMoreAssets}
                  variant="outline"
                  disabled={loading}
                  className="px-8"
                >
                  {loading ? (
                    <>
                      <Loader size={20} className="animate-spin mr-2" />
                      Loading...
                    </>
                  ) : (
                    'Load More Assets'
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={closeQuickView}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto my-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={closeQuickView}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10"
                >
                  <X size={20} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 md:p-8">
                    <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                      <img
                        src={quickViewAsset.imageUrl}
                        alt={quickViewAsset.title}
                        className="w-full h-full object-cover"
                      />
                      {quickViewAsset.isVerified && (
                        <div className="absolute top-4 right-4 bg-white rounded-full p-1 shadow-md">
                          <Check size={16} className="text-green-500" />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="aspect-square rounded-md overflow-hidden">
                        <img
                          src={quickViewAsset.imageUrl}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Placeholder thumbnails */}
                      <div className="aspect-square rounded-md bg-neutral-100"></div>
                      <div className="aspect-square rounded-md bg-neutral-100"></div>
                      <div className="aspect-square rounded-md bg-neutral-100"></div>
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-2">{quickViewAsset.title}</h2>
                    <p className="text-neutral-500 capitalize mb-4">{quickViewAsset.category.replace('-', ' ')}</p>
                    
                    <div className="mb-6">
                      <p className="text-3xl font-bold text-primary-800">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: quickViewAsset.price.currency,
                          maximumFractionDigits: 0,
                        }).format(quickViewAsset.price.amount)}
                      </p>
                      {quickViewAsset.listingType === 'auction' && quickViewAsset.auctionEndTime && (
                        <p className="text-sm text-neutral-500 mt-1">
                          Auction ends: {new Date(quickViewAsset.auctionEndTime).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-neutral-600">{quickViewAsset.description || 'No description available.'}</p>
                    </div>
                    
                    {quickViewAsset.specifications && (
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Specifications</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(quickViewAsset.specifications).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                              <span className="text-xs text-neutral-500">{key}</span>
                              <span className="text-sm">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-3">
                      {quickViewAsset.listingType === 'auction' ? (
                        <Button fullWidth>Place Bid</Button>
                      ) : quickViewAsset.listingType === 'fixed' ? (
                        <Button fullWidth>Buy Now</Button>
                      ) : quickViewAsset.listingType === 'swap' ? (
                        <Button variant="secondary" fullWidth>Swap Asset</Button>
                      ) : (
                        <Button variant="secondary" fullWidth>View Terms</Button>
                      )}
                      <Button variant="outline" fullWidth onClick={() => window.location.href = `/asset/${quickViewAsset.id}`}>
                        View Full Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}