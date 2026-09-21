import { NextRequest, NextResponse } from 'next/server';
import {
  calculateSummaryMetrics,
  calculateDemographics,
  calculateCompaDistribution,
  calculateSpansAndLayers,
  calculateNineBox,
  calculateAppraisalCaseStudy,
  EmployeeRecord
} from '@/lib/analytics';
import { getAllEmployees } from '@/lib/dataProvider';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get('scope') || 'all';
    const mode = searchParams.get('mode') || 'current'; // 'current' | 'baseline'

    // Fetch employees from resilient data provider (Prisma or bundled baseline)
    const employees: EmployeeRecord[] = await getAllEmployees(mode);

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
