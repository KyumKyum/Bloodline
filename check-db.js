const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.prod' });

const prisma = new PrismaClient();

async function checkData() {
  try {
    const mysteries = await prisma.mystery.findMany();
    console.log('Found mysteries:', mysteries.length);
    mysteries.forEach(mystery => {
      console.log(`- ${mystery.title} (${mystery.slug})`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
