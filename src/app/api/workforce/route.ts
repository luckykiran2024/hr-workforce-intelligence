import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  calculateSummaryMetrics,
  calculateDemographics,
  calculateCompaDistribution,
  calculateSpansAndLayers,
  calculateNineBox,
  calculateAppraisalCaseStudy,
  EmployeeRecord
} from '@/lib/analytics';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'all';
    const mode = searchParams.get('mode') || 'current'; // 'current' | 'baseline'

    // Fetch employees from database
    const employeesRaw = await prisma.employee.findMany({
      where: mode === 'current' ? { status: { not: 'EXITED' } } : {},
      include: {
        performanceRecords: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    const employees: EmployeeRecord[] = employeesRaw.map(e => {
      const perf = e.performanceRecords[0];
      return {
        id: e.id,
        name: e.name,
        teamId: e.teamId,
        department: e.department,
        careerLevel: e.careerLevel,
        careerTrack: e.careerTrack,
        jobTitle: e.jobTitle,
        gender: e.gender,
        age: e.age,
        tenure: e.tenure,
        workMode: e.workMode,
        location: e.location,
        annualFixedPay: e.annualFixedPay,
        compaRatio: e.compaRatio,
        currentRating: e.currentRating,
        potential: e.potential,
        isManager: e.isManager,
        span: e.span,
        orgLayer: e.orgLayer,
        topTalent: e.topTalent,
        criticalRole: e.criticalRole,
        highPotential: e.highPotential,
        successionCandidate: e.successionCandidate,
        flightRisk: e.flightRisk,
        reportingManagerId: e.reportingManagerId,
        coachId: e.coachId,
        status: e.status,
        preRating: perf?.preRating ?? e.currentRating,
        finalRating: perf?.finalRating ?? e.currentRating,
        goalFY: perf?.goalFY ?? 90,
        goalQ4: perf?.goalQ4 ?? 90,
        reviewLate: perf?.reviewLate ?? false,
        reviewWords: perf?.reviewWords ?? 100,
        peerInputs: perf?.peerInputs ?? 2,
        appeal: perf?.appeal ?? false
      };
    });

    const summary = calculateSummaryMetrics(employees, scope);
    const demographics = calculateDemographics(employees, scope);
    const compa = calculateCompaDistribution(employees, scope);
    const spansAndLayers = calculateSpansAndLayers(employees, scope);
    const nineBox = calculateNineBox(employees, scope);
    const caseStudy = calculateAppraisalCaseStudy(employees);

    return NextResponse.json({
      success: true,
      mode,
      scope,
      summary,
      demographics,
      compa,
      spansAndLayers,
      nineBox,
      caseStudy,
      totalCount: employees.length,
      teamCounts: {
        A: employees.filter(e => e.teamId === 'A').length,
        B: employees.filter(e => e.teamId === 'B').length,
        C: employees.filter(e => e.teamId === 'C').length
      }
    });
  } catch (error) {
    console.error('Error fetching workforce data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch workforce data' }, { status: 500 });
  }
}
