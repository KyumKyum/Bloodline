interface DifficultyBadgeProps {
  difficulty: number | null
  totalRatings?: number
}

export function DifficultyBadge({ difficulty, totalRatings = 0 }: DifficultyBadgeProps) {
  // If no one has rated the difficulty yet
  if (difficulty === null || totalRatings === 0) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border bg-gray-100 text-gray-600 border-gray-200">
        측정 전
      </span>
    )
  }

  const getDifficultyInfo = (diff: number) => {
    if (diff <= 2.9) {
      return {
        label: '난이도 하',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-200'
      }
    } else if (diff >= 3.0 && diff <= 3.9) {
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

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${diffInfo.bgColor} ${diffInfo.textColor} ${diffInfo.borderColor}`}>
      {diffInfo.label}
    </span>
  )
}
