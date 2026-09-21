import { DEFAULT_PAY_BANDS } from './compensation';

export interface EmployeeRecord {
  id: string;
  name: string;
  teamId: string;
  department: string;
  careerLevel: string;
  careerTrack: string;
  jobTitle: string;
  gender: string; // 'Female' | 'Male' | 'Undisclosed'
  age: number;
  tenure: number;
  workMode: string;
  location: string;
  annualFixedPay: number;
  compaRatio: number;
  currentRating?: number | null; // 1 to 5
  competence?: number | null; // 1 to 5
  potential?: number | null; // alias for competence
  isManager: boolean;
  span: number;
  orgLayer: number;
  topTalent: boolean;
  criticalRole: boolean;
  highPotential: boolean;
  successionCandidate: boolean;
  flightRisk: string;
  reportingManagerId?: string | null;
  coachId?: string | null;
  status: string;
  // Historical performance fields for case study
  preRating?: number | null;
  finalRating?: number | null;
  goalFY?: number | null;
  goalQ4?: number | null;
  reviewLate?: boolean;
  reviewWords?: number;
  peerInputs?: number;
  appeal?: boolean;
}

export function filterEmployeesByScope(employees: EmployeeRecord[], scope: string): EmployeeRecord[] {
  if (!scope || scope === 'all') return employees;
  return employees.filter(e => e.teamId === scope);
}

export function calculateSummaryMetrics(employees: EmployeeRecord[], scope: string = 'all') {
  const dataset = filterEmployeesByScope(employees, scope);
  const total = dataset.length;

  if (total === 0) {
    return {
      headcount: 0,
      femalePct: 0,
      malePct: 0,
      femaleCount: 0,
      maleCount: 0,
      hipoCount: 0,
      topTalentPct: 0,
      criticalRolePct: 0,
      avgCompaRatio: 0,
      avgSpan: 0,
      avgRating: 0,
      avgCompetence: 0,
      highFlightRiskCount: 0
    };
  }

  const femaleCount = dataset.filter(e => e.gender === 'Female' || e.gender === 'Woman').length;
  const maleCount = dataset.filter(e => e.gender === 'Male' || e.gender === 'Man').length;
  
  // HIPO definition: Rating >= 4 AND Competence >= 4 (out of 5)
  const hipoCount = dataset.filter(e => 
    (e.currentRating || 0) >= 4 && 
    ((e.competence || e.potential || 0) >= 4)
  ).length;

  const topTalentCount = hipoCount > 0 ? hipoCount : dataset.filter(e => e.topTalent).length;
  const criticalCount = dataset.filter(e => e.criticalRole).length;
  const highRiskCount = dataset.filter(e => e.flightRisk === 'High').length;

  const totalCompa = dataset.reduce((sum, e) => sum + (e.compaRatio || 1.0), 0);
  const managers = dataset.filter(e => e.isManager);
  const totalSpan = managers.reduce((sum, m) => sum + (m.span || 0), 0);
  
  const rated = dataset.filter(e => e.currentRating != null && e.currentRating > 0);
  const totalRating = rated.reduce((sum, e) => sum + (e.currentRating || 0), 0);

  const competent = dataset.filter(e => (e.competence || e.potential) != null && (e.competence || e.potential || 0) > 0);
  const totalCompetence = competent.reduce((sum, e) => sum + (e.competence || e.potential || 0), 0);

  return {
    headcount: total,
    femalePct: Number(((femaleCount / total) * 100).toFixed(1)),
    malePct: Number(((maleCount / total) * 100).toFixed(1)),
    femaleCount,
    maleCount,
    hipoCount,
    topTalentPct: Number(((topTalentCount / total) * 100).toFixed(1)),
    criticalRolePct: Number(((criticalCount / total) * 100).toFixed(1)),
    avgCompaRatio: Number((totalCompa / total).toFixed(3)),
    avgSpan: managers.length ? Number((totalSpan / managers.length).toFixed(1)) : 0,
    avgRating: rated.length ? Number((totalRating / rated.length).toFixed(2)) : 0,
    avgCompetence: competent.length ? Number((totalCompetence / competent.length).toFixed(2)) : 0,
    highFlightRiskCount: highRiskCount
  };
}

