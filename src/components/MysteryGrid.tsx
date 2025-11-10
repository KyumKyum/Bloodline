'use client';

import { useState, useEffect } from 'react';
import { MysteryCard } from './MysteryCard';
import { MysterySort, SortOption } from './MysterySort';

interface Mystery {
  id: string;
  slug: string;
  title: string;
  synopsis: string;
  imagePath: string;
  averageRating: number | null;
  totalRatings: number;
  difficulty: number;
  averageDifficulty: number | null;
  totalDifficultyRatings: number;
  totalComments: number;
  enlisted: string;
}

export function MysteryGrid() {
  const [mysteries, setMysteries] = useState<Mystery[]>([]);
  const [sortedMysteries, setSortedMysteries] = useState<Mystery[]>([]);
  const [currentSort, setCurrentSort] = useState<SortOption>('default');
  const [loading, setLoading] = useState(true);

  // Fetch mysteries on component mount
  useEffect(() => {
    const fetchMysteries = async () => {
      try {
        const response = await fetch('/api/mysteries');
        if (response.ok) {
          const data = await response.json();
          setMysteries(data);
          setSortedMysteries(data);
        }
      } catch (error) {
        console.error('Failed to fetch mysteries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMysteries();
  }, []);

  // Sort mysteries when sort option changes
  useEffect(() => {
    const sorted = [...mysteries].sort((a, b) => {
      switch (currentSort) {
        case 'rating-high':
          // Nulls last, then descending
          if (a.averageRating === null && b.averageRating === null) return 0;
          if (a.averageRating === null) return 1;
          if (b.averageRating === null) return -1;
          return b.averageRating - a.averageRating;
        
        case 'rating-low':
          // Nulls last, then ascending
          if (a.averageRating === null && b.averageRating === null) return 0;
          if (a.averageRating === null) return 1;
          if (b.averageRating === null) return -1;
          return a.averageRating - b.averageRating;
        
        case 'difficulty-high':
          // Nulls last, then descending
          if (a.averageDifficulty === null && b.averageDifficulty === null) return 0;
          if (a.averageDifficulty === null) return 1;
          if (b.averageDifficulty === null) return -1;
          return b.averageDifficulty - a.averageDifficulty;
        
        case 'difficulty-low':
          // Nulls last, then ascending
          if (a.averageDifficulty === null && b.averageDifficulty === null) return 0;
          if (a.averageDifficulty === null) return 1;
          if (b.averageDifficulty === null) return -1;
          return a.averageDifficulty - b.averageDifficulty;
        
        case 'default':
        default:
          // Sort by enlisted date (newest first)
          return new Date(b.enlisted).getTime() - new Date(a.enlisted).getTime();
      }
    });
    
    setSortedMysteries(sorted);
  }, [mysteries, currentSort]);

  const handleSortChange = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-600">미스터리를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sorting Controls */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          총 {mysteries.length}개의 미스터리
        </p>
        <MysterySort 
          onSortChange={handleSortChange} 
          currentSort={currentSort} 
        />
      </div>

      {/* Mystery Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedMysteries.map((mystery) => (
          <MysteryCard
            key={mystery.id}
            mystery={mystery}
          />
        ))}
      </div>

      {mysteries.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No mysteries found.</p>
          <p className="text-gray-400">Check back soon for new cases!</p>
        </div>
      )}
    </div>
  );
}