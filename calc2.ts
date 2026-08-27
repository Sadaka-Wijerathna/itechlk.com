import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const orders = await prisma.order.findMany({ where: { status: 'Confirmed' } });
  let oldRevenue = 0;
  let newRevenue = 0;
  for (const o of orders) {
    const origAmount = o.totalAmount;
    let oldCalc = origAmount < 1000 ? origAmount * 325 : origAmount;
    oldRevenue += oldCalc;
    newRevenue += origAmount;
    console.log(`Order: ${o.id} - DB Amount: ${origAmount} - Old Admin Calc: ${oldCalc}`);
  }
  console.log('Old Admin Revenue:', oldRevenue);
  console.log('New Admin Revenue:', newRevenue);
}
main().finally(() => prisma.$disconnect());
