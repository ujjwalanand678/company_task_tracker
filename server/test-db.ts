import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  try {
    const prisma = new PrismaClient();
    console.log('PrismaClient created successfully');
    const users = await prisma.user.findMany();
    console.log('Database connection successful. User count:', users.length);
  } catch (err: any) {
    console.error('Prisma Initialization Error:');
    console.error('Message:', err.message);
    process.exit(1);
  }
}

main();
