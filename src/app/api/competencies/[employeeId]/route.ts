import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { logAudit } from '@/lib/audit';

const GRADE_VALUES: Record<string, number> = {
  A: 1, // Awareness
  B: 2, // Working
  C: 3, // Proficient
  D: 4, // Advanced
  E: 5  // Expert
};

export async function GET(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: params.employeeId },
      select: {
        id: true,
        name: true,
        careerLevel: true,
        careerTrack: true,
        jobTitle: true,
        teamId: true,
        annualFixedPay: true,
        reportingManagerId: true,
        coachId: true
      }
    });

    if (!employee) {
      return NextResponse.json({ success: false, error: 'Employee not found' }, { status: 404 });
    }

    const allCompetencies = await prisma.competencyDefinition.findMany({
      orderBy: { id: 'asc' }
    });

    const [assessments, developmentPlans] = await Promise.all([
      prisma.employeeCompetency.findMany({
        where: { employeeId: params.employeeId }
      }),
      prisma.developmentPlan.findMany({
        where: { employeeId: params.employeeId },
        orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }]
      })
    ]);

    const assessmentMap = new Map(assessments.map(a => [a.competencyId, a]));

    // Dynamic Progressive Target Level (strictly progressive: L1->L2->L3->L4->L5->L6->L7->L8, never downgrade!)
    const LEVEL_ORDER = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
    const currentIdx = LEVEL_ORDER.indexOf(employee.careerLevel);
    const targetLevel = (currentIdx >= 0 && currentIdx < LEVEL_ORDER.length - 1)
      ? LEVEL_ORDER[currentIdx + 1]
      : (currentIdx === LEVEL_ORDER.length - 1 ? 'L8' : 'L4');
    
    // Track-aware title: for technical IC track promoting from Principal Engineer II, target is strictly 'Technical Architect'
    const isManagement = employee.careerTrack === 'MGT' || 
      (employee.jobTitle && (employee.jobTitle.toLowerCase().includes('manager') || employee.jobTitle.toLowerCase().includes('lead')));

    let targetTitle = 'Technical Architect';
    if (targetLevel === 'L6') {
      targetTitle = isManagement ? 'Sr. Manager' : 'Technical Architect';
    } else if (targetLevel === 'L5') {
      targetTitle = isManagement ? 'Engineering Manager' : 'Principal Engineer II';
    } else if (targetLevel === 'L4') {
      targetTitle = isManagement ? 'Lead' : 'Principal Engineer I';
    } else if (targetLevel === 'L7') {
      targetTitle = 'Director';
    } else if (targetLevel === 'L8') {
      targetTitle = 'Sr. Director';
    } else if (targetLevel === 'L3') {
      targetTitle = 'Sr. Data Engineer';
    } else if (targetLevel === 'L2') {
      targetTitle = 'Data Engineer II';
    } else if (targetLevel === 'L1') {
      targetTitle = 'Data Engineer I';
    }

    const results = allCompetencies.map(comp => {
      const existing = assessmentMap.get(comp.id);
      const kGrade = existing?.knowledgeGrade || 'Not Assessed';
      const sGrade = existing?.skillsGrade || 'Not Assessed';

      const currentKVal = GRADE_VALUES[kGrade] || 0;
      const currentSVal = GRADE_VALUES[sGrade] || 0;

      // Determine target grades dynamically according to targetLevel
      let targetK = 'D';
      let targetS = 'D';
      if (targetLevel === 'L1') { targetK = 'A'; targetS = 'A'; }
      else if (targetLevel === 'L2') { targetK = 'B'; targetS = 'B'; }
      else if (targetLevel === 'L3') { targetK = comp.targetKnowledgeL3 || 'C'; targetS = comp.targetSkillsL3 || 'C'; }
      else if (targetLevel === 'L4') { targetK = comp.targetKnowledgeL4 || 'D'; targetS = comp.targetSkillsL4 || 'D'; }
      else if (targetLevel === 'L5') { targetK = 'D'; targetS = 'D'; }
      else if (targetLevel === 'L6') { targetK = 'E'; targetS = (comp.id === 'COMP-ARCH' || comp.id === 'COMP-CLOUD') ? 'E' : 'D'; }
      else if (targetLevel === 'L7' || targetLevel === 'L8') { targetK = 'E'; targetS = 'E'; }

      const targetKVal = GRADE_VALUES[targetK] || 4;
      const targetSVal = GRADE_VALUES[targetS] || 4;

      const kGap = currentKVal > 0 ? Math.max(0, targetKVal - currentKVal) : null;
      const sGap = currentSVal > 0 ? Math.max(0, targetSVal - currentSVal) : null;

      let devAction = 'Maintain mastery and mentor others.';
      if ((kGap && kGap > 0) || (sGap && sGap > 0)) {
        if (comp.id === 'COMP-ARCH') {
          devAction = `Sponsor an Architecture Decision Record (ADR) and present trade-off analysis for ${targetLevel} benchmark.`;
        } else if (comp.id === 'COMP-LEAD') {
          devAction = `Formally mentor senior data engineers through cross-functional reviews for ${targetLevel} leadership.`;
        } else if (comp.id === 'COMP-STAKE') {
          devAction = `Directly interface with VP and director-level stakeholders to establish enterprise data telemetry SLAs.`;
        } else if (comp.id === 'COMP-COST') {
          devAction = `Conduct a multi-cluster FinOps audit targeting 25%+ compute and query cost efficiency.`;
        } else {
          devAction = `Lead a stretch initiative demonstrating ${targetLevel}-grade ${comp.name} delivery.`;
        }
      }

      return {
        id: comp.id,
        name: comp.name,
        category: comp.category,
        currentKnowledge: kGrade,
        currentSkills: sGrade,
        targetKnowledge: targetK,
        targetSkills: targetS,
        targetKnowledgeL3: comp.targetKnowledgeL3,
        targetSkillsL3: comp.targetSkillsL3,
        targetKnowledgeL4: comp.targetKnowledgeL4,
        targetSkillsL4: comp.targetSkillsL4,
        knowledgeGap: kGap,
        skillsGap: sGap,
        maxGap: Math.max(kGap || 0, sGap || 0),
        isTargetMet: (kGap === 0 && sGap === 0),
        evidence: existing?.evidence || 'Assessed via project sprints and code reviews.',
        developmentAction: devAction,
        assessedDate: existing?.assessedDate || '2026-08-15'
      };
    });

    const metCount = results.filter(r => r.isTargetMet).length;
    const readinessScore = Math.round((metCount / results.length) * 100);

    return NextResponse.json({
      success: true,
      employee,
      currentLevel: employee.careerLevel,
      targetLevel,
      targetTitle,
      competencies: results,
      developmentPlans,
      totalCompetencies: results.length,
      metCompetencies: metCount,
      readinessScore
    });
  } catch (error: any) {
    console.error('Error fetching employee competencies:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { employeeId: string } }
) {
  try {
    const body = await request.json();
    const { competencyId, knowledgeGrade, skillsGrade, evidence, assessor = 'Technical Panel' } = body;

    if (!competencyId || !knowledgeGrade || !skillsGrade) {
      return NextResponse.json({ success: false, error: 'Missing assessment parameters' }, { status: 400 });
    }

    const saved = await prisma.employeeCompetency.upsert({
      where: {
        employeeId_competencyId: {
          employeeId: params.employeeId,
          competencyId
        }
      },
      create: {
        employeeId: params.employeeId,
        competencyId,
        knowledgeGrade,
        skillsGrade,
        evidence: evidence || 'Assessed in calibration review.',
        assessor,
        assessedDate: new Date().toISOString().split('T')[0]
      },
      update: {
        knowledgeGrade,
        skillsGrade,
        evidence: evidence || undefined,
        assessor,
        assessedDate: new Date().toISOString().split('T')[0]
      }
    });

    await logAudit({
      entityType: 'CompetencyAssessment',
      entityId: params.employeeId,
      fieldName: competencyId,
      oldValue: null,
      newValue: `Knowledge: ${knowledgeGrade}, Skills: ${skillsGrade}`,
      changedBy: assessor
    });

    return NextResponse.json({ success: true, assessment: saved });
  } catch (error: any) {
    console.error('Error saving competency assessment:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
