import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logAudit } from '@/lib/audit';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.employeeId },
      include: {
        team: true,
        performanceRecords: {
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        competencyAssessments: true
      }
    });

    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    let nomination = await prisma.promotionNomination.findFirst({
      where: { employeeId: params.employeeId },
      orderBy: { createdAt: 'desc' }
    });

    // If no nomination exists yet, return default draft structure
    if (!nomination) {
      nomination = {
        id: 'NEW',
        employeeId: params.employeeId,
        fromLevel: employee.careerLevel,
        toLevel: 'L4',
        targetJobCode: 'A-PRIN-DATA',
        status: 'DRAFT',
        managerNominationNotes: null,
        evidenceNotes: null,
        calibrationNotes: null,
        committeeMembers: null,
        decisionRationale: null,
        effectiveDate: null,
        proposedSalary: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }

    return NextResponse.json({
      success: true,
      employee,
      nomination
    });
  } catch (error: any) {
    console.error('Error fetching promotion nomination:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const body = await request.json();
    const {
      status,
      managerNominationNotes,
      evidenceNotes,
      calibrationNotes,
      committeeMembers,
      decisionRationale,
      proposedSalary,
      effectiveDate
    } = body;

    let existing = await prisma.promotionNomination.findFirst({
      where: { employeeId: params.employeeId },
      orderBy: { createdAt: 'desc' }
    });

    let saved;
    if (existing) {
      saved = await prisma.promotionNomination.update({
        where: { id: existing.id },
        data: {
          status: status ?? existing.status,
          managerNominationNotes: managerNominationNotes ?? existing.managerNominationNotes,
          evidenceNotes: evidenceNotes ?? existing.evidenceNotes,
          calibrationNotes: calibrationNotes ?? existing.calibrationNotes,
          committeeMembers: committeeMembers ?? existing.committeeMembers,
          decisionRationale: decisionRationale ?? existing.decisionRationale,
          proposedSalary: proposedSalary ? Number(proposedSalary) : existing.proposedSalary,
          effectiveDate: effectiveDate ?? existing.effectiveDate
        }
      });
    } else {
      saved = await prisma.promotionNomination.create({
        data: {
          employeeId: params.employeeId,
          fromLevel: 'L3',
          toLevel: 'L4',
          targetJobCode: 'A-PRIN-DATA',
          status: status || 'NOMINATED',
          managerNominationNotes,
          evidenceNotes,
          calibrationNotes,
          committeeMembers,
          decisionRationale,
          proposedSalary: proposedSalary ? Number(proposedSalary) : 34.0,
          effectiveDate: effectiveDate || new Date().toISOString().split('T')[0]
        }
      });
    }

    await logAudit({
      entityType: 'PromotionWorkflow',
      entityId: params.employeeId,
      fieldName: 'WORKFLOW_UPDATE',
      oldValue: existing?.status || 'NONE',
      newValue: saved.status,
      changedBy: 'Calibration Panel / HRBP'
    });

    return NextResponse.json({ success: true, nomination: saved });
  } catch (error: any) {
    console.error('Error updating promotion nomination:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
