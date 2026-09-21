import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateCompaRatio } from '@/lib/compensation';
import { logAudit } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const team = searchParams.get('team') || 'all';
    const level = searchParams.get('level') || 'all';
    const talent = searchParams.get('talent') || 'all'; // 'topTalent' | 'criticalRole' | 'all'
    const nineBox = searchParams.get('ninebox') || 'all';
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    const where: any = { status: { not: 'EXITED' } };

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { id: { contains: query } },
        { jobTitle: { contains: query } }
      ];
    }

    if (team !== 'all') {
      where.teamId = team;
    }

    if (level !== 'all') {
      where.careerLevel = level;
    }

    if (talent === 'topTalent') {
      where.topTalent = true;
    } else if (talent === 'criticalRole') {
      where.criticalRole = true;
    } else if (talent === 'hipo') {
      where.currentRating = { gte: 4 };
      where.potential = { gte: 4 };
    }

    // 9-Box Matrix filter support
    if (nineBox !== 'all') {
      const nb = nineBox.toLowerCase();
      if (nb === 'enigma' || nb === 'low-high') {
        where.currentRating = { lte: 2 };
        where.potential = { gte: 4 };
      } else if (nb === 'growth' || nb === 'growth potential' || nb === 'med-high') {
        where.OR = [{ currentRating: 3 }, { currentRating: null }];
        where.potential = { gte: 4 };
      } else if (nb === 'star' || nb === 'hipo' || nb === 'star / hipo' || nb === 'high-high') {
        where.currentRating = { gte: 4 };
        where.potential = { gte: 4 };
      } else if (nb === 'dilemma' || nb === 'low-med') {
        where.currentRating = { lte: 2 };
        where.OR = [{ potential: 3 }, { potential: null }];
      } else if (nb === 'core' || nb === 'core performer' || nb === 'med-med') {
        where.OR = [{ currentRating: 3 }, { currentRating: null }];
        where.potential = { in: [3] };
      } else if (nb === 'high performer' || nb === 'high-med') {
        where.currentRating = { gte: 4 };
        where.OR = [{ potential: 3 }, { potential: null }];
      } else if (nb === 'underperformer' || nb === 'low-low') {
        where.currentRating = { lte: 2 };
        where.potential = { lte: 2 };
      } else if (nb === 'contributor' || nb === 'med-low') {
        where.OR = [{ currentRating: 3 }, { currentRating: null }];
        where.potential = { lte: 2 };
      } else if (nb === 'solid pro' || nb === 'solid professional' || nb === 'high-low') {
        where.currentRating = { gte: 4 };
        where.potential = { lte: 2 };
      }
    }

    const [total, employees] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.findMany({
        where,
        include: {
          team: true,
          jobCode: true
        },
        orderBy: { id: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    return NextResponse.json({
      success: true,
      total,
      page,
      limit,
      employees
    });
  } catch (error) {
    console.error('Error listing employees:', error);
    return NextResponse.json({ success: false, error: 'Failed to list employees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      teamId = 'A',
      department = 'Engineering',
      jobCodeId = 'A-SR-DATA',
      jobTitle = 'Lead Data Engineer',
      careerLevel = 'L3',
      careerTrack = 'IC',
      gender = 'Woman',
      age = 29,
      tenure = 1.0,
      workMode = 'Hybrid',
      location = 'Hyderabad',
      annualFixedPay = 22.0,
      variablePay = 3.3,
      reportingManagerId = 'SYN-0050',
      coachId = 'SYN-0080',
      topTalent = false,
      criticalRole = false,
      highPotential = false,
      positionCriticality = 'Standard'
    } = body;

    if (!name) {
      return NextResponse.json({ success: false, error: 'Name is mandatory' }, { status: 400 });
    }

    // Auto generate next Employee ID
    const count = await prisma.employee.count();
    const nextIdNum = count + 1;
    const newId = `SYN-${String(nextIdNum).padStart(4, '0')}`;

    // Auto calculate compa ratio
    const compaRatio = calculateCompaRatio(annualFixedPay, careerLevel);
    const totalTargetComp = Number((annualFixedPay + variablePay).toFixed(2));

    // Create inside Prisma transaction
    const newEmployee = await prisma.$transaction(async (tx) => {
      const emp = await tx.employee.create({
        data: {
          id: newId,
          name,
          status: 'ACTIVE',
          dateOfJoining: new Date().toISOString().split('T')[0],
          employmentType: 'Full-time',
          location,
          workMode,
          corporateEmail: `${name.toLowerCase().replace(/\s+/g, '.')}.syn@zeta-sim.internal`,
          businessUnitId: 'BU-01',
          teamId,
          department,
          jobCodeId,
          jobTitle,
          careerLevel,
          careerTrack,
          reportingManagerId,
          coachId,
          positionId: `POS-${nextIdNum}`,
          positionCriticality: criticalRole ? 'Critical' : positionCriticality,
          gender,
          age: Number(age),
          tenure: Number(tenure),
          annualFixedPay: Number(annualFixedPay),
          variablePay: Number(variablePay),
          totalTargetComp,
          compaRatio,
          lastIncrementPct: 0,
          orgLayer: 4,
          isManager: false,
          span: 0,
          topTalent: Boolean(topTalent),
          highPotential: Boolean(highPotential),
          criticalRole: Boolean(criticalRole),
          successionCandidate: false,
          flightRisk: 'Low',
          currentRating: null, // New hire starts without completed appraisal!
          potential: highPotential ? 3 : 2,
          lifecycleEvents: {
            create: {
              eventType: 'HIRE',
              effectiveDate: new Date().toISOString().split('T')[0],
              summary: `New employee ${name} hired into Team ${teamId} as ${jobTitle} (${careerLevel}).`,
              details: JSON.stringify({ teamId, jobTitle, careerLevel, annualFixedPay, reportingManagerId })
            }
          }
        }
      });

      // Update reporting manager direct report count
      if (reportingManagerId) {
        await tx.employee.update({
          where: { id: reportingManagerId },
          data: {
            span: { increment: 1 },
            isManager: true
          }
        });
      }

      return emp;
    });

    await logAudit({
      entityType: 'Employee',
      entityId: newId,
      fieldName: 'CREATE',
      oldValue: null,
      newValue: `Created ${name} (${careerLevel} - Team ${teamId})`,
      changedBy: 'Demo Administrator'
    });

    return NextResponse.json({
      success: true,
      employee: newEmployee,
      message: `Employee ${newEmployee.name} (${newEmployee.id}) created successfully!`
    });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to create employee' }, { status: 500 });
  }
}
