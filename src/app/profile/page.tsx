import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/Header'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { DifficultyBadge } from '@/components/DifficultyBadge'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata = {
  title: 'My Profile - Bloodline',
  description: '내가 평가한 머더 미스터리 목록을 확인하세요',
}

async function getUserRatings(userId: string) {
  const [ratings, difficultyRatings] = await Promise.all([
    // Get user's star ratings with mystery details
    prisma.rating.findMany({
      where: { userId },
      include: {
        mystery: true
      },
      orderBy: { updatedAt: 'desc' }
    }),
    
    // Get user's difficulty ratings with mystery details
    prisma.difficultyRating.findMany({
      where: { userId },
      include: {
        mystery: true
      },
      orderBy: { updatedAt: 'desc' }
    })
  ])

  // Combine the data by mystery
  const mysteriesMap = new Map()

  // Add star ratings
  ratings.forEach(rating => {
    mysteriesMap.set(rating.mysteryId, {
      mystery: rating.mystery,
      starRating: rating.rating,
      starRatedAt: rating.updatedAt,
      difficultyRating: null,
      difficultyRatedAt: null
    })
  })

  // Add difficulty ratings
  difficultyRatings.forEach(rating => {
    if (mysteriesMap.has(rating.mysteryId)) {
      // Update existing entry
      const existing = mysteriesMap.get(rating.mysteryId)
      existing.difficultyRating = rating.difficulty
      existing.difficultyRatedAt = rating.updatedAt
    } else {
      // Create new entry
      mysteriesMap.set(rating.mysteryId, {
        mystery: rating.mystery,
        starRating: null,
        starRatedAt: null,
        difficultyRating: rating.difficulty,
        difficultyRatedAt: rating.updatedAt
      })
    }
  })

  // Convert to array and sort by most recent activity
  return Array.from(mysteriesMap.values()).sort((a, b) => {
    const aLatest = Math.max(
      a.starRatedAt?.getTime() || 0,
      a.difficultyRatedAt?.getTime() || 0
    )
    const bLatest = Math.max(
      b.starRatedAt?.getTime() || 0,
      b.difficultyRatedAt?.getTime() || 0
    )
    return bLatest - aLatest
  })
}

function RatingStars({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-gray-400 text-sm">평가 안함</span>
  
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: 5 }, (_, i) => (
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
      ))}
      <span className="text-sm text-yellow-600 font-semibold ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const userRatings = await getUserRatings(session.user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {session.user.username}님의 프로필
          </h1>
          <p className="text-gray-600">
            평가한 머더 미스터리 목록입니다
          </p>
        </div>

        {userRatings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              아직 평가한 미스터리가 없습니다
            </h3>
            <p className="text-gray-500 mb-6">
              흥미로운 미스터리를 찾아서 평가해보세요!
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              미스터리 둘러보기
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                평가 통계
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {userRatings.length}
                  </div>
                  <div className="text-sm text-gray-600">평가한 미스터리</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {userRatings.filter(r => r.starRating !== null).length}
                  </div>
                  <div className="text-sm text-gray-600">별점 평가</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {userRatings.filter(r => r.difficultyRating !== null).length}
                  </div>
                  <div className="text-sm text-gray-600">난이도 평가</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                평가한 미스터리 ({userRatings.length})
              </h2>
              
              {userRatings.map((item) => (
                <div key={item.mystery.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Mystery Image */}
                      <div className="flex-shrink-0">
                        <div className="relative w-full md:w-32 h-48 md:h-32">
                          <Image
                            src={item.mystery.imagePath}
                            alt={item.mystery.title}
                            fill
                            className="object-cover rounded-lg"
                            sizes="(max-width: 768px) 100vw, 128px"
                          />
                        </div>
                      </div>
                      
                      {/* Mystery Info */}
                      <div className="flex-1">
                        <Link 
                          href={`/mystery/${item.mystery.slug}`}
                          className="hover:text-gray-600 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.mystery.title}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {item.mystery.synopsis}
                        </p>
                        
                        {/* Ratings */}
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <div className="text-sm text-gray-500 mb-1">내 별점 평가</div>
                              <RatingStars rating={item.starRating} />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 mb-1">내 난이도 평가</div>
                              <DifficultyBadge
                                difficulty={item.difficultyRating}
                                totalRatings={item.difficultyRating !== null ? 1 : 0}
                                showNumeric={true}
                              />
                            </div>
                          </div>
                          
                          {/* Rating dates */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-400">
                            {item.starRatedAt && (
                              <span>별점: {item.starRatedAt.toLocaleDateString('ko-KR')}</span>
                            )}
                            {item.difficultyRatedAt && (
                              <span>난이도: {item.difficultyRatedAt.toLocaleDateString('ko-KR')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}