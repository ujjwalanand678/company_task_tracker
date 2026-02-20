import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

dotenv.config();

console.log('Initializing Prisma with DATABASE_URL:', process.env.DATABASE_URL || 'file:./dev.db');

const libsql = createClient({
    url: process.env.DATABASE_URL || 'file:./dev.db',
});

const adapter = new PrismaLibSql(libsql as any);
const prisma = new PrismaClient({ adapter } as any);

export default prisma;
