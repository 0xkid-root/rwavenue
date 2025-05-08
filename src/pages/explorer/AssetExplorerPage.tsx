import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Loader, ChevronDown, Check, X, DollarSign, Clock, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { AssetCard } from '@/components/AssetCard';
import BigNumber from 'bignumber.js';
import { Asset as ImportedAsset, ListingType as ImportedListingType, AssetCategory as ImportedAssetCategory } from '@/types';

// Define local types
type LocalAssetCategory = 'watches' | 'art' | 'collectibles' | 'jewelry' | 'real-estate' | 'vehicles';
type LocalAssetStatus = 'listed' | 'sold' | 'pending';
type LocalTokenizationType = 'fractional' | 'whole';
type LocalListingType = 'auction' | 'fixed';

// Local asset interface for the explorer page
interface ExplorerAsset {
  id: number;
  title: string;
  description: string;
  category: LocalAssetCategory;
  status: LocalAssetStatus;
  images: string[];
  price: BigNumber;
  tokenizationType: LocalTokenizationType;
  totalTokens: number;
  availableTokens: number;
  pricePerToken: number;
  royaltyReceiver: string;
  royaltyPercentage: number;
  listingType: LocalListingType;
  owner: { id: string; name: string; rating: number };
  createdAt: number;
  updatedAt: number;
  auctionEndTime?: number;
  views: number;
  likes: number;
  value: number;
  tokenId: string;
}

interface FilterPanelProps {
  isOpen: boolean;
  selectedCategory: string | undefined;
  setSelectedCategory: (category: string | undefined) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (verified: boolean) => void;
  onReset: () => void;
  categories: { value: string | undefined; label: string }[];
}

