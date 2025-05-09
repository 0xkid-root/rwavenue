import { faker } from '@faker-js/faker';
import { AssetCategory, ListingType } from '@/types';
import { Validator } from '@/services/validatorService';
import type { Transaction as TransactionHistory } from '@/types/transaction';
import { BigNumber } from 'ethers';

// Define transaction types based on the transaction.ts file
type TransactionType = 'buy' | 'sell' | 'validate' | 'tokenize';

// Seed for consistent data
faker.seed(123);

const CATEGORIES: AssetCategory[] = [AssetCategory.WATCHES, AssetCategory.ART, AssetCategory.COLLECTIBLES, AssetCategory.JEWELRY, AssetCategory.REAL_ESTATE];
const LISTING_TYPES = [ListingType.FIXED_PRICE, ListingType.AUCTION, ListingType.SWAP] as const;

const WATCH_BRANDS = ['Rolex', 'Patek Philippe', 'Audemars Piguet', 'Richard Mille', 'Vacheron Constantin'];
const WATCH_MODELS = {
  'Rolex': ['Daytona', 'Submariner', 'GMT-Master II', 'Day-Date', 'Sky-Dweller'],
  'Patek Philippe': ['Nautilus', 'Calatrava', 'Grand Complications', 'Aquanaut', 'Perpetual Calendar'],
  'Audemars Piguet': ['Royal Oak', 'Royal Oak Offshore', 'Code 11.59', 'Millenary', 'Jules Audemars'],
  'Richard Mille': ['RM 11-03', 'RM 27-04', 'RM 35-02', 'RM 67-02', 'RM 72-01'],
  'Vacheron Constantin': ['Overseas', 'Patrimony', 'Traditionnelle', 'Historiques', 'Métiers d\'Art']
};

const ART_STYLES = ['Contemporary', 'Abstract', 'Modern', 'Impressionist', 'Digital', 'Photography'];
const ART_MEDIUMS = ['Oil on Canvas', 'Acrylic', 'Mixed Media', 'Digital Print', 'Photography', 'Sculpture'];

const REAL_ESTATE_TYPES = ['Luxury Villa', 'Penthouse', 'Beachfront Property', 'Historic Mansion', 'Private Island'];
const REAL_ESTATE_LOCATIONS = ['Beverly Hills', 'Manhattan', 'Miami Beach', 'French Riviera', 'Dubai'];

const JEWEL_TYPES = ['Diamond Ring', 'Sapphire Necklace', 'Emerald Earrings', 'Ruby Bracelet', 'Pearl Collection'];
const JEWEL_MATERIALS = ['18K White Gold', 'Platinum', 'Rose Gold', 'Yellow Gold', 'Sterling Silver'];

const COLLECTIBLE_TYPES = [
  'Vintage Car',
  'Rare Coin',
  'First Edition Book',
  'Sports Memorabilia',
  'Limited Edition Item'
];

// Create a simplified asset type for mock data
interface SimplifiedAsset {
  id: number;
  title: string;
  description: string;
  category: AssetCategory;
  price: BigNumber;
  imageUrl?: string;
  isVerified?: boolean;
  validator?: string;
  specifications?: Record<string, string>;
  ownerAddress?: string;
  tokenId?: string;
  listingType: ListingType;
  auctionEndTime?: number;
}

export const generateMockAsset = (): SimplifiedAsset => {
  const category = faker.helpers.arrayElement(CATEGORIES);
  const listingType = faker.helpers.arrayElement(LISTING_TYPES);
  
  const title = generateAssetTitle(category);
  // price is no longer used since we're using BigNumber directly
  const description = generateAssetDescription(category, title);
  const specifications = generateSpecifications(category);
  const imageUrl = getImageUrlForCategory(category);
  
  return {
    id: parseInt(faker.string.numeric(6)),
    title,
    category,
    price: faker.helpers.arrayElement([
      BigNumber.from('1000000000000000000000'), // 1,000
      BigNumber.from('5000000000000000000000'), // 5,000
      BigNumber.from('10000000000000000000000'), // 10,000
      BigNumber.from('50000000000000000000000'), // 50,000
      BigNumber.from('100000000000000000000000'), // 100,000
    ]),
    imageUrl,
    isVerified: faker.datatype.boolean({ probability: 0.7 }),
    validator: faker.company.name(),
    description,
    ownerAddress: `0x${faker.string.hexadecimal({ length: 40 })}`,
    tokenId: faker.string.numeric(6),
    specifications,
    listingType,
    auctionEndTime: listingType === ListingType.AUCTION ? 
      Math.floor(faker.date.future().getTime() / 1000) : 
      undefined,
  };
};

