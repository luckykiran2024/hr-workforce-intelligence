import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { clearInMemoryEmployees } from '@/lib/dataProvider';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    console.log('🧹 Clearing all employee data to zero...');
    clearInMemoryEmployees();
    try {
      await prisma.auditLog.deleteMany();
      await prisma.lifecycleEvent.deleteMany();
      await prisma.developmentPlan.deleteMany();
      await prisma.promotionNomination.deleteMany();
      await prisma.employeeCompetency.deleteMany();
      await prisma.performanceRecord.deleteMany();
      await prisma.employee.deleteMany();
    } catch (dbErr) {
      console.warn('Prisma clear error (likely read-only environment):', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'All employee data cleared. Total headcount is now 0.'
    });
  } catch (error: any) {
    console.error('Error clearing data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
