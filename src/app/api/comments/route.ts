import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { mysteryId, content, spoilerConsent } = await request.json();

    if (!mysteryId || !content || spoilerConsent === undefined) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    // Check if user already has a comment for this mystery
    const existingComment = await prisma.comment.findUnique({
      where: {
        userId_mysteryId: {
          userId: session.user.id,
          mysteryId: mysteryId
        }
      }
    });

    if (existingComment) {
      return NextResponse.json({ error: '이미 이 시나리오에 댓글을 작성하셨습니다.' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        mysteryId,
        content: content.trim(),
        spoilerConsent
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Comment creation error:', error);
    return NextResponse.json({ error: '댓글 작성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mysteryId = searchParams.get('mysteryId');

    if (!mysteryId) {
      return NextResponse.json({ error: '시나리오 ID가 필요합니다.' }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: {
        mysteryId
      },
      include: {
        user: {
          select: {
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Comments fetch error:', error);
    return NextResponse.json({ error: '댓글 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}