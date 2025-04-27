import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Loader } from 'lucide-react';
import { useMockDataStore } from '@/store/mockDataStore';
import { AssetCard } from '@/components/AssetCard';
import { Button } from '@/components/ui/Button';
import { AssetType } from '@/store/mockDataStore';

export default function AssetExplorerPage() {
  const { assets, loading, loadMoreAssets, filterAssets, searchAssets } = useMockDataStore();
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetType | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [filteredAssets, setFilteredAssets] = useState(assets);

  useEffect(() => {
    let result = assets;
    
    if (searchQuery) {
      result = searchAssets(searchQuery);
    }
    
    result = filterAssets(selectedCategory, priceRange, verifiedOnly);
    
    setFilteredAssets(result);
  }, [assets, searchQuery, selectedCategory, priceRange, verifiedOnly]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const categories: { value: AssetType | undefined, label: string }[] = [
    { value: undefined, label: 'All Categories' },
    { value: 'watches', label: 'Watches' },
    { value: 'art', label: 'Art' },
    { value: 'collectibles', label: 'Collectibles' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'real-estate', label: 'Real Estate' },
  ];

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary-800">Asset Explorer</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-primary-100 text-primary-800' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-primary-100 text-primary-800' : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter size={20} />
            Filters
          </Button>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white p-6 rounded-lg border border-neutral-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as AssetType)}
                    className="input w-full"
                  >
                    {categories.map(category => (
                      <option key={category.label} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="input w-full"
                      placeholder="Min"
                    />
                    <span className="text-neutral-500">to</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="input w-full"
                      placeholder="Max"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Verification
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-neutral-700">Show verified assets only</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredAssets.map((asset) => (
            <motion.div
              key={asset.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AssetCard asset={asset} />
            </motion.div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader className="animate-spin text-primary-600" size={32} />
          </div>
        ) : (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => loadMoreAssets()}
              className="px-8"
            >
              Load More Assets
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}