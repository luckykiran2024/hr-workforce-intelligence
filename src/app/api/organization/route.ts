import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let businessUnits: any[] = [];
    let employees: any[] = [];

    try {
      businessUnits = await prisma.businessUnit.findMany({
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

      employees = await prisma.employee.findMany({
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
    } catch (e) {
      console.warn('Prisma organization query failed, using fallback:', e);
    }

    if (!businessUnits || businessUnits.length === 0) {
      const { getAllEmployees } = await import('@/lib/dataProvider');
      const all = await getAllEmployees();
      employees = all.map(e => ({
        id: e.id,
        name: e.name,
        teamId: e.teamId,
        careerLevel: e.careerLevel,
        jobTitle: e.jobTitle,
        isManager: e.isManager,
        span: e.span,
        orgLayer: e.orgLayer,
        reportingManagerId: e.reportingManagerId
      }));

      businessUnits = [
        {
          id: "BU-01",
          name: "Digital Technologies & Commerce",
          head: "Soma Kiran Gonella",
          hrbp: "Lead HRBP (Interview Simulation)",
          function: "Technology, Operations & Revenue",
          location: "Bengaluru / Hyderabad / Remote",
          active: true,
          teams: [
            { id: "A", name: "Engineering", department: "Core Engineering", teamHead: "Arunachalam S.", location: "Hyderabad", _count: { employees: employees.filter(e => e.teamId === 'A').length } },
            { id: "B", name: "Operations", department: "Global Operations", teamHead: "Bhavna Rao", location: "Bengaluru", _count: { employees: employees.filter(e => e.teamId === 'B').length } },
            { id: "C", name: "Revenue", department: "Revenue & Growth", teamHead: "Chetan Sharma", location: "Mumbai / Remote", _count: { employees: employees.filter(e => e.teamId === 'C').length } }
          ]
        }
      ];
    }

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
