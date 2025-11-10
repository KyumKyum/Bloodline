const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.prod' });

const prisma = new PrismaClient();

async function checkRatings() {
  try {
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
      }
    });
    
    console.log('Found mysteries:', mysteries.length);
    mysteries.forEach(mystery => {
      console.log(`\n${mystery.title}:`);
      console.log(`  Regular ratings: ${mystery.ratings.length}`);
      console.log(`  Difficulty ratings: ${mystery.difficultyRatings.length}`);
      
      if (mystery.difficultyRatings.length > 0) {
        const avgDifficulty = mystery.difficultyRatings.reduce((acc, rating) => acc + rating.difficulty, 0) / mystery.difficultyRatings.length;
        console.log(`  Average difficulty: ${avgDifficulty}`);
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRatings();
