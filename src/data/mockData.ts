import { AssetCategory, ListingType } from '../types';
import { Validator } from '@/services/validatorService';
import { BigNumber } from 'ethers';

// This is a simplified version of the Asset interface for mock data
interface SimplifiedAsset {
  id: number;
  title: string;
  description: string;
  category: AssetCategory;
  price: BigNumber;
  imageUrl?: string; // Not in the actual Asset interface but used in UI
  isVerified?: boolean; // Not in the actual Asset interface but used in UI
  validator?: string; // Not in the actual Asset interface but used in UI
  specifications?: Record<string, string>; // Not in the actual Asset interface but used in UI
  ownerAddress?: string; // Not in the actual Asset interface but used in UI
  tokenId?: string; // Not in the actual Asset interface but used in UI
  listingType: ListingType;
  auctionEndTime?: number;
}

// Mock assets for UI display purposes
export const mockAssets: SimplifiedAsset[] = [
  {
    id: 1,
    title: 'Rolex Daytona 2023',
    category: AssetCategory.WATCHES,
    price: BigNumber.from('30000000000000000000000'), // 30,000 with 18 decimals
    imageUrl: 'https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg',
    isVerified: true,
    validator: 'Swiss Watch Authority',
    description: 'Limited edition Rolex Daytona with platinum case and ceramic bezel. Complete with original box and papers, purchase date January 2023.',
    ownerAddress: '0x1a2b3c...',
    tokenId: '12345',
    specifications: {
      'Brand': 'Rolex',
      'Model': 'Daytona',
      'Reference Number': '116506',
      'Movement': 'Automatic',
      'Case Material': 'Platinum',
      'Bracelet Material': 'Platinum',
      'Year': '2023',
      'Condition': 'Mint',
    },
    listingType: ListingType.AUCTION,
    auctionEndTime: Math.floor(new Date('2025-12-01T13:00:00Z').getTime() / 1000),
  },
  {
    id: 2,
    title: 'Abstract Composition #7',
    category: AssetCategory.ART,
    price: BigNumber.from('15000000000000000000000'), // 15,000 with 18 decimals
    imageUrl: 'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg',
    isVerified: true,
    validator: 'Modern Art Verifiers',
    description: 'Original canvas painting by emerging artist Maya Lin. Certificate of authenticity included.',
    listingType: ListingType.FIXED_PRICE,
  },
  {
    id: 3,
    title: 'First Edition "The Great Gatsby"',
    category: AssetCategory.COLLECTIBLES,
    price: BigNumber.from('7500000000000000000000'), // 7,500 with 18 decimals
    imageUrl: 'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg',
    isVerified: false,
    description: 'First edition, first printing of F. Scott Fitzgerald\'s masterpiece, published in 1925. In good condition with original dust jacket.',
    listingType: ListingType.FIXED_PRICE,
  },
  {
    id: 4,
    title: 'Diamond Necklace 18K Gold',
    category: AssetCategory.JEWELRY,
    price: BigNumber.from('12000000000000000000000'), // 12,000 with 18 decimals
    imageUrl: 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
    isVerified: true,
    validator: 'Gem Certification Institute',
    description: '18K gold necklace with 3-carat total weight diamonds, GIA certified.',
    listingType: ListingType.AUCTION,
    auctionEndTime: Math.floor(new Date('2025-11-15T13:00:00Z').getTime() / 1000),
  },
  {
    id: 5,
    title: 'Patek Philippe Nautilus',
    category: AssetCategory.WATCHES,
    price: BigNumber.from('90000000000000000000000'), // 90,000 with 18 decimals
    imageUrl: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
    isVerified: true,
    validator: 'Swiss Watch Authority',
    description: 'Rare Patek Philippe Nautilus 5711 in stainless steel. Full set with box and papers.',
    listingType: ListingType.FIXED_PRICE,
  },
  {
    id: 6,
    title: 'Luxury Beachfront Villa',
    category: AssetCategory.REAL_ESTATE,
    price: BigNumber.from('2500000000000000000000000'), // 2,500,000 with 18 decimals
    imageUrl: 'https://images.pexels.com/photos/32870/pexels-photo.jpg',
    isVerified: true,
    validator: 'Global Property Validators',
    description: 'Spectacular 5-bedroom beachfront villa in Malibu with direct ocean access, infinity pool, and smart home features.',
    listingType: ListingType.SWAP, // Using SWAP as a replacement for 'lend'
  },
  {
    id: 7,
    title: 'Banksy Limited Print',
    category: AssetCategory.ART,
    price: BigNumber.from('45000000000000000000000'), // 45,000 with 18 decimals
    imageUrl: 'https://images.pexels.com/photos/20967/pexels-photo.jpg',
    isVerified: true,
    validator: 'Urban Art Authenticators',
    description: 'Limited edition Banksy print, hand-numbered 23/150, with certificate of authenticity from Pest Control.',
    listingType: ListingType.SWAP,
  },
  {
    id: 8,
    title: 'Vintage Porsche 911',
    category: AssetCategory.COLLECTIBLES,
    price: BigNumber.from('180000000000000000000000'), // 180,000 with 18 decimals
    imageUrl: 'https://images.pexels.com/photos/3136673/pexels-photo-3136673.jpeg',
    isVerified: false,
    description: '1973 Porsche 911 Carrera RS in Gulf Blue. Numbers matching, documented history, recently restored.',
    listingType: ListingType.FIXED_PRICE,
  },
];

export const mockValidators: Validator[] = [
  {
    id: '1',
    name: 'Swiss Watch Authority',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    expertise: [AssetCategory.WATCHES],
    verificationFee: {
      amount: 500,
      currency: 'USD'
    },
    availability: true,
    responseTime: '24-48 hours',
    reputation: 4.9,
    jurisdiction: 'Switzerland',
    validationCount: 287,
  },
  {
    id: '2',
    name: 'Modern Art Verifiers',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    expertise: [AssetCategory.ART],
    verificationFee: {
      amount: 450,
      currency: 'USD'
    },
    availability: true,
    responseTime: '24 hours',
    reputation: 4.7,
    jurisdiction: 'USA',
    validationCount: 153,
  },
  {
    id: '3',
    name: 'Gem Certification Institute',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    expertise: [AssetCategory.JEWELRY],
    verificationFee: {
      amount: 600,
      currency: 'USD'
    },
    availability: true,
    responseTime: '48 hours',
    reputation: 4.8,
    jurisdiction: 'Global',
    validationCount: 412,
  },
  {
    id: '4',
    name: 'Global Property Validators',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    expertise: [AssetCategory.REAL_ESTATE],
    verificationFee: {
      amount: 1200,
      currency: 'USD'
    },
    availability: false,
    responseTime: '72 hours',
    reputation: 4.6,
    jurisdiction: 'International',
    validationCount: 89,
  },
  {
    id: '5',
    name: 'Collectibles Authentication Board',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg',
    expertise: [AssetCategory.COLLECTIBLES],
    verificationFee: {
      amount: 350,
      currency: 'USD'
    },
    availability: true,
    responseTime: '24-48 hours',
    reputation: 4.5,
    jurisdiction: 'USA, EU',
    validationCount: 342,
  },
  {
    id: '6',
    name: 'Urban Art Authenticators',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    expertise: [AssetCategory.ART],
    verificationFee: {
      amount: 550,
      currency: 'USD'
    },
    availability: true,
    responseTime: '24 hours',
    reputation: 4.9,
    jurisdiction: 'UK',
    validationCount: 127,
  },
];