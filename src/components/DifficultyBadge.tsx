import { Brain } from 'lucide-react'

interface DifficultyBadgeProps {
  difficulty: number | null
  totalRatings?: number
  showNumeric?: boolean
}

export function DifficultyBadge({ difficulty, totalRatings = 0, showNumeric = false }: DifficultyBadgeProps) {
  // If no one has rated the difficulty yet
  if (difficulty === null || totalRatings === 0) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border bg-gray-100 text-gray-600 border-gray-200">
        <Brain className="w-3 h-3 mr-1" />
        측정 전
      </span>
    )
  }

  const getDifficultyInfo = (diff: number) => {
    if (diff < 3.0) {
      return {
        label: '난이도 하',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      }
    } else if (diff < 4.0) {
      return {
        label: '난이도 중',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-200'
      }
    } else {
      return {
        label: '난이도 상',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-200'
      }
    }
  }

  const diffInfo = getDifficultyInfo(difficulty)

  // Show numeric rating with brain icons (like star rating)
  if (showNumeric) {
    const brainCount = Math.round(difficulty)
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Brain
            key={i}
            className={`w-4 h-4 ${
              i < brainCount
                ? 'fill-blue-400 text-blue-400'
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-sm text-blue-600 font-semibold ml-1">
          {difficulty.toFixed(1)}
        </span>
      </div>
    )
  }

  // Show badge format (original)
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${diffInfo.bgColor} ${diffInfo.textColor} ${diffInfo.borderColor}`}>
      <Brain className="w-3 h-3 mr-1" />
      {diffInfo.label}
    </span>
  )
}
