import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient({
  accelerateUrl: process.env.DATABASE_URL as string,
  log: ['query', 'info', 'warn', 'error'],
});

export default prisma;
