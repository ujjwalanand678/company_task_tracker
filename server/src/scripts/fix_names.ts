import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting name cleanup...');
  
  const result = await prisma.user.updateMany({
    where: {
      name: 'User'
    },
    data: {
      name: ''
    }
  });

  console.log(`Cleanup complete. Updated ${result.count} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
