'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export type SortOption = 'default' | 'rating-high' | 'rating-low' | 'difficulty-high' | 'difficulty-low';

interface MysterySortProps {
  onSortChange: (sortOption: SortOption) => void;
  currentSort: SortOption;
}

export function MysterySort({ onSortChange, currentSort }: MysterySortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sortOptions = [
    { value: 'default' as SortOption, label: '기본 정렬 (최신순)' },
    { value: 'rating-high' as SortOption, label: '평점 높은 순' },
    { value: 'rating-low' as SortOption, label: '평점 낮은 순' },
    { value: 'difficulty-high' as SortOption, label: '난이도 높은 순' },
    { value: 'difficulty-low' as SortOption, label: '난이도 낮은 순' },
  ];

  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label;

  const handleSortChange = (sortOption: SortOption) => {
    onSortChange(sortOption);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between w-48 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      >
        <span>{currentSortLabel}</span>
        <ChevronDown 
          className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-48 mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                  currentSort === option.value 
                    ? 'bg-red-50 text-red-700 font-medium' 
                    : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}