function generateAssetTitle(category: AssetCategory): string {
  switch (category) {
    case AssetCategory.WATCHES: {
      const brand = faker.helpers.arrayElement(WATCH_BRANDS);
      // Use type assertion to handle the indexing
      const model = faker.helpers.arrayElement(WATCH_MODELS[brand as keyof typeof WATCH_MODELS]);
      const year = faker.number.int({ min: 2020, max: 2025 });
      return `${brand} ${model} ${year}`;
    }
    
    case AssetCategory.ART: {
      const style = faker.helpers.arrayElement(ART_STYLES);
      const medium = faker.helpers.arrayElement(ART_MEDIUMS);
      return `${style} ${medium} "${faker.word.words(2)}"`;
    }
    
    case AssetCategory.REAL_ESTATE: {
      const type = faker.helpers.arrayElement(REAL_ESTATE_TYPES);
      const location = faker.helpers.arrayElement(REAL_ESTATE_LOCATIONS);
      return `${type} in ${location}`;
    }
    
    case AssetCategory.JEWELRY: {
      const type = faker.helpers.arrayElement(JEWEL_TYPES);
      const material = faker.helpers.arrayElement(JEWEL_MATERIALS);
      return `${type} in ${material}`;
    }
    
    case AssetCategory.COLLECTIBLES: {
      const type = faker.helpers.arrayElement(COLLECTIBLE_TYPES);
      return `${faker.helpers.arrayElement(['Rare', 'Vintage', 'Limited Edition'])} ${type}`;
    }
    
    default:
      return faker.commerce.productName();
  }
}

// This function is kept for reference but no longer used since we're using BigNumber directly
// Remove the 'price' variable from generateMockAsset to avoid the unused variable warning
// function generateAssetPrice(category: AssetCategory): { amount: number; currency: 'USDT' | 'ETH' } {
//   const currency = faker.helpers.arrayElement(['USDT', 'ETH']) as 'USDT' | 'ETH';
//   let amount: number;

//   switch (category) {
//     case AssetCategory.WATCHES:
//       amount = faker.number.int({ min: 10000, max: 500000 });
//       break;
//     case AssetCategory.ART:
//       amount = faker.number.int({ min: 5000, max: 1000000 });
//       break;
//     case AssetCategory.REAL_ESTATE:
//       amount = faker.number.int({ min: 500000, max: 10000000 });
//       break;
//     case AssetCategory.JEWELRY:
//       amount = faker.number.int({ min: 5000, max: 250000 });
//       break;
//     case AssetCategory.COLLECTIBLES:
//       amount = faker.number.int({ min: 1000, max: 100000 });
//       break;
//     default:
//       amount = faker.number.int({ min: 1000, max: 50000 });
//   }

//   // If currency is ETH, convert to ETH equivalent (roughly $2000 per ETH)
//   if (currency === 'ETH') {
//     amount = Number((amount / 2000).toFixed(2));
//   }

//   return { amount, currency };
// }

function generateAssetDescription(category: AssetCategory, title: string): string {
  switch (category) {
    case AssetCategory.WATCHES:
      return `${title} in ${faker.helpers.arrayElement(['mint', 'excellent', 'good'])} condition. ${
        faker.helpers.arrayElement([
          'Complete with original box and papers.',
          'Limited edition piece.',
          'Rare collector\'s item.',
          'Recently serviced by authorized dealer.'
        ])} ${faker.lorem.paragraph()}`;
    
    case AssetCategory.ART:
      return `Original ${title.toLowerCase()} by renowned artist ${faker.person.fullName()}. ${
        faker.helpers.arrayElement([
          'Signed by the artist.',
          'Includes certificate of authenticity.',
          'From a private collection.',
          'Exhibition history available.'
        ])} ${faker.lorem.paragraph()}`;
    
    case AssetCategory.REAL_ESTATE:
      return `Luxurious ${title.toLowerCase()} featuring ${faker.number.int({ min: 4, max: 8 })} bedrooms and ${
        faker.number.int({ min: 4, max: 10 })} bathrooms. ${faker.lorem.paragraphs(2)}`;
    
    default:
      return faker.lorem.paragraphs(2);
  }
}