// Mock data for assets
const mockAssets: ExplorerAsset[] = [
  {
    id: 1,
    title: 'Luxury Watch Collection',
    description: 'Rare collection of vintage Rolex watches',
    category: 'watches',
    status: 'listed',
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d'],
    price: new BigNumber(250000),
    tokenizationType: 'fractional',
    totalTokens: 1000,
    availableTokens: 500,
    pricePerToken: 250,
    royaltyReceiver: '0x1234...5678',
    royaltyPercentage: 5,
    listingType: 'auction',
    owner: { id: '0x1234...5678', name: 'John Doe', rating: 4.8 },
    createdAt: new Date('2023-01-15').getTime(),
    updatedAt: new Date('2023-01-15').getTime(),
    auctionEndTime: new Date('2023-12-31T23:59:59Z').getTime(),
    views: 1500,
    likes: 120,
    value: 250000,
    tokenId: '1'
  },
  {
    id: 2,
    title: 'Modern Art Painting',
    description: 'Contemporary abstract painting by renowned artist',
    category: 'art',
    status: 'listed',
    images: ['https://images.unsplash.com/photo-1579546929518-9e396f3cc809'],
    price: new BigNumber(150000),
    tokenizationType: 'whole',
    totalTokens: 1,
    availableTokens: 1,
    pricePerToken: 150000,
    royaltyReceiver: '0x2345...6789',
    royaltyPercentage: 3,
    listingType: 'fixed',
    owner: { id: '0x2345...6789', name: 'Jane Smith', rating: 4.9 },
    createdAt: new Date('2023-02-20').getTime(),
    updatedAt: new Date('2023-02-20').getTime(),
    views: 2000,
    likes: 180,
    value: 150000,
    tokenId: '2'
  },
  {
    id: 3,
    title: 'Rare Coin Collection',
    description: 'Collection of rare ancient coins',
    category: 'collectibles',
    status: 'listed',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e'],
    price: new BigNumber(75000),
    tokenizationType: 'fractional',
    totalTokens: 1000,
    availableTokens: 750,
    pricePerToken: 75,
    royaltyReceiver: '0x3456...7890',
    royaltyPercentage: 4,
    listingType: 'fixed',
    owner: { id: '0x3456...7890', name: 'Mike Johnson', rating: 4.7 },
    createdAt: new Date('2023-03-10').getTime(),
    updatedAt: new Date('2023-03-10').getTime(),
    views: 1200,
    likes: 90,
    value: 75000,
    tokenId: '3'
  },
  {
    id: 4,
    title: 'Diamond Necklace',
    description: 'Exclusive diamond necklace with rare stones',
    category: 'jewelry',
    status: 'listed',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a'],
    price: new BigNumber(500000),
    tokenizationType: 'whole',
    totalTokens: 1,
    availableTokens: 1,
    pricePerToken: 500000,
    royaltyReceiver: '0x4567...8901',
    royaltyPercentage: 6,
    listingType: 'auction',
    owner: { id: '0x4567...8901', name: 'Sarah Wilson', rating: 4.9 },
    createdAt: new Date('2023-04-05').getTime(),
    updatedAt: new Date('2023-04-05').getTime(),
    auctionEndTime: new Date('2023-12-15T23:59:59Z').getTime(),
    views: 3000,
    likes: 250,
    value: 500000,
    tokenId: '4'
  },
  {
    id: 5,
    title: 'Luxury Penthouse',
    description: 'Premium penthouse in downtown area',
    category: 'real-estate',
    status: 'listed',
    images: ['https://images.unsplash.com/photo-1613545325278-f24b0cae1224'],
    price: new BigNumber(2000000),
    tokenizationType: 'fractional',
    totalTokens: 10000,
    availableTokens: 5000,
    pricePerToken: 200,
    royaltyReceiver: '0x5678...9012',
    royaltyPercentage: 5,
    listingType: 'fixed',
    owner: { id: '0x5678...9012', name: 'David Brown', rating: 4.8 },
    createdAt: new Date('2023-05-12').getTime(),
    updatedAt: new Date('2023-05-12').getTime(),
    views: 5000,
    likes: 400,
    value: 2000000,
    tokenId: '5'
  },
  {
    id: 6,
    title: 'Vintage Car Collection',
    description: 'Collection of classic cars from the 1960s',
    category: 'vehicles',
    status: 'listed',
    images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70'],
    price: new BigNumber(3000000),
    tokenizationType: 'fractional',
    totalTokens: 10000,
    availableTokens: 3000,
    pricePerToken: 300,
    royaltyReceiver: '0x6789...0123',
    royaltyPercentage: 7,
    listingType: 'auction',
    owner: { id: '0x6789...0123', name: 'Robert Taylor', rating: 4.9 },
    createdAt: new Date('2023-06-18').getTime(),
    updatedAt: new Date('2023-06-18').getTime(),
    auctionEndTime: new Date('2023-12-20T23:59:59Z').getTime(),
    views: 4000,
    likes: 350,
    value: 3000000,
    tokenId: '6'
  },
  {
    id: 7,
    title: 'Rare Stamp Collection',
    description: 'Collection of rare postage stamps',
    category: 'collectibles',
    status: 'listed',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e'],
    price: new BigNumber(100000),
    tokenizationType: 'whole',
    totalTokens: 1,
    availableTokens: 1,
    pricePerToken: 100000,
    royaltyReceiver: '0x7890...1234',
    royaltyPercentage: 3,
    listingType: 'fixed',
    owner: { id: '0x7890...1234', name: 'Emily Davis', rating: 4.6 },
    createdAt: new Date('2023-07-22').getTime(),
    updatedAt: new Date('2023-07-22').getTime(),
    views: 800,
    likes: 60,
    value: 100000,
    tokenId: '7'
  },
  {
    id: 8,
    title: 'Luxury Yacht',
    description: 'Premium yacht with modern amenities',
    category: 'vehicles',
    status: 'listed',
    images: ['https://images.unsplash.com/photo-1504851149312-f24b0cae1224'],
    price: new BigNumber(5000000),
    tokenizationType: 'fractional',
    totalTokens: 10000,
    availableTokens: 2000,
    pricePerToken: 500,
    royaltyReceiver: '0x8901...2345',
    royaltyPercentage: 8,
    listingType: 'auction',
    owner: { id: '0x8901...2345', name: 'William Clark', rating: 4.9 },
    createdAt: new Date('2023-08-30').getTime(),
    updatedAt: new Date('2023-08-30').getTime(),
    auctionEndTime: new Date('2023-12-25T23:59:59Z').getTime(),
    views: 6000,
    likes: 500,
    value: 5000000,
    tokenId: '8'
  }
];

