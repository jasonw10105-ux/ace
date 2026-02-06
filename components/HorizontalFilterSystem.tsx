
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './design-system/Button';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface HorizontalFilterSystemProps {
  categories?: FilterOption[];
  mediums?: FilterOption[];
  priceRanges?: FilterOption[];
  onFilterChange?: (filters: Record<string, string[]>) => void;
  totalCount?: number;
  filteredCount?: number;
  className?: string;
}

const HorizontalFilterSystem: React.FC<HorizontalFilterSystemProps> = ({
  categories = [],
  mediums = [],
  priceRanges = [],
  onFilterChange,
  totalCount,
  filteredCount,
  className = ''
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    categories: [],
    mediums: [],
    priceRanges: []
  });

  const handleFilterToggle = (filterType: string, filterId: string) => {
    const newFilters = { ...selectedFilters };
    if (newFilters[filterType].includes(filterId)) {
      newFilters[filterType] = newFilters[filterType].filter(id => id !== filterId);
    } else {
      newFilters[filterType] = [...newFilters[filterType], filterId];
    }
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const cleared = { categories: [], mediums: [], priceRanges: [] };
    setSelectedFilters(cleared);
    onFilterChange?.(cleared);
  };

  const hasActiveFilters = Object.values(selectedFilters).some(f => f.length > 0);

  const renderGroup = (title: string, options: FilterOption[], type: string) => (
    <div className="flex flex-col gap-2">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</h4>
      <div className="flex gap-2">
        {options.map(opt => {
          const isSelected = selectedFilters[type].includes(opt.id);
          return (
            <button
              key={opt.id}
              onClick={() => handleFilterToggle(type, opt.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                isSelected ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
              }`}
            >
              {opt.label} {opt.count && <span className="opacity-40 ml-1">({opt.count})</span>}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`flex items-center gap-10 bg-white p-8 rounded-[2rem] border border-gray-100 overflow-x-auto ${className}`}>
      {(totalCount !== undefined) && (
        <div className="shrink-0 border-r border-gray-50 pr-10">
           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Synthesis</p>
           <p className="text-xl font-serif font-bold italic">{filteredCount ?? totalCount} <span className="text-sm font-sans font-normal text-gray-300">of {totalCount}</span></p>
        </div>
      )}
      {categories.length > 0 && renderGroup('Categories', categories, 'categories')}
      {mediums.length > 0 && renderGroup('Mediums', mediums, 'mediums')}
      {priceRanges.length > 0 && renderGroup('Pricing', priceRanges, 'priceRanges')}
      
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters} style={{ marginLeft: 'auto' }}>
          <X size={14} className="mr-2" /> Clear
        </Button>
      )}
    </div>
  );
};

export default HorizontalFilterSystem;