export function calculateDemographics(employees: EmployeeRecord[], scope: string = 'all') {
  const dataset = filterEmployeesByScope(employees, scope);
  const total = dataset.length;

  const genderBreakdown: Record<string, number> = { Female: 0, Male: 0, Undisclosed: 0 };
  const modeBreakdown: Record<string, number> = { Hybrid: 0, 'On-site': 0, Remote: 0 };
  const locationBreakdown: Record<string, number> = {};
  const ageBands = { '< 25': 0, '25-34': 0, '35-44': 0, '45+': 0 };
  const tenureBands = { '< 1 yr': 0, '1-3 yrs': 0, '3-5 yrs': 0, '5+ yrs': 0 };
  const levelDistribution: Record<string, { total: number; female: number; male: number; women: number; men: number }> = {};

  ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'].forEach(l => {
    levelDistribution[l] = { total: 0, female: 0, male: 0, women: 0, men: 0 };
  });

  dataset.forEach(e => {
    // Gender: Normalize to Female / Male
    const rawG = (e.gender || '').toLowerCase();
    let g = 'Undisclosed';
    if (rawG.startsWith('f') || rawG.startsWith('w')) g = 'Female';
    else if (rawG.startsWith('m')) g = 'Male';
    genderBreakdown[g] = (genderBreakdown[g] || 0) + 1;

    // Mode
    const m = e.workMode || 'Hybrid';
    modeBreakdown[m] = (modeBreakdown[m] || 0) + 1;

    // Location
    const loc = e.location || 'Unknown';
    locationBreakdown[loc] = (locationBreakdown[loc] || 0) + 1;

    // Age bands
    if (e.age < 25) ageBands['< 25']++;
    else if (e.age <= 34) ageBands['25-34']++;
    else if (e.age <= 44) ageBands['35-44']++;
    else ageBands['45+']++;

    // Tenure bands
    if (e.tenure < 1) tenureBands['< 1 yr']++;
    else if (e.tenure <= 3) tenureBands['1-3 yrs']++;
    else if (e.tenure <= 5) tenureBands['3-5 yrs']++;
    else tenureBands['5+ yrs']++;

    // Level breakdown
    if (levelDistribution[e.careerLevel]) {
      levelDistribution[e.careerLevel].total++;
      if (g === 'Female') {
        levelDistribution[e.careerLevel].female++;
        levelDistribution[e.careerLevel].women++;
      }
      if (g === 'Male') {
        levelDistribution[e.careerLevel].male++;
        levelDistribution[e.careerLevel].men++;
      }
    }
  });

  return {
    total,
    genderBreakdown,
    modeBreakdown,
    locationBreakdown,
    ageBands,
    levelDistribution,
    byLevel: ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'].map(l => ({
      level: l,
      total: levelDistribution[l]?.total || 0,
      female: levelDistribution[l]?.female || 0,
      male: levelDistribution[l]?.male || 0
    }))
  };
}

