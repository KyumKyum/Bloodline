import { prisma } from '@/lib/prisma'
import { MysteryCard } from '@/components/MysteryCard'
import { Header } from '@/components/Header'

async function getMysteries() {
  const mysteries = await prisma.mystery.findMany({
    include: {
      ratings: true,
      difficultyRatings: true,
      _count: {
        select: {
          ratings: true,
          difficultyRatings: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const processedMysteries = mysteries.map((mystery: any) => ({
    ...mystery,
    averageRating: mystery.ratings.length > 0 
      ? mystery.ratings.reduce((acc: number, rating: any) => acc + rating.rating, 0) / mystery.ratings.length
      : null,
    totalRatings: mystery._count.ratings,
    averageDifficulty: mystery.difficultyRatings.length > 0 
      ? mystery.difficultyRatings.reduce((acc: number, rating: any) => acc + rating.difficulty, 0) / mystery.difficultyRatings.length
      : null,
    totalDifficultyRatings: mystery._count.difficultyRatings
  }))

  // Debug logging (will show up in server logs)
  if (process.env.NODE_ENV === 'development') {
    processedMysteries.forEach(mystery => {
      console.log(`Mystery: ${mystery.title}`)
      console.log(`  Difficulty Ratings Count: ${mystery.difficultyRatings.length}`)
      console.log(`  Average Difficulty: ${mystery.averageDifficulty}`)
      console.log(`  Total Difficulty Ratings: ${mystery.totalDifficultyRatings}`)
    })
  }

  return processedMysteries
}

export default async function Home() {
  const mysteries = await getMysteries()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            (주인장이 해본 것만 올리는) 머더 미스터리 아카이브   
          </h1>
          <p className="text-gray-600 text-lg">
            제가 해본 것 중 흥미로운 머더 미스터리만 올리고 아카이빙합니다!<br/>여러분들도 난이도와 평점을 평가해주세요~ :)
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mysteries.map((mystery: any) => (
            <MysteryCard
              key={mystery.id}
              mystery={mystery}
            />
          ))}
        </div>

        {mysteries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No mysteries found.</p>
            <p className="text-gray-400">Check back soon for new cases!</p>
          </div>
        )}
      </main>
    </div>
  )
}
