import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { EmployeeRecord } from '@/lib/analytics';

// In-memory mutation layer to support serverless read-only deployments
let inMemoryEmployees: EmployeeRecord[] | null = null;
let inMemoryIDPs: Record<string, any[]> = {};

function getBaselineJson(): any {
  try {
    const p = path.join(process.cwd(), 'prisma', 'baseline_data.json');
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf-8'));
    }
  } catch (e) {
    console.warn('Failed to read baseline_data.json:', e);
  }
  return { employees: [] };
}

function initBaselineEmployees(): EmployeeRecord[] {
  const rawData = getBaselineJson();
  const rawList = rawData.employees || [];
  
  const list: EmployeeRecord[] = rawList.map((e: any) => {
    const rawG = (e.gender || '').toLowerCase();
    let gender = 'Undisclosed';
    if (rawG.startsWith('f') || rawG.startsWith('w')) gender = 'Female';
    else if (rawG.startsWith('m')) gender = 'Male';

    const compa = e.band && e.band[1] ? Number((e.pay / e.band[1]).toFixed(3)) : (e.compaRatio || 1.0);
    const track = e.isManager ? 'Manager' : 'IC';
    const dept = e.team === 'A' ? 'Engineering' : (e.team === 'B' ? 'Operations' : 'Revenue');

    return {
      id: e.id,
      name: e.name,
      teamId: e.team || 'A',
      department: dept,
      careerLevel: e.level || 'L3',
      careerTrack: track,
      jobTitle: e.role || (e.level === 'L5' ? 'Principal Engineer II' : 'Data Engineer'),
      gender,
      age: e.age || 30,
      tenure: e.tenure || 2.0,
      workMode: e.mode || 'Hybrid',
      location: e.location || 'Hyderabad',
      annualFixedPay: e.pay || 25.0,
      compaRatio: compa,
      currentRating: e.rating ?? e.currentRating ?? 3,
      competence: e.potential ?? e.competence ?? 3,
      potential: e.potential ?? 3,
      isManager: Boolean(e.isManager),
      span: e.span || 0,
      orgLayer: e.orgLayer || 4,
      topTalent: Boolean(e.topTalent),
      criticalRole: Boolean(e.criticalRole),
      highPotential: Boolean(e.potential === 3 || e.potential >= 4),
      successionCandidate: Boolean(e.succession),
      flightRisk: e.flightRisk || 'Low',
      reportingManagerId: e.managerId || null,
      coachId: 'SYN-0050',
      status: 'ACTIVE',
      preRating: e.preRating ?? e.rating ?? 3,
      finalRating: e.rating ?? e.currentRating ?? 3,
      goalFY: e.goalFY ?? 90,
      goalQ4: e.goalQ4 ?? 90,
      reviewLate: Boolean(e.reviewLate),
      reviewWords: e.reviewWords ?? 85,
      peerInputs: e.peerInputs ?? 2,
      appeal: Boolean(e.appeal)
    };
  });

  // Ensure Dr. Ananya Sen (L5 Principal Engineer II -> L6 Technical Architect) is the flagship candidate at SYN-0001
  const existingIdx = list.findIndex(e => e.id === 'SYN-0001');
  const ananyaSen: EmployeeRecord = {
    id: 'SYN-0001',
    name: 'Dr. Ananya Sen',
    teamId: 'A',
    department: 'Engineering',
    careerLevel: 'L5',
    careerTrack: 'IC',
    jobTitle: 'Principal Engineer II',
    gender: 'Female',
    age: 32,
    tenure: 3.5,
    workMode: 'Hybrid',
    location: 'Hyderabad',
    annualFixedPay: 57.0,
    compaRatio: 1.0,
    currentRating: 4,
    competence: 4,
    potential: 4,
    isManager: false,
    span: 0,
    orgLayer: 4,
    topTalent: true,
    criticalRole: true,
    highPotential: true,
    successionCandidate: true,
    flightRisk: 'Low',
    reportingManagerId: 'SYN-0039',
    coachId: 'SYN-0050',
    status: 'ACTIVE',
    preRating: 4,
    finalRating: 4,
    goalFY: 96.5,
    goalQ4: 98.2,
    reviewLate: false,
    reviewWords: 145,
    peerInputs: 4,
    appeal: false
  };

  if (existingIdx >= 0) {
    list[existingIdx] = ananyaSen;
  } else {
    list.unshift(ananyaSen);
  }

  return list;
}

export async function getAllEmployees(mode: string = 'current'): Promise<EmployeeRecord[]> {
  try {
    // Attempt to query Prisma database first
    const employeesRaw = await prisma.employee.findMany({
      where: mode === 'current' ? { status: { not: 'EXITED' } } : {},
      include: {
        performanceRecords: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (employeesRaw && employeesRaw.length > 5) {
      return employeesRaw.map(e => {
        const perf = e.performanceRecords[0];
        const rawG = (e.gender || '').toLowerCase();
        let gender = 'Undisclosed';
        if (rawG.startsWith('f') || rawG.startsWith('w')) gender = 'Female';
        else if (rawG.startsWith('m')) gender = 'Male';

        return {
          id: e.id,
          name: e.name,
          teamId: e.teamId,
          department: e.department,
          careerLevel: e.careerLevel,
          careerTrack: e.careerTrack,
          jobTitle: e.jobTitle,
          gender,
          age: e.age,
          tenure: e.tenure,
          workMode: e.workMode,
          location: e.location,
          annualFixedPay: e.annualFixedPay,
          compaRatio: e.compaRatio,
          currentRating: e.currentRating,
          potential: e.potential,
          competence: e.potential,
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
    }
  } catch (err) {
    console.warn('Prisma DB query failed or unavailable, falling back to baseline data store:', (err as any).message);
  }

  // Graceful fallback to baseline store
  if (!inMemoryEmployees) {
    inMemoryEmployees = initBaselineEmployees();
  }

  return inMemoryEmployees;
}

export async function getEmployeeById(id: string): Promise<EmployeeRecord | null> {
  try {
    const emp = await prisma.employee.findUnique({
      where: { id },
      include: {
        team: true,
        performanceRecords: { orderBy: { createdAt: 'desc' }, take: 1 },
        developmentPlans: true
      }
    });
    if (emp) {
      return {
        ...emp,
        gender: emp.gender.toLowerCase().startsWith('w') || emp.gender.toLowerCase().startsWith('f') ? 'Female' : 'Male'
      } as any;
    }
  } catch (e) {
    // ignore and fallback
  }

  const all = await getAllEmployees();
  return all.find(e => e.id === id) || null;
}

export function resetToBaseline(): EmployeeRecord[] {
  inMemoryEmployees = initBaselineEmployees();
  inMemoryIDPs = {};
  return inMemoryEmployees;
}

export function clearInMemoryEmployees(): void {
  inMemoryEmployees = [];
  inMemoryIDPs = {};
}

export function addInMemoryEmployee(emp: EmployeeRecord) {
  if (!inMemoryEmployees) {
    inMemoryEmployees = initBaselineEmployees();
  }
  inMemoryEmployees.unshift(emp);
}