export function calculateCompaDistribution(employees: EmployeeRecord[], scope: string = 'all') {
  const dataset = filterEmployeesByScope(employees, scope);
  const levels = ['L1', 'L2', 'L3', 'L4', 'L5'];

  const results = levels.map(lvl => {
    const cohort = dataset.filter(e => e.careerLevel === lvl);
    const band = DEFAULT_PAY_BANDS[lvl] || { min: 10, midpoint: 15, max: 20 };
    if (!cohort.length) {
      return {
        level: lvl,
        count: 0,
        bandMin: band.min,
        bandMid: band.midpoint,
        bandMax: band.max,
        p25: band.min,
        median: band.midpoint,
        p75: band.max
      };
    }

    const paySorted = cohort.map(e => e.annualFixedPay).sort((a, b) => a - b);
    const med = quantile(paySorted, 0.5);
    const q25 = quantile(paySorted, 0.25);
    const q75 = quantile(paySorted, 0.75);

    return {
      level: lvl,
      count: cohort.length,
      bandMin: band.min,
      bandMid: band.midpoint,
      bandMax: band.max,
      p25: Number(q25.toFixed(2)),
      median: Number(med.toFixed(2)),
      p75: Number(q75.toFixed(2))
    };
  });

  // Adjusted & unadjusted gender pay gaps (Female vs Male)
  const females = dataset.filter(e => e.gender === 'Female' || e.gender === 'Woman');
  const males = dataset.filter(e => e.gender === 'Male' || e.gender === 'Man');

  const unadjustedFemaleMean = females.length ? (females.reduce((s, e) => s + e.compaRatio, 0) / females.length) : 1.0;
  const unadjustedMaleMean = males.length ? (males.reduce((s, e) => s + e.compaRatio, 0) / males.length) : 1.0;
  const unadjustedGap = Number((unadjustedMaleMean - unadjustedFemaleMean).toFixed(3));

  // Adjusted pay gap (weighted by cohort size)
  let totalGapWeight = 0;
  let totalWeightedGap = 0;
  levels.forEach(lvl => {
    const fCohort = females.filter(e => e.careerLevel === lvl);
    const mCohort = males.filter(e => e.careerLevel === lvl);
    if (fCohort.length >= 2 && mCohort.length >= 2) {
      const wt = Math.min(fCohort.length, mCohort.length);
      const fAvg = fCohort.reduce((s, e) => s + e.compaRatio, 0) / fCohort.length;
      const mAvg = mCohort.reduce((s, e) => s + e.compaRatio, 0) / mCohort.length;
      totalWeightedGap += (mAvg - fAvg) * wt;
      totalGapWeight += wt;
    }
  });

  const adjustedGap = totalGapWeight > 0 ? Number((totalWeightedGap / totalGapWeight).toFixed(3)) : 0;

  return {
    byLevel: results,
    unadjustedGap,
    adjustedGap,
    femaleCount: females.length,
    maleCount: males.length,
    womenCount: females.length,
    menCount: males.length
  };
}

export function calculateSpansAndLayers(employees: EmployeeRecord[], scope: string = 'all') {
  const dataset = filterEmployeesByScope(employees, scope);
  const managers = dataset.filter(e => e.isManager);

  const spanBuckets = { '1-5': 0, '6-10': 0, '11-15': 0, '16+': 0 };
  const overloadedManagers: EmployeeRecord[] = [];

  managers.forEach(m => {
    const s = m.span || 0;
    if (s <= 5) spanBuckets['1-5']++;
    else if (s <= 10) spanBuckets['6-10']++;
    else if (s <= 15) spanBuckets['11-15']++;
    else {
      spanBuckets['16+']++;
      overloadedManagers.push(m);
    }
  });

  const layerDistribution = {
    Layer1: dataset.filter(e => e.orgLayer === 1).length, // Business Head
    Layer2: dataset.filter(e => e.orgLayer === 2).length, // Senior Managers
    Layer3: dataset.filter(e => e.orgLayer === 3).length, // Managers / Leads
    Layer4: dataset.filter(e => e.orgLayer === 4).length  // IC / Professionals
  };

  return {
    managerCount: managers.length,
    spanBuckets,
    layerDistribution,
    overloadedManagers: overloadedManagers.map(m => ({ id: m.id, name: m.name, team: m.teamId, span: m.span }))
  };
}

export function calculateNineBox(employees: EmployeeRecord[], scope: string = 'all') {
  const dataset = filterEmployeesByScope(employees, scope);
  
  // Matrix: 3x3 grid
  // Performance: Low (1-2), Medium (3), High (4-5)
  // Competence (1-5 scale): Low (1-2), Medium (3), High (4-5)
  const grid: Record<string, { label: string; count: number; employees: { id: string; name: string; title: string; rating?: number | null }[] }> = {
    'high-high': { label: '⭐ Star / HIPO', count: 0, employees: [] },
    'high-med': { label: 'High Performer', count: 0, employees: [] },
    'high-low': { label: 'Solid Professional', count: 0, employees: [] },
    'med-high': { label: 'Growth Competence', count: 0, employees: [] },
    'med-med': { label: 'Core Performer', count: 0, employees: [] },
    'med-low': { label: 'Effective Contributor', count: 0, employees: [] },
    'low-high': { label: 'Enigma / High Competence', count: 0, employees: [] },
    'low-med': { label: 'Dilemma / Action Needed', count: 0, employees: [] },
    'low-low': { label: 'Underperformer', count: 0, employees: [] }
  };

  dataset.forEach(e => {
    const rating = e.currentRating || 3;
    const compScore = e.competence ?? e.potential ?? 3;

    let rBand = 'med';
    if (rating >= 4) rBand = 'high';
    else if (rating <= 2) rBand = 'low';

    let cBand = 'med';
    if (compScore >= 4) cBand = 'high';
    else if (compScore <= 2) cBand = 'low';

    const key = `${rBand}-${cBand}`;
    if (grid[key]) {
      grid[key].count++;
      grid[key].employees.push({ id: e.id, name: e.name, title: e.jobTitle, rating: e.currentRating });
    }
  });

  return grid;
}

