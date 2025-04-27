import React, { useState } from 'react';
import { Filter, Sliders, X } from 'lucide-react';
import { AssetCategory, Filter as FilterType } from '../types';
import { Button } from './ui/Button';

interface MarketplaceFiltersProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  isMobile?: boolean;
}

export const MarketplaceFilters = ({ 
  filter, 
  onFilterChange,
  isMobile = false
}: MarketplaceFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryChange = (category: AssetCategory | undefined) => {
    onFilterChange({ ...filter, category });
  };

  const handleSortChange = (sort: FilterType['sort']) => {
    onFilterChange({ ...filter, sort });
  };

  const handleVerifiedChange = () => {
    onFilterChange({ ...filter, verifiedOnly: !filter.verifiedOnly });
  };

  const categories: { value: AssetCategory | undefined, label: string }[] = [
    { value: undefined, label: 'All Categories' },
    { value: 'watches', label: 'Watches' },
    { value: 'art', label: 'Art' },
    { value: 'collectibles', label: 'Collectibles' },
    { value: 'jewels', label: 'Jewels' },
    { value: 'real-estate', label: 'Real Estate' },
  ];

  const sortOptions: { value: FilterType['sort'], label: string }[] = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'ending-soon', label: 'Auction Ending Soon' },
  ];

  if (isMobile) {
    return (
      <>
        <div className="mb-4 flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFilter}
            icon={<Filter size={18} />}
          >
            Filters
          </Button>
          
          <div className="flex items-center gap-2">
            <select
              className="input py-1 px-2 text-sm"
              value={filter.sort}
              onChange={(e) => handleSortChange(e.target.value as FilterType['sort'])}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-end">
            <div className="bg-white w-3/4 h-full p-4 overflow-y-auto animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filters</h3>
                <button onClick={toggleFilter}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium mb-2">Category</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <div key={category.label} className="flex items-center">
                      <input
                        type="radio"
                        id={`category-${category.label}`}
                        name="category"
                        checked={filter.category === category.value}
                        onChange={() => handleCategoryChange(category.value)}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category.label}`}>{category.label}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verified-only"
                    checked={filter.verifiedOnly}
                    onChange={handleVerifiedChange}
                    className="mr-2"
                  />
                  <label htmlFor="verified-only">Verified by Validators</label>
                </div>
              </div>
              
              <Button onClick={toggleFilter} fullWidth>Apply Filters</Button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4">
        <h3 className="font-semibold flex items-center">
          <Sliders size={16} className="mr-2" />
          Filters
        </h3>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Category</h4>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category.label} className="flex items-center">
              <input
                type="radio"
                id={`category-${category.label}`}
                name="category"
                checked={filter.category === category.value}
                onChange={() => handleCategoryChange(category.value)}
                className="mr-2"
              />
              <label htmlFor={`category-${category.label}`}>{category.label}</label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium mb-2">Sort By</h4>
        <select
          className="input"
          value={filter.sort}
          onChange={(e) => handleSortChange(e.target.value as FilterType['sort'])}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="verified-only"
            checked={filter.verifiedOnly}
            onChange={handleVerifiedChange}
            className="mr-2"
          />
          <label htmlFor="verified-only">Verified by Validators</label>
        </div>
      </div>
    </div>
  );
};