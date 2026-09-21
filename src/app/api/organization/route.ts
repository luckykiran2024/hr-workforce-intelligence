import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const businessUnits = await prisma.businessUnit.findMany({
      include: {
        teams: {
          include: {
            _count: {
              select: { employees: true }
            }
          }
        }
      }
    });

    const employees = await prisma.employee.findMany({
      where: { status: { not: 'EXITED' } },
      select: {
        id: true,
        name: true,
        teamId: true,
        careerLevel: true,
        jobTitle: true,
        isManager: true,
        span: true,
        orgLayer: true,
        reportingManagerId: true
      }
    });

    return NextResponse.json({
      success: true,
      businessUnits,
      employees
    });
  } catch (error: any) {
    console.error('Error fetching organization structure:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
