'use client';

import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Calendar,
  FileSpreadsheet,
  TrendingDown,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AppraisalCaseStudyProps {
  caseStudyData: any;
  loading: boolean;
  onNavigateToPlan?: () => void;
}

export default function AppraisalCaseStudy({
  caseStudyData,
  loading,
  onNavigateToPlan
}: AppraisalCaseStudyProps) {
  if (loading || !caseStudyData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const { teamA, teamB, teamC } = caseStudyData || {
    teamA: { headcount: 0, avgRating: 0, ratingDist: {}, calibratedShifts: 0, insight: 'No records.' },
    teamB: { headcount: 0, avgSpan: 0, overloadedCount: 0, insight: 'No records.' },
    teamC: { headcount: 0, matchedPairsCount: 0, ratingGap: 0, goalGap: 0, insight: 'No records.' }
  };

  const teamARatingPct = teamA?.headcount > 0
    ? Math.round((((teamA.ratingDist?.[4] || 0) + (teamA.ratingDist?.[5] || 0)) / teamA.headcount) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              HRBP Interview Case Study Diagnosis
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Appraisal Calibration & Decision Intelligence
            </h2>
            <p className="text-sm text-slate-500 max-w-3xl mt-1">
              Cross-functional appraisal diagnostics across active employee cohorts. Identifies structural leniency, managerial overload penalties, and location proximity bias before proposing targeted 90-day systemic interventions.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Teams Deep-Dive Diagnostic Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team A: Engineering */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                Team A · Engineering
              </span>
              <span className="text-xs text-slate-500 font-medium">n = {teamA?.headcount || 0}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Rating Leniency & Grade Compression</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {teamA?.insight}
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Mean Calibrated Rating:</span>
                <span className="font-mono font-bold text-sky-800">{teamA?.avgRating || 0} / 5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Calibrated Rating Shifts:</span>
                <span className="font-mono font-bold text-slate-700">{teamA?.calibratedShifts || 0} employees</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Rating 4 & 5 Concentration:</span>
                <span className="font-mono font-bold text-amber-700">
                  {teamARatingPct}%
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-sky-700 font-medium">
            → HRBP Prescription: Anchor calibrate against objective technical deliverables & artifact milestones.
          </div>
        </div>

        {/* Team B: Operations */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Team B · Operations
              </span>
              <span className="text-xs text-slate-500 font-medium">n = {teamB?.headcount || 0}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Managerial Span Overload Penalty</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {teamB?.insight}
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Average Managerial Span:</span>
                <span className="font-mono font-bold text-rose-700">{teamB?.avgSpan || 0} direct reports</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Overloaded Managers (&gt;12):</span>
                <span className="font-mono font-bold text-amber-700">{teamB?.overloadedCount || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Qualitative Feedback Depth:</span>
                <span className="font-mono font-bold text-slate-700">{teamB?.headcount > 0 ? 'Severe compression' : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-amber-700 font-medium">
            → HRBP Prescription: Restructure Layer 3 team lead pods to cap spans under 8-10 direct reports.
          </div>
        </div>

        {/* Team C: Revenue */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Team C · Revenue
              </span>
              <span className="text-xs text-slate-500 font-medium">n = {teamC?.headcount || 0}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Work-Proximity Paradox</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {teamC?.insight}
            </p>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Matched Pairs Evaluated:</span>
                <span className="font-mono font-bold text-slate-700">{teamC?.matchedPairsCount || 0} pairs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">On-Site Rating Advantage:</span>
                <span className="font-mono font-bold text-emerald-700">+{teamC?.ratingGap || 0} points</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Attainment Goal Difference:</span>
                <span className="font-mono font-bold text-slate-700">+{teamC?.goalGap || 0}% (Statistically zero)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-emerald-700 font-medium">
            → HRBP Prescription: Blinded objective calibration and asynchronous proof-of-deal attribution.
          </div>
        </div>
      </div>

      {/* 90-Day Leadership Action Plan */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" />
              90-Day Strategic Leadership Action Plan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured sequence of interventions addressing root causes without disruptive blanket rating alterations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 30 Days Milestone */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-sky-700">
              <span>DAY 1 - 30</span>
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800">Immediate Diagnostic</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Evidence Calibration & Span Relief</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Publish objective competency rubrics for Team A Engineering promotions and ratings.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Institute interim span relief in Team B Operations by delegating review cohorts to senior leads.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <span>Audit matched-pair revenue deals in Team C to isolate remote vs on-site quota realization.</span>
              </li>
            </ul>
          </div>

          {/* 60 Days Milestone */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-amber-700">
              <span>DAY 31 - 60</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">Structural Re-alignment</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Org Restructuring & Manager Enablement</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Formalize Layer 3 Lead roles in Operations to permanently cap supervisory span at 8.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Mandate asynchronous 360-degree calibration dossiers for hybrid/remote staff in Revenue.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>Execute mid-cycle performance calibrations targeting compressed middle-tier distribution.</span>
              </li>
            </ul>
          </div>

          {/* 90 Days Milestone */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>DAY 61 - 90</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Institutional Governance</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Sustained Capability & Health Review</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Integrate L1-L8 competency assessments directly into salary revision gates.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Review operational health indicators (sick leave, EAP usage) against restructured spans.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Present Executive Governance Report to Business Head with calibrated workforce index.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
