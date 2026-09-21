import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateCompaRatio, DEFAULT_PAY_BANDS } from '@/lib/compensation';
import { logAudit } from '@/lib/audit';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.id },
      include: {
        team: true,
        businessUnit: true,
        jobCode: true,
        performanceRecords: {
          orderBy: { createdAt: 'desc' }
        },
        competencyAssessments: {
          include: { competency: true }
        },
        promotionNominations: {
          orderBy: { createdAt: 'desc' }
        },
        developmentPlans: {
          orderBy: { createdAt: 'desc' }
        },
        lifecycleEvents: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    // Fetch reporting manager & coach names
    let managerName = 'None';
    let coachName = 'None';
    if (employee.reportingManagerId) {
      const mgr = await prisma.employee.findUnique({ where: { id: employee.reportingManagerId }, select: { name: true } });
      if (mgr) managerName = mgr.name;
    }
    if (employee.coachId) {
      const coach = await prisma.employee.findUnique({ where: { id: employee.coachId }, select: { name: true } });
      if (coach) coachName = coach.name;
    }

    const payBand = DEFAULT_PAY_BANDS[employee.careerLevel] || DEFAULT_PAY_BANDS['L3'];

    return NextResponse.json({
      success: true,
      employee,
      managerName,
      coachName,
      payBand
    });
  } catch (error: any) {
    console.error('Error fetching employee details:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch employee' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const existing = await prisma.employee.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    const updateData: any = {};
    const changes: { field: string; oldVal: any; newVal: any }[] = [];

    // Fields allowed to update
    const allowedFields = [
      'name', 'teamId', 'department', 'careerLevel', 'jobTitle', 'jobCodeId',
      'annualFixedPay', 'variablePay', 'topTalent', 'criticalRole', 'highPotential',
      'successionCandidate', 'flightRisk', 'workMode', 'location', 'reportingManagerId',
      'coachId', 'currentRating', 'potential', 'positionCriticality'
    ];

    allowedFields.forEach(f => {
      if (body[f] !== undefined && body[f] !== (existing as any)[f]) {
        changes.push({ field: f, oldVal: (existing as any)[f], newVal: body[f] });
        updateData[f] = body[f];
      }
    });

    // If compensation or career level changed, recalculate compa-ratio
    const newPay = updateData.annualFixedPay ?? existing.annualFixedPay;
    const newLevel = updateData.careerLevel ?? existing.careerLevel;
    if (updateData.annualFixedPay !== undefined || updateData.careerLevel !== undefined) {
      updateData.compaRatio = calculateCompaRatio(newPay, newLevel);
      updateData.totalTargetComp = Number((newPay + (updateData.variablePay ?? existing.variablePay)).toFixed(2));
      updateData.lastRevisionDate = new Date().toISOString().split('T')[0];
    }

    // If manager changed, update spans
    if (updateData.reportingManagerId !== undefined && updateData.reportingManagerId !== existing.reportingManagerId) {
      if (existing.reportingManagerId) {
        await prisma.employee.update({
          where: { id: existing.reportingManagerId },
          data: { span: { decrement: 1 } }
        });
      }
      if (updateData.reportingManagerId) {
        await prisma.employee.update({
          where: { id: updateData.reportingManagerId },
          data: { span: { increment: 1 }, isManager: true }
        });
      }
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: params.id },
      data: updateData
    });

    // Record audit logs and lifecycle event
    for (const c of changes) {
      await logAudit({
        entityType: 'Employee',
        entityId: params.id,
        fieldName: c.field,
        oldValue: String(c.oldVal),
        newValue: String(c.newVal),
        changedBy: 'Demo Administrator'
      });
    }

    if (changes.length > 0) {
      await prisma.lifecycleEvent.create({
        data: {
          employeeId: params.id,
          eventType: 'UPDATE',
          effectiveDate: new Date().toISOString().split('T')[0],
          summary: `Updated ${changes.map(c => c.field).join(', ')}.`,
          details: JSON.stringify(changes)
        }
      });
    }

    return NextResponse.json({
      success: true,
      employee: updatedEmployee,
      message: `Employee ${updatedEmployee.name} updated successfully!`
    });
  } catch (error: any) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update employee' }, { status: 500 });
  }
}
