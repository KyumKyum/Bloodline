import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { DifficultyBadge } from './DifficultyBadge'

interface MysteryCardProps {
  mystery: {
    id: string
    slug: string
    title: string
    synopsis: string
    imagePath: string
    averageRating: number | null
    totalRatings: number
    difficulty: number
    averageDifficulty: number | null
    totalDifficultyRatings: number
  }
}

export function MysteryCard({ mystery }: MysteryCardProps) {
  const renderStars = (rating: number | null) => {
    if (rating === null) return null
    
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <Link href={`/mystery/${mystery.slug}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48">
          <Image
            src={mystery.imagePath}
            alt={mystery.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 right-3">
            <DifficultyBadge 
              difficulty={mystery.averageDifficulty} 
              totalRatings={mystery.totalDifficultyRatings} 
            />
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
            {mystery.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {mystery.synopsis}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(mystery.averageRating)}
              </div>
              {mystery.averageRating !== null && (
                <span className="text-sm text-yellow-600 font-semibold">
                  {mystery.averageRating.toFixed(1)}
                </span>
              )}
              {mystery.totalRatings > 0 && (
                <span className="text-sm text-gray-500">
                  ({mystery.totalRatings})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}