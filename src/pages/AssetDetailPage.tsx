import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Wallet, Repeat, CreditCard, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useMockDataStore } from '@/store/mockDataStore';
import { ListingType } from '@/types';
import { formatCurrency } from '@/utils/formatters';

// Using imported types from the main types module

// Using the imported types instead of defining a local interface

// Helper function to get a placeholder image URL based on asset ID
const getPlaceholderImageUrl = (assetId: number | string): string => {
  return `/assets/placeholders/asset-${typeof assetId === 'number' ? assetId % 10 : parseInt(assetId) % 10}.jpg`;
};

const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const AssetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { assets } = useMockDataStore();
  const asset = id ? assets.find((a) => a.id === Number(id)) : undefined;

  if (!asset || !id) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Asset Not Found</h2>
        <p className="text-neutral-600 mb-8">The asset you're looking for doesn't exist or has been removed.</p>
        <Link to="/marketplace">
          <Button>Return to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const { 
    title, 
    category, 
    price, 
    description,
    listingType,
    auctionEndTime,
    id: assetId
  } = asset;
  
  // Use placeholder for imageUrl since it doesn't exist on the Asset type
  const imageUrl = getPlaceholderImageUrl(assetId);

  // Mock related assets
  const relatedAssets = assets
    .filter((a) => a.category === category && a.id !== Number(id))
    .slice(0, 3);

  return (
    <div className="bg-neutral-50 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6 mt-6">
          <Link to="/marketplace" className="flex items-center text-neutral-600 hover:text-primary-800 transition-colors">
            <ArrowLeft size={16} className="mr-1" />
            Back to Marketplace
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Left Column - Asset Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Additional images (mocked as same image) */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {[0, 1, 2, 3].map((i: number) => (
                  <div key={i} className="aspect-square rounded-md overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`${title} view ${i + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Asset Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col h-full"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h1 className="text-3xl font-bold text-primary-800">{title}</h1>
                  <Badge 
                    variant={
                      listingType === ListingType.AUCTION ? 'primary' : 
                      listingType === ListingType.FIXED_PRICE ? 'success' : 
                      'secondary'
                    }
                    className="capitalize"
                  >
                    {listingType === ListingType.AUCTION ? 'auction' : 
                     listingType === ListingType.FIXED_PRICE ? 'fixed' : 
                     'swap'}
                  </Badge>
                </div>
                <p className="text-neutral-600 capitalize">{category.replace('-', ' ')}</p>
              </div>

              {/* Price and Auction Details */}
              <div className="my-6 p-4 bg-neutral-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-neutral-600">Current {listingType === ListingType.AUCTION ? 'Bid' : 'Price'}</span>
                  <span className="text-2xl font-bold text-primary-800">
                    {formatCurrency(parseFloat(price.toString()), 'USD')}
                  </span>
                </div>
                
                {listingType === ListingType.AUCTION && auctionEndTime && (
                  <div className="flex items-center text-neutral-700">
                    <Clock size={16} className="mr-2" />
                    <span>
                      Ends: {formatDate(auctionEndTime)}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {listingType === ListingType.AUCTION && (
                  <>
                    <Button fullWidth>Place Bid</Button>
                    <Button variant="secondary" fullWidth>Set Auto-Bid</Button>
                  </>
                )}
                
                {listingType === ListingType.FIXED_PRICE && (
                  <>
                    <Button fullWidth>
                      <span className="flex items-center">
                        <Wallet size={16} className="mr-2" />
                        Buy Now
                      </span>
                    </Button>
                    <Button variant="secondary" fullWidth>
                      <span className="flex items-center">
                        <CreditCard size={16} className="mr-2" />
                        Make Offer
                      </span>
                    </Button>
                  </>
                )}
                
                {listingType === ListingType.SWAP && (
                  <>
                    <Button fullWidth>
                      <span className="flex items-center">
                        <Repeat size={16} className="mr-2" />
                        Swap Asset
                      </span>
                    </Button>
                    <Button variant="secondary" fullWidth>View Details</Button>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-neutral-700">{description}</p>
              </div>

              {/* View on Blockchain Link */}
              <div className="mt-auto pt-4 border-t border-neutral-200">
                <a
                  href="#"
                  className="text-primary-800 hover:text-primary-600 text-sm inline-flex items-center"
                >
                  <ExternalLink size={14} className="mr-1" />
                  View on Blockchain
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Assets */}
        {relatedAssets.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-primary-800 mb-6">Related Assets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedAssets.map((relatedAsset) => {
                // Use placeholder for imageUrl
                const relatedImageUrl = getPlaceholderImageUrl(relatedAsset.id);
                return (
                  <Link 
                    key={relatedAsset.id} 
                    to={`/asset/${relatedAsset.id}`}
                    className="block"
                  >
                    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
                      <div className="relative h-48">
                        <img
                          src={relatedImageUrl}
                          alt={relatedAsset.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold truncate">{relatedAsset.title}</h4>
                        <p className="text-neutral-500 text-sm capitalize">{relatedAsset.category.replace('-', ' ')}</p>
                        <p className="text-primary-800 font-bold mt-2">
                          {formatCurrency(parseFloat(relatedAsset.price.toString()), 'USD')}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetDetailPage;