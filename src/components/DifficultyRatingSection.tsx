'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Brain, Star } from 'lucide-react'
import { DifficultyBadge } from './DifficultyBadge'

interface DifficultyRatingSectionProps {
  mysteryId: string
  averageDifficulty: number | null
  totalDifficultyRatings: number
}

export function DifficultyRatingSection({ 
  mysteryId, 
  averageDifficulty, 
  totalDifficultyRatings 
}: DifficultyRatingSectionProps) {
  const { data: session } = useSession()
  const [userDifficultyRating, setUserDifficultyRating] = useState<number>(0)
  const [hoverDifficultyRating, setHoverDifficultyRating] = useState<number>(0)
  const [inputRating, setInputRating] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDifficultyRatingSubmit = async (rating: number) => {
    if (!session || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/difficulty-ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mysteryId,
          difficulty: rating,
        }),
      })

      if (response.ok) {
        setUserDifficultyRating(rating)
        setInputRating('')
        // Optionally refresh the page or update the average rating
        window.location.reload()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit difficulty rating')
      }
    } catch (error) {
      console.error('Error submitting difficulty rating:', error)
      alert('Failed to submit difficulty rating')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputSubmit = () => {
    const rating = parseFloat(inputRating)
    if (isNaN(rating) || rating < 1.0 || rating > 5.0) {
      alert('난이도는 1.0에서 5.0 사이의 숫자여야 합니다 (예: 3.5)')
      return
    }
    
    // Round to one decimal place
    const roundedRating = Math.round(rating * 10) / 10
    handleDifficultyRatingSubmit(roundedRating)
  }

  const renderDifficultyStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < (interactive ? (hoverDifficultyRating || userDifficultyRating) : Math.floor(rating))
      const partiallyFilled = !interactive && i < rating && i >= Math.floor(rating)
      
      return (
        <Brain
          key={i}
          className={`w-5 h-5 ${
            interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
          } ${
            filled
              ? 'fill-purple-400 text-purple-400'
              : partiallyFilled
              ? 'fill-purple-200 text-purple-400'
              : 'text-gray-300'
          }`}
          onClick={interactive ? () => handleDifficultyRatingSubmit(i + 1) : undefined}
          onMouseEnter={interactive ? () => setHoverDifficultyRating(i + 1) : undefined}
          onMouseLeave={interactive ? () => setHoverDifficultyRating(0) : undefined}
        />
      )
    })
  }

  return (
    <div className="space-y-4 border-t pt-4">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-gray-900">난이도 평가</span>
          <DifficultyBadge 
            difficulty={averageDifficulty} 
            totalRatings={totalDifficultyRatings} 
          />
        </div>
        {averageDifficulty !== null && totalDifficultyRatings > 0 && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {renderDifficultyStars(averageDifficulty)}
            </div>
            <span className="text-sm font-semibold text-purple-600">
              {averageDifficulty.toFixed(1)}
            </span>
            <span className="text-gray-500 text-sm">
              ({totalDifficultyRatings} rating{totalDifficultyRatings !== 1 ? 's' : ''})
            </span>
          </div>
        )}
      </div>

      {session ? (
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-purple-900 mb-2">이 미스터리의 난이도를 평가해주세요</h4>
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center">
              {renderDifficultyStars(0, true)}
            </div>
            {isSubmitting && (
              <span className="text-sm text-purple-600">제출 중...</span>
            )}
          </div>
          <div className="flex justify-between text-xs text-purple-700 mb-3">
            <span>매우 쉬움</span>
            <span>매우 어려움</span>
          </div>
          
          <div className="border-t border-purple-200 mt-3 pt-3">
            <div className="flex items-center justify-center space-x-2">
              <input
                type="number"
                min="1.0"
                max="5.0"
                step="0.1"
                value={inputRating}
                onChange={(e) => setInputRating(e.target.value)}
                placeholder="3.5"
                className="w-20 px-2 py-1 border border-purple-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isSubmitting}
              />
              <button
                onClick={handleInputSubmit}
                disabled={isSubmitting || !inputRating}
                className={`px-3 py-1 bg-purple-600 text-white rounded text-sm transition-colors ${
                  isSubmitting || !inputRating 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-purple-700'
                }`}
              >
                평가
              </button>
            </div>
            <p className="text-xs text-purple-600 text-center mt-2">
              정확한 평가를 위해 소수점까지 입력 가능 (예: 3.5, 4.2)
            </p>
          </div>
          
          <p className="text-xs text-purple-600 mt-3 text-center">
            두뇌 아이콘을 클릭하거나 숫자로 난이도를 평가하세요 (1.0-5.0)
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-600 text-sm">
            <a href="/auth/signin" className="text-purple-600 hover:underline">
              로그인
            </a>
            하여 난이도를 평가해보세요
          </p>
        </div>
      )}
    </div>
  )
}