export function calculateAppraisalCaseStudy(employees: EmployeeRecord[]) {
  // Team A (Engineering): Rating leniency analysis
  const teamA = employees.filter(e => e.teamId === 'A');
  const teamARatings = teamA.map(e => e.currentRating || 3);
  const teamAPreRatings = teamA.map(e => e.preRating || e.currentRating || 3);
  const teamAAvgRating = teamA.length ? teamARatings.reduce((a, b) => a + b, 0) / teamA.length : 0;
  const teamARatingDist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  teamARatings.forEach(r => teamARatingDist[r] = (teamARatingDist[r] || 0) + 1);

  // Team B (Operations): Span overload and appraisal outcome penalty
  const teamB = employees.filter(e => e.teamId === 'B');
  const teamBManagers = teamB.filter(e => e.isManager);
  const highSpanManagers = teamBManagers.filter(m => m.span > 12);
  const normalSpanManagers = teamBManagers.filter(m => m.span <= 12);

  // Team C (Revenue): Proximity paradox - matched pairs analysis
  const teamC = employees.filter(e => e.teamId === 'C');
  const onSite = teamC.filter(e => e.workMode === 'On-site').sort((a, b) => (a.goalFY || 0) - (b.goalFY || 0));
  const remote = teamC.filter(e => e.workMode === 'Remote');
  const used = new Set<string>();
  const pairs: { onSite: EmployeeRecord; remote: EmployeeRecord; ratingGap: number; goalGap: number }[] = [];

  onSite.forEach(o => {
    const candidates = remote.filter(r => 
      r.careerLevel === o.careerLevel &&
      !used.has(r.id) &&
      Math.abs((r.goalFY || 90) - (o.goalFY || 90)) <= 8
    ).sort((a, b) => Math.abs((a.goalFY || 90) - (o.goalFY || 90)) - Math.abs((b.goalFY || 90) - (o.goalFY || 90)));

    if (candidates.length > 0) {
      const match = candidates[0];
      used.add(match.id);
      pairs.push({
        onSite: o,
        remote: match,
        ratingGap: (o.currentRating || 3) - (match.currentRating || 3),
        goalGap: (o.goalFY || 90) - (match.goalFY || 90)
      });
    }
  });

  const avgProximityRatingGap = pairs.length ? pairs.reduce((s, p) => s + p.ratingGap, 0) / pairs.length : 0;
  const avgProximityGoalGap = pairs.length ? pairs.reduce((s, p) => s + p.goalGap, 0) / pairs.length : 0;

  return {
    teamA: {
      headcount: teamA.length,
      avgRating: Number(teamAAvgRating.toFixed(2)),
      ratingDist: teamARatingDist,
      calibratedShifts: teamA.filter(e => (e.preRating || 0) !== (e.currentRating || 0)).length,
      insight: teamA.length ? 'Engineering exhibits upward rating leniency with compressed differentiation across performers.' : 'No active employees in Team A. Add employee records to compute appraisal calibration analytics.'
    },
    teamB: {
      headcount: teamB.length,
      managerCount: teamBManagers.length,
      overloadedCount: highSpanManagers.length,
      avgSpan: teamBManagers.length ? Number((teamB.length / teamBManagers.length).toFixed(1)) : 0,
      insight: teamB.length ? 'Operations managers face span overload, correlating with late appraisal submissions.' : 'No active employees in Team B. Add employee records to calculate supervisory span analysis.'
    },
    teamC: {
      headcount: teamC.length,
      matchedPairsCount: pairs.length,
      ratingGap: Number(avgProximityRatingGap.toFixed(2)),
      goalGap: Number(avgProximityGoalGap.toFixed(2)),
      insight: teamC.length ? 'Revenue reveals a proximity comparison between on-site and remote employees.' : 'No active employees in Team C. Add employee records to evaluate work-proximity bias.'
    }
  };
}

function quantile(arr: number[], q: number): number {
  if (!arr.length) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  } else {
    return sorted[base];
  }
}
