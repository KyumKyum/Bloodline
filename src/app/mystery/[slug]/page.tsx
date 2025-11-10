import { notFound } from 'next/navigation'
import Image from 'next/image'
import { promises as fs } from 'fs'
import path from 'path'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { prisma } from '@/lib/prisma'
import { RatingSection } from '@/components/RatingSection'
import { Header } from '@/components/Header'
import { DifficultyBadge } from '@/components/DifficultyBadge'
import { DifficultyRatingSection } from '@/components/DifficultyRatingSection'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface MysteryPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getMystery(slug: string) {
  if (!slug) {
    return null
  }

  const mystery = await prisma.mystery.findUnique({
    where: { slug },
    include: {
      ratings: true,
      difficultyRatings: true
    }
  })

  if (!mystery) {
    return null
  }

  // Calculate average rating
  const averageRating = mystery.ratings.length > 0
    ? mystery.ratings.reduce((acc: number, rating: any) => acc + rating.rating, 0) / mystery.ratings.length
    : null

  // Calculate average difficulty rating
  const averageDifficulty = mystery.difficultyRatings.length > 0
    ? mystery.difficultyRatings.reduce((acc: number, rating: any) => acc + rating.difficulty, 0) / mystery.difficultyRatings.length
    : null

  // Read markdown content
  let markdownContent = ''
  try {
    const markdownPath = path.join(process.cwd(), mystery.markdownPath)
    markdownContent = await fs.readFile(markdownPath, 'utf8')
  } catch (error) {
    console.error('Error reading markdown file:', error)
    markdownContent = 'Content not available.'
  }

  return {
    ...mystery,
    averageRating,
    totalRatings: mystery.ratings.length,
    averageDifficulty,
    totalDifficultyRatings: mystery.difficultyRatings.length,
    markdownContent
  }
}

export default async function MysteryPage({ params }: MysteryPageProps) {
  const resolvedParams = await params
  const mystery = await getMystery(resolvedParams.slug)

  if (!mystery) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="relative h-64 md:h-80">
            <Image
              src={mystery.imagePath}
              alt={mystery.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute top-4 right-4">
              <DifficultyBadge
                difficulty={mystery.averageDifficulty}
                totalRatings={mystery.totalDifficultyRatings}
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {mystery.title}
                </h1>
                <p className="text-lg opacity-90">
                  {mystery.synopsis}
                </p>
              </div>
            </div>
          </div>

          {/* Rating & Difficulty Rating Section */}
          <div className="p-6 border-b space-y-6">
            <RatingSection
              mysteryId={mystery.id}
              averageRating={mystery.averageRating}
              totalRatings={mystery.totalRatings}
            />
            <DifficultyRatingSection
              mysteryId={mystery.id}
              averageDifficulty={mystery.averageDifficulty}
              totalDifficultyRatings={mystery.totalDifficultyRatings}
            />
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="prose prose-slate max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-gray-900">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {mystery.markdownContent}
              </ReactMarkdown>
              {/* Mystery Image - Full Image Display */}
              <div className="mb-8">
                <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={mystery.imagePath}
                    alt={mystery.title}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}