// Buy Modal Component
const BuyModal = ({ 
  asset, 
  isOpen, 
  onClose, 
  onConfirmPurchase 
}: { 
  asset: ExplorerAsset | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirmPurchase: () => Promise<void>; 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  
  const handlePurchase = async () => {
    if (!asset) return;
    
    try {
      setIsProcessing(true);
      await onConfirmPurchase();
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Purchase Failed",
        description: "There was an error processing your purchase. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">Purchase Asset</h2>
        <p className="text-neutral-500 mb-4">Complete your purchase for this premium asset.</p>
        
        {asset && (
          <div className="py-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden">
                <img 
                  src={asset.images[0]} 
                  alt={asset.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-lg">{asset.title}</h3>
                <p className="text-neutral-500 text-sm">{asset.category}</p>
                <div className="flex items-center mt-1 text-primary-700 font-medium">
                  <DollarSign size={16} className="mr-1" />
                  <span>{asset.price.toString()}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Select Payment Method</h4>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1"
                    onClick={() => setPaymentMethod('crypto')}
                  >
                    Cryptocurrency
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="flex-1"
                    disabled={true}
                    onClick={() => setPaymentMethod('fiat')}
                  >
                    Credit Card (Coming Soon)
                  </Button>
                </div>
              </div>
              
              {paymentMethod === 'crypto' ? (
                <div className="rounded-lg bg-neutral-50 p-3 border border-neutral-200">
                  <p className="text-sm text-neutral-700">
                    You'll be prompted to connect your wallet and approve the transaction.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Input type="text" placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-3">
                    <Input type="text" placeholder="MM/YY" />
                    <Input type="text" placeholder="CVC" />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {isProcessing ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Confirm Purchase'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Filter Panel Component
const FilterPanel = ({
  isOpen,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  verifiedOnly,
  setVerifiedOnly,
  onReset,
  categories,
}: FilterPanelProps) => {
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  
  useEffect(() => {
    setTempPriceRange(priceRange);
  }, [priceRange]);
  
  const handleApplyPriceRange = () => {
    if (tempPriceRange[0] >= 0 && tempPriceRange[1] >= tempPriceRange[0]) {
      setPriceRange(tempPriceRange);
    }
  };

  const handlePriceRangeChange = (index: number, value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    const newRange = [...tempPriceRange] as [number, number];
    newRange[index] = numValue;
    setTempPriceRange(newRange);
  };
  
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
          animate={{ height: 'auto', opacity: 1, overflow: 'visible' }}
          exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-lg">Filters</h3>
            <Button variant="secondary" size="sm" onClick={onReset} className="text-neutral-500">
              Reset All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Category
              </label>
              <Select
                value={selectedCategory || "all"}
                onValueChange={(value: string) => setSelectedCategory(value === "all" ? undefined : value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.label} value={category.value || "all"}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Price Range
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <DollarSign size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <Input
                    type="number"
                    min="0"
                    value={tempPriceRange[0]}
                    onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                    className="pl-8"
                    placeholder="Min"
                  />
                </div>
                <span className="text-neutral-500">to</span>
                <div className="relative flex-1">
                  <DollarSign size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <Input
                    type="number"
                    min="0"
                    value={tempPriceRange[1]}
                    onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                    className="pl-8"
                    placeholder="Max"
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleApplyPriceRange}
                  className="whitespace-nowrap"
                >
                  Apply
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Verification
              </label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="verified-only"
                  checked={verifiedOnly}
                  onCheckedChange={(checked: boolean) => setVerifiedOnly(checked)}
                />
                <label 
                  htmlFor="verified-only" 
                  className="text-sm text-neutral-700 cursor-pointer flex items-center"
                >
                  Show verified assets only
                  <Check size={16} className={`ml-1 text-primary-500 ${verifiedOnly ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Page Component
const AssetExplorerPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<ExplorerAsset | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState<ExplorerAsset[]>(mockAssets);

  // Use mock data directly
  const assets = mockAssets;
  
  // Set up categories
  const categories = [
    { value: undefined, label: 'All Categories' },
    { value: 'watches', label: 'Watches' },
    { value: 'art', label: 'Art' },
    { value: 'collectibles', label: 'Collectibles' },
    { value: 'jewelry', label: 'Jewelry' },
    { value: 'real-estate', label: 'Real Estate' },
  ];

  // Filter assets based on category, price range
  const filterAssets = (category: string | undefined, priceRange: [number, number]) => {
    return assets.filter(asset => {
      // Category filter
      if (category && asset.category !== category) return false;
      
      // Price range filter
      if (asset.price.lt(priceRange[0]) || asset.price.gt(priceRange[1])) return false;
      
      return true;
    });
  };

  useEffect(() => {
    // Start with all assets
    let result = [...assets];
    
    // Apply category and price range filters
    result = filterAssets(selectedCategory, priceRange);
    
    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      result = result.filter(asset => 
        asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredAssets(result);
  }, [assets, searchQuery, selectedCategory, priceRange, verifiedOnly]);

  // Debounced search handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Show loading indicator briefly when searching
    if (value.trim() !== searchQuery.trim()) {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 300);
    }
  };

  const handleBuyClick = (asset: ExplorerAsset) => {
    setSelectedAsset(asset);
    setIsBuyModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedAsset) return;
    
    // Simulate purchase process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsBuyModalOpen(false);
    toast({
      title: "Purchase Successful!",
      description: `You are now the proud owner of ${selectedAsset.title}`,
      variant: "default",
    });
  };
  
  const resetFilters = () => {
    setSelectedCategory(undefined);
    setPriceRange([0, 1000000]);
    setVerifiedOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary-800">Asset Explorer</h1>
            <p className="text-neutral-500 mt-1">Discover and invest in premium tokenized assets</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-neutral-200">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-md transition-colors text-neutral-600 hover:bg-neutral-100"
            >
              <Grid size={18} />
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              className="rounded-md transition-colors text-neutral-600 hover:bg-neutral-100"
            >
              <List size={18} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
            <Input
              type="text"
              placeholder="Search by name, description, or token ID..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader size={18} className="animate-spin text-neutral-400" />
              </div>
            )}
          </div>
          
          <Button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            variant="outline"
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Filter size={18} />
            Filters
            <ChevronDown 
              size={16} 
              className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
            />
          </Button>
        </div>

        <FilterPanel
          isOpen={isFilterOpen}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          verifiedOnly={verifiedOnly}
          setVerifiedOnly={setVerifiedOnly}
          onReset={resetFilters}
          categories={categories}
        />

        {/* Results summary */}
        <div className="flex justify-between items-center">
          <p className="text-neutral-600">
            Showing <span className="font-medium">{filteredAssets.length}</span> results
            {(searchQuery || selectedCategory || verifiedOnly || priceRange[0] > 0 || priceRange[1] < 1000000) && (
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={resetFilters}
                className="ml-2 text-primary-600 hover:text-primary-800"
              >
                <X size={14} className="mr-1" />
                Clear filters
              </Button>
            )}
          </p>
          
          <div className="text-sm text-neutral-500 flex items-center">
            <Clock size={14} className="mr-1" />
            Auto-refreshing
          </div>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <Search className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Assets Found</h3>
              <p className="text-neutral-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={convertToImportedAsset(asset)}
                  onBuyClick={handleBuyClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Buy Modal */}
      <BuyModal
        asset={selectedAsset}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onConfirmPurchase={handleConfirmPurchase}
      />
    </div>
  );
};

// Helper function to convert ExplorerAsset to ImportedAsset
function convertToImportedAsset(asset: ExplorerAsset): ImportedAsset {
  return {
    id: asset.id,
    title: asset.title,
    description: asset.description,
    category: asset.category as unknown as ImportedAssetCategory,
    price: asset.price,
    tokenizationType: asset.tokenizationType === 'fractional' ? 0 : 1,
    totalTokens: asset.totalTokens,
    pricePerToken: new BigNumber(asset.pricePerToken),
    listingType: asset.listingType === 'auction' ? ImportedListingType.AUCTION : ImportedListingType.FIXED_PRICE,
    auctionEndTime: asset.auctionEndTime || 0,
    royaltyReceiver: asset.royaltyReceiver,
    royaltyFraction: asset.royaltyPercentage,
    creator: asset.owner.id,
    status: asset.status === 'listed' ? 0 : asset.status === 'sold' ? 1 : 2,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt
  } as ImportedAsset;
}

export default AssetExplorerPage;