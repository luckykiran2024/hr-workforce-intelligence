import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { calculateCompaRatio, DEFAULT_PAY_BANDS } from '@/lib/compensation';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      targetLevel = 'L4',
      targetJobCode = 'A-PRIN-DATA',
      targetTitle = 'Principal Data Engineer',
      revisedSalary,
      decisionRationale = 'Promotion approved by calibration committee based on sustained impact and demonstrated L4 competency evidence.'
    } = body;

    const employee = await prisma.employee.findUnique({ where: { id: params.id } });
    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    const previousLevel = employee.careerLevel;
    const previousPay = employee.annualFixedPay;
    const previousTitle = employee.jobTitle;

    // Use revised salary if given, otherwise keep current or adjust to band min if below
    const bandL4 = DEFAULT_PAY_BANDS[targetLevel] || DEFAULT_PAY_BANDS['L4'];
    const newSalary = revisedSalary ? Number(revisedSalary) : Math.max(employee.annualFixedPay, bandL4.min);
    const newCompaRatio = calculateCompaRatio(newSalary, targetLevel);
    const newVariable = Number((newSalary * 0.15).toFixed(2));
    const newTotalTargetComp = Number((newSalary + newVariable).toFixed(2));

    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Employee
      const updated = await tx.employee.update({
        where: { id: params.id },
        data: {
          careerLevel: targetLevel,
          jobCodeId: targetJobCode,
          jobTitle: targetTitle,
          annualFixedPay: newSalary,
          variablePay: newVariable,
          totalTargetComp: newTotalTargetComp,
          compaRatio: newCompaRatio,
          lastRevisionDate: new Date().toISOString().split('T')[0]
        }
      });

      // 2. Update Promotion Nomination status
      const nomination = await tx.promotionNomination.findFirst({
        where: { employeeId: params.id },
        orderBy: { createdAt: 'desc' }
      });
      if (nomination) {
        await tx.promotionNomination.update({
          where: { id: nomination.id },
          data: {
            status: 'APPROVED',
            decisionRationale,
            effectiveDate: new Date().toISOString().split('T')[0],
            proposedSalary: newSalary
          }
        });
      }

      // 3. Record Lifecycle Event
      await tx.lifecycleEvent.create({
        data: {
          employeeId: params.id,
          eventType: 'PROMOTION',
          effectiveDate: new Date().toISOString().split('T')[0],
          summary: `Promoted from ${previousLevel} (${previousTitle}) to ${targetLevel} (${targetTitle}). Salary revised from ₹${previousPay}L to ₹${newSalary}L.`,
          details: JSON.stringify({
            previousLevel,
            targetLevel,
            previousTitle,
            targetTitle,
            previousPay,
            newSalary,
            newCompaRatio,
            decisionRationale
          })
        }
      });

      return updated;
    });

    await logAudit({
      entityType: 'Employee',
      entityId: params.id,
      fieldName: 'PROMOTION',
      oldValue: `${previousLevel} - ₹${previousPay}L`,
      newValue: `${targetLevel} - ₹${newSalary}L`,
      changedBy: 'Calibration Committee / Demo Administrator'
    });

    return NextResponse.json({
      success: true,
      employee: result,
      message: `Promotion to ${targetLevel} (${targetTitle}) successfully approved and executed!`
    });
  } catch (error: any) {
    console.error('Error approving promotion:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to approve promotion' }, { status: 500 });
  }
}
