import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    console.log('🧹 Clearing all employee data to zero...');
    await prisma.auditLog.deleteMany();
    await prisma.lifecycleEvent.deleteMany();
    await prisma.developmentPlan.deleteMany();
    await prisma.promotionNomination.deleteMany();
    await prisma.employeeCompetency.deleteMany();
    await prisma.performanceRecord.deleteMany();
    await prisma.employee.deleteMany();

    return NextResponse.json({
      success: true,
      message: 'All employee data cleared. Total headcount is now 0.'
    });
  } catch (error: any) {
    console.error('Error clearing data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
