import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { mysteryId, rating } = await request.json()

    if (!mysteryId || typeof rating !== 'number') {
      return NextResponse.json(
        { error: 'Mystery ID and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1.0 || rating > 5.0) {
      return NextResponse.json(
        { error: 'Rating must be between 1.0 and 5.0' },
        { status: 400 }
      )
    }

    // Round to one decimal place for consistency
    const roundedRating = Math.round(rating * 10) / 10

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

    // Upsert rating (create or update)
    const userRating = await prisma.rating.upsert({
      where: {
        userId_mysteryId: {
          userId: session.user.id,
          mysteryId: mysteryId
        }
      },
      update: {
        rating: roundedRating
      },
      create: {
        userId: session.user.id,
        mysteryId: mysteryId,
        rating: roundedRating
      }
    })

    return NextResponse.json(
      { message: 'Rating submitted successfully', rating: userRating },
      { status: 200 }
    )
  } catch (error) {
    console.error('Rating submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}