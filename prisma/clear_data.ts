import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearData() {
  console.log('🧹 Clearing all employee and transactional dummy data...');

  await prisma.auditLog.deleteMany();
  await prisma.lifecycleEvent.deleteMany();
  await prisma.developmentPlan.deleteMany();
  await prisma.promotionNomination.deleteMany();
  await prisma.employeeCompetency.deleteMany();
  await prisma.performanceRecord.deleteMany();
  await prisma.employee.deleteMany();

  const count = await prisma.employee.count();
  console.log(`✅ All dummy employees removed. Current employee count: ${count}`);
}

clearData()
  .catch((e) => {
    console.error('Error clearing data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
