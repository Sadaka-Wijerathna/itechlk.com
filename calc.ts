import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const orders = await prisma.order.findMany({ where: { status: 'Confirmed' } });
  const sum = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  console.log('Total Confirmed Orders:', orders.length);
  console.log('Total Revenue:', sum);
}
main().finally(() => prisma.$disconnect());
