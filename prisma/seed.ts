import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const mysteries = [
  {
    slug: 'Crime-and-Punishment-In-Bibliotheca',
    title: '죄와 벌의 도서관 (Crime and Punishment In Bibliotheca)',
    synopsis: '밀실에서 살해당한 도서관의 관장. 히무라 도서관을 감싸는 "읽으면 죽는 고서"의 비밀.',
    imagePath: '/mysteries/bibiliotheca.jpg',
    markdownPath: 'content/mysteries/bibiliotheca.md',
  },
]

async function main() {
  console.log('🌱 Start seeding...')
  
  for (const mystery of mysteries) {
    const result = await prisma.mystery.upsert({
      where: { slug: mystery.slug },
      update: mystery,
      create: mystery
    })
    console.log(`Created/Updated mystery: ${result.title}`)
  }
  
  console.log('🌱 Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })