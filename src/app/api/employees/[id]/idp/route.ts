import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Support batch creation
    if (Array.isArray(body)) {
      const createdPlans = [];
      for (const item of body) {
        const plan = await prisma.developmentPlan.create({
          data: {
            employeeId: params.id,
            priority: item.priority || 'PRIMARY',
            classification: item.classification || 'Learning and Development',
            improvementArea: item.improvementArea || item.competencyName || 'Core Competency Enhancement',
            competencyName: item.competencyName || 'Leadership & Engineering Delivery',
            currentGrade: item.currentGrade || 'Proficient',
            targetGrade: item.targetGrade || 'Advanced',
            action: item.action,
            expectedEvidence: item.expectedEvidence || 'Demonstrated in production deliverables & reviews',
            mentorOrCoach: item.mentorOrCoach || null,
            targetDate: item.targetDate || 'Next 6 Months',
            checkpoint: item.checkpoint || 'Quarterly Calibration',
            status: item.status || 'IN_PROGRESS'
          }
        });
        createdPlans.push(plan);
      }

      await prisma.lifecycleEvent.create({
        data: {
          employeeId: params.id,
          eventType: 'IDP_BATCH_INITIALIZED',
          effectiveDate: new Date().toISOString().split('T')[0],
          summary: `Initialized ${createdPlans.length} IDP Milestones`,
          details: `Curated primary & secondary action items established`
        }
      });

      return NextResponse.json({ success: true, count: createdPlans.length, plans: createdPlans });
    }

    const {
      priority = 'PRIMARY',
      classification = 'Learning and Development',
      improvementArea = '',
      competencyName,
      currentGrade = 'Proficient',
      targetGrade = 'Advanced',
      action,
      expectedEvidence = 'Demonstrated in production deliverables & reviews',
      mentorOrCoach = null,
      targetDate = 'Next 6 Months',
      checkpoint = 'Quarterly Calibration',
      status = 'IN_PROGRESS'
    } = body;

    if (!competencyName || !action) {
      return NextResponse.json({ success: false, error: 'Competency name and action are required' }, { status: 400 });
    }

    const plan = await prisma.developmentPlan.create({
      data: {
        employeeId: params.id,
        priority,
        classification,
        improvementArea: improvementArea || competencyName,
        competencyName,
        currentGrade,
        targetGrade,
        action,
        expectedEvidence,
        mentorOrCoach: mentorOrCoach || null,
        targetDate,
        checkpoint,
        status
      }
    });

    // Record lifecycle event
    await prisma.lifecycleEvent.create({
      data: {
        employeeId: params.id,
        eventType: 'IDP_MILESTONE',
        effectiveDate: new Date().toISOString().split('T')[0],
        summary: `IDP [${priority}] logged: ${competencyName} (${classification})`,
        details: `Improvement: ${improvementArea || competencyName} | Action: ${action} | Status: ${status}`
      }
    });

    return NextResponse.json({ success: true, plan });
  } catch (error: any) {
    console.error('Error creating IDP plan:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to save IDP item' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { planId, status, priority, classification, improvementArea, action, targetDate } = body;

    if (!planId) {
      return NextResponse.json({ success: false, error: 'planId is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (classification !== undefined) updateData.classification = classification;
    if (improvementArea !== undefined) updateData.improvementArea = improvementArea;
    if (action !== undefined) updateData.action = action;
    if (targetDate !== undefined) updateData.targetDate = targetDate;

    const updatedPlan = await prisma.developmentPlan.update({
      where: { id: planId },
      data: updateData
    });

    // Lifecycle event on status change
    if (status) {
      await prisma.lifecycleEvent.create({
        data: {
          employeeId: params.id,
          eventType: 'IDP_STATUS_UPDATE',
          effectiveDate: new Date().toISOString().split('T')[0],
          summary: `IDP Item Status: ${status}`,
          details: `Item: ${updatedPlan.competencyName} is now marked as ${status}`
        }
      });
    }

    return NextResponse.json({ success: true, plan: updatedPlan });
  } catch (error: any) {
    console.error('Error updating IDP plan:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to update IDP item' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const planId = searchParams.get('planId');

    if (!planId) {
      return NextResponse.json({ success: false, error: 'planId query param required' }, { status: 400 });
    }

    await prisma.developmentPlan.delete({
      where: { id: planId }
    });

    return NextResponse.json({ success: true, deletedPlanId: planId });
  } catch (error: any) {
    console.error('Error deleting IDP plan:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete IDP item' }, { status: 500 });
  }
}