function generateSpecifications(category: AssetCategory): Record<string, string> {
  const baseSpecs = {
    'Condition': faker.helpers.arrayElement(['Mint', 'Excellent', 'Good', 'Fair']),
    'Year': faker.date.past().getFullYear().toString(),
  };

  switch (category) {
    case AssetCategory.WATCHES:
      return {
        ...baseSpecs,
        'Brand': faker.helpers.arrayElement(WATCH_BRANDS),
        'Model': faker.helpers.arrayElement(WATCH_MODELS[WATCH_BRANDS[0] as keyof typeof WATCH_MODELS]),
        'Movement': faker.helpers.arrayElement(['Automatic', 'Manual', 'Quartz']),
        'Case Material': faker.helpers.arrayElement(['Steel', 'Gold', 'Platinum', 'Titanium']),
        'Dial': faker.helpers.arrayElement(['Black', 'White', 'Blue', 'Silver']),
        'Bracelet Material': faker.helpers.arrayElement(['Steel', 'Leather', 'Rubber']),
        'Water Resistance': faker.helpers.arrayElement(['30m', '50m', '100m', '300m']),
      };

    case 'art':
      return {
        ...baseSpecs,
        'Artist': faker.person.fullName(),
        'Medium': faker.helpers.arrayElement(ART_MEDIUMS),
        'Style': faker.helpers.arrayElement(ART_STYLES),
        'Dimensions': `${faker.number.int({ min: 20, max: 200 })}x${faker.number.int({ min: 20, max: 200 })} cm`,
        'Signed': faker.helpers.arrayElement(['Yes', 'No']),
        'Framed': faker.helpers.arrayElement(['Yes', 'No']),
        'Provenance': faker.helpers.arrayElement([
          'Private Collection',
          'Gallery Collection',
          'Artist Studio',
          'Auction House'
        ]),
      };

    case AssetCategory.JEWELRY:
      return {
        ...baseSpecs,
        'Metal': faker.helpers.arrayElement(JEWEL_MATERIALS),
        'Stone': faker.helpers.arrayElement(['Diamond', 'Sapphire', 'Ruby', 'Emerald']),
        'Carat Weight': faker.number.float({ min: 0.5, max: 5.0, precision: 0.01 }).toString(),
        'Cut': faker.helpers.arrayElement(['Excellent', 'Very Good', 'Good']),
        'Clarity': faker.helpers.arrayElement(['IF', 'VVS1', 'VVS2', 'VS1', 'VS2']),
        'Color': faker.helpers.arrayElement(['D', 'E', 'F', 'G', 'H']),
        'Certification': faker.helpers.arrayElement(['GIA', 'IGI', 'HRD']),
      };

    case 'real-estate':
      return {
        ...baseSpecs,
        'Property Type': faker.helpers.arrayElement(REAL_ESTATE_TYPES),
        'Location': faker.helpers.arrayElement(REAL_ESTATE_LOCATIONS),
        'Size': `${faker.number.int({ min: 200, max: 1000 })} sq m`,
        'Bedrooms': faker.number.int({ min: 3, max: 8 }).toString(),
        'Bathrooms': faker.number.int({ min: 3, max: 8 }).toString(),
        'Parking': faker.helpers.arrayElement(['2 Cars', '3 Cars', '4+ Cars']),
        'Features': faker.helpers.arrayElements([
          'Pool',
          'Garden',
          'Smart Home',
          'Security System',
          'Wine Cellar',
          'Home Theater'
        ], { min: 2, max: 4 }).join(', '),
      };

    case 'collectibles':
      return {
        ...baseSpecs,
        'Type': faker.helpers.arrayElement(COLLECTIBLE_TYPES),
        'Rarity': faker.helpers.arrayElement(['Common', 'Uncommon', 'Rare', 'Ultra Rare']),
        'Edition': faker.helpers.arrayElement(['First Edition', 'Limited Edition', 'Special Release']),
        'Authentication': faker.helpers.arrayElement(['Yes', 'No']),
        'Provenance': faker.helpers.arrayElement([
          'Private Collection',
          'Auction House',
          'Museum',
          'Original Owner'
        ]),
      };

    default:
      return baseSpecs;
  }
}

