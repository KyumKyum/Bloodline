import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const mysteries = await prisma.mystery.findMany({
      include: {
        ratings: true,
        difficultyRatings: true,
        _count: {
          select: {
            ratings: true,
            difficultyRatings: true,
            comments: true
          }
        }
      },
      orderBy: {
        enlisted: 'desc'
      }
    });

    const processedMysteries = mysteries.map((mystery: any) => ({
      ...mystery,
      averageRating: mystery.ratings.length > 0 
        ? mystery.ratings.reduce((acc: number, rating: any) => acc + rating.rating, 0) / mystery.ratings.length
        : null,
      totalRatings: mystery._count.ratings,
      averageDifficulty: mystery.difficultyRatings.length > 0 
        ? mystery.difficultyRatings.reduce((acc: number, rating: any) => acc + rating.difficulty, 0) / mystery.difficultyRatings.length
        : null,
      totalDifficultyRatings: mystery._count.difficultyRatings,
      totalComments: mystery._count.comments
    }));

    return NextResponse.json(processedMysteries);
  } catch (error) {
    console.error('Failed to fetch mysteries:', error);
    return NextResponse.json({ error: 'Failed to fetch mysteries' }, { status: 500 });
  }
}