import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { mysteryId, difficulty } = await request.json()

    if (!mysteryId || typeof difficulty !== 'number') {
      return NextResponse.json(
        { error: 'Mystery ID and difficulty rating are required' },
        { status: 400 }
      )
    }

    if (difficulty < 1.0 || difficulty > 5.0) {
      return NextResponse.json(
        { error: 'Difficulty rating must be between 1.0 and 5.0' },
        { status: 400 }
      )
    }

    // Round to one decimal place for consistency
    const roundedDifficulty = Math.round(difficulty * 10) / 10

    // Check if mystery exists
    const mystery = await prisma.mystery.findUnique({
      where: { id: mysteryId }
    })

    if (!mystery) {
      return NextResponse.json(
        { error: 'Mystery not found' },
        { status: 404 }
      )
    }

    // Upsert difficulty rating (create or update)
    const userDifficultyRating = await prisma.difficultyRating.upsert({
      where: {
        userId_mysteryId: {
          userId: session.user.id,
          mysteryId: mysteryId
        }
      },
      update: {
        difficulty: roundedDifficulty
      },
      create: {
        userId: session.user.id,
        mysteryId: mysteryId,
        difficulty: roundedDifficulty
      }
    })

    // Revalidate the home page and mystery page to show updated difficulty ratings
    revalidatePath('/')
    revalidatePath(`/mystery/${mystery.slug}`)

    return NextResponse.json(
      { message: 'Difficulty rating submitted successfully', rating: userDifficultyRating },
      { status: 200 }
    )
  } catch (error) {
    console.error('Difficulty rating submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}