function getImageUrlForCategory(category: AssetCategory): string {
  const images: Record<string, string[]> = {
    [AssetCategory.WATCHES]: [
      'https://images.pexels.com/photos/9978722/pexels-photo-9978722.jpeg',
      'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
      'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg',
      'https://images.pexels.com/photos/364822/pexels-photo-364822.jpeg',
      'https://images.pexels.com/photos/2783873/pexels-photo-2783873.jpeg',
    ],
    [AssetCategory.ART]: [
      'https://images.pexels.com/photos/1585325/pexels-photo-1585325.jpeg',
      'https://images.pexels.com/photos/20967/pexels-photo.jpg',
      'https://images.pexels.com/photos/1568607/pexels-photo-1568607.jpeg',
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg',
      'https://images.pexels.com/photos/2119706/pexels-photo-2119706.jpeg',
    ],
    [AssetCategory.COLLECTIBLES]: [
      'https://images.pexels.com/photos/46274/pexels-photo-46274.jpeg',
      'https://images.pexels.com/photos/3136673/pexels-photo-3136673.jpeg',
      'https://images.pexels.com/photos/2115217/pexels-photo-2115217.jpeg',
      'https://images.pexels.com/photos/1021876/pexels-photo-1021876.jpeg',
      'https://images.pexels.com/photos/159275/macro-focus-cogwheel-gear-159275.jpeg',
    ],
    [AssetCategory.JEWELRY]: [
      'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg',
      'https://images.pexels.com/photos/248077/pexels-photo-248077.jpeg',
      'https://images.pexels.com/photos/2735970/pexels-photo-2735970.jpeg',
      'https://images.pexels.com/photos/10917590/pexels-photo-10917590.jpeg',
      'https://images.pexels.com/photos/4937755/pexels-photo-4937755.jpeg',
    ],
    [AssetCategory.REAL_ESTATE]: [
      'https://images.pexels.com/photos/32870/pexels-photo.jpg',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
      'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg',
      'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg',
      'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg',
    ],
  };

  return faker.helpers.arrayElement(images[category]);
}

export const generateMockValidator = (): Validator => {
  const expertise = faker.helpers.arrayElements(CATEGORIES, { min: 1, max: 3 });
  const name = `${faker.helpers.arrayElement([
    'Global',
    'International',
    'Premium',
    'Elite',
    'Expert'
  ])} ${expertise[0].charAt(0).toUpperCase() + expertise[0].slice(1)} Validators`;

  return {
    id: faker.string.uuid(),
    name,
    avatar: faker.image.avatar(),
    expertise,
    reputation: faker.number.float({ min: 4.0, max: 5.0, precision: 0.1 }),
    jurisdiction: faker.location.country(),
    validationCount: faker.number.int({ min: 50, max: 500 }),
    verificationFee: {
      amount: faker.number.int({ min: 300, max: 1500 }),
      currency: 'USD'
    },
    availability: faker.datatype.boolean({ probability: 0.8 }),
    responseTime: faker.helpers.arrayElement(['24 hours', '24-48 hours', '48 hours', '72 hours']),
  };
};

export const generateMockTransaction = (): TransactionHistory => {
  // Define valid transaction types
  const transactionTypes: TransactionType[] = ['buy', 'sell', 'validate', 'tokenize'];
  const type = faker.helpers.arrayElement(transactionTypes);
  
  return {
    id: faker.string.uuid(),
    date: new Date(faker.date.recent()),
    type,
    from: `0x${faker.string.hexadecimal({ length: 40 })}`,
    to: `0x${faker.string.hexadecimal({ length: 40 })}`,
    amount: type === 'validate' ? 0 : faker.number.float({ min: 1000, max: 100000 }),
    assetId: faker.string.uuid(),
    status: faker.helpers.arrayElement(['completed', 'pending', 'failed']) as 'completed' | 'pending' | 'failed',
  };
};

// Generate initial mock data
export const generateInitialMockData = (count = 20) => {
  const assets = Array.from({ length: count }, generateMockAsset);
  const validators = Array.from({ length: 10 }, generateMockValidator);
  const transactions = Array.from({ length: 30 }, generateMockTransaction);

  return {
    assets,
    validators,
    transactions,
  };
};

// Generate paginated data
export const generatePaginatedData = ( limit: number) => {
  // Calculate offset (commented out since it's not used)
  // const offset = (page - 1) * limit;
  const assets = Array.from({ length: limit }, generateMockAsset);
  return assets;
};