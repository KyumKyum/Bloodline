'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Star } from 'lucide-react'

interface RatingSectionProps {
  mysteryId: string
  averageRating: number | null
  totalRatings: number
}

export function RatingSection({ 
  mysteryId, 
  averageRating, 
  totalRatings 
}: RatingSectionProps) {
  const { data: session } = useSession()
  const [userRating, setUserRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [inputRating, setInputRating] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingSubmit = async (rating: number) => {
    if (!session || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mysteryId,
          rating,
        }),
      })

      if (response.ok) {
        setUserRating(rating)
        setInputRating('')
        // Optionally refresh the page or update the average rating
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit rating')
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      alert('Failed to submit rating')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputSubmit = () => {
    const rating = parseFloat(inputRating)
    if (isNaN(rating) || rating < 1.0 || rating > 5.0) {
      alert('평점은 1.0에서 5.0 사이의 숫자여야 합니다 (예: 3.5)')
      return
    }
    
    // Round to one decimal place
    const roundedRating = Math.round(rating * 10) / 10
    handleRatingSubmit(roundedRating)
  }

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < (interactive ? (hoverRating || userRating) : Math.floor(rating))
      const partiallyFilled = !interactive && i < rating && i >= Math.floor(rating)
      
      return (
        <Star
          key={i}
          className={`w-5 h-5 ${
            interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
          } ${
            filled
              ? 'fill-yellow-400 text-yellow-400'
              : partiallyFilled
              ? 'fill-yellow-200 text-yellow-400'
              : 'text-gray-300'
          }`}
          onClick={interactive ? () => handleRatingSubmit(i + 1) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        />
      )
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-600" />
          <span className="font-medium text-gray-900">평점</span>
        </div>
        {averageRating !== null && totalRatings > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderStars(averageRating)}
            </div>
            <span className="text-sm font-semibold text-yellow-600">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-500 text-sm">
              ({totalRatings} rating{totalRatings !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {session ? (
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-yellow-900 mb-2">이 미스터리를 평가해주세요</h4>
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              {renderStars(0, true)}
            </div>
            {isSubmitting && (
              <span className="text-sm text-yellow-600">제출 중...</span>
            )}
          </div>
          <div className="flex justify-between text-xs text-yellow-700 mb-3">
            <span>매우 나쁨</span>
            <span>매우 좋음</span>
          </div>
          
          <div className="border-t border-yellow-200 mt-3 pt-3">
            <div className="flex items-center justify-center space-x-2">
              <input
                type="number"
                min="1.0"
                max="5.0"
                step="0.1"
                value={inputRating}
                onChange={(e) => setInputRating(e.target.value)}
                placeholder="3.5"
                className="w-20 px-2 py-1 border border-yellow-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                disabled={isSubmitting}
              />
              <button
                onClick={handleInputSubmit}
                disabled={isSubmitting || !inputRating}
                className={`px-3 py-1 bg-yellow-600 text-white rounded text-sm transition-colors ${
                  isSubmitting || !inputRating 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-yellow-700'
                }`}
              >
                평가
              </button>
            </div>
            <p className="text-xs text-yellow-600 text-center mt-2">
              정확한 평가를 위해 소수점까지 입력 가능 (예: 3.5, 4.2)
            </p>
          </div>
          
          <p className="text-xs text-yellow-600 mt-3 text-center">
            별을 클릭하거나 숫자로 평점을 평가하세요 (1.0-5.0)
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">
            <a href="/auth/signin" className="text-yellow-600 hover:underline">
              로그인
            </a>
            하여 평점을 평가해보세요
          </p>
        </div>
      )}
    </div>
  )
}