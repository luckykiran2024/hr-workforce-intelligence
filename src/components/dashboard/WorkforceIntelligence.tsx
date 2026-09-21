'use client';

import React from 'react';
import {
  Users,
  Award,
  DollarSign,
  Layers,
  AlertTriangle,
  TrendingUp,
  UserCheck,
  ShieldAlert
} from 'lucide-react';

interface WorkforceIntelligenceProps {
  data: any;
  loading: boolean;
  scope: string;
  onOpenEmployeeProfile?: (id: string) => void;
  onSelectNineBoxCategory?: (categoryKey: string, categoryLabel: string) => void;
}

export default function WorkforceIntelligence({
  data,
  loading,
  scope,
  onOpenEmployeeProfile,
  onSelectNineBoxCategory
}: WorkforceIntelligenceProps) {
  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const { summary = {}, demographics = {}, compa = {}, spansAndLayers = {}, nineBox = {} } = data;

  const headcount = summary.headcount || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 4 Key Performance Indicator Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Headcount & Gender */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Headcount</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {headcount}
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span className="text-emerald-600 font-bold mr-1.5">{summary.femalePct || 0}%</span>
            <span>Female Representation ({summary.femaleCount || 0} Female vs {summary.maleCount || 0} Male)</span>
          </div>
        </div>

        {/* KPI 2: Top Talent & Critical Roles */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Top Talent & HIPOs</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
            <span>{summary.topTalentPct || 0}%</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              ⭐ {summary.hipoCount || 0} HIPOs
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span className="text-sky-600 font-bold mr-1.5">{summary.criticalRolePct || 0}%</span>
            <span>Critical Role Incumbents</span>
          </div>
        </div>

        {/* KPI 3: Compensation & Compa-Ratio */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mean Compa-Ratio</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {headcount ? (summary.avgCompaRatio || 1.0) : '—'}
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span className="font-bold text-slate-700 mr-1.5">
              {headcount ? (compa.adjustedGap || 0) : '0.00'}
            </span>
            <span>Adjusted Female vs Male Pay Gap</span>
          </div>
        </div>

        {/* KPI 4: Managerial Span & Hierarchy */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Managerial Span</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {headcount ? (summary.avgSpan || 0) : 0}
          </div>
          <div className="mt-2 flex items-center text-xs text-slate-500">
            <span className="font-bold text-rose-600 mr-1.5">
              {spansAndLayers.overloadedManagers?.length || 0}
            </span>
            <span>Overloaded Managers (&gt;15 direct reports)</span>
          </div>
        </div>
      </div>

      {/* Module 1 & Module 2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Demographics Breakdown */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                Workforce Demographics & Career Levels
              </h3>
              <p className="text-xs text-slate-500">Headcount distribution across L1–L8 career stages (Female vs Male)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium mr-2">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block"></span> Female</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span> Male</span>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                n = {headcount}
              </span>
            </div>
          </div>

          {/* Level Distribution Stacked Bar Chart */}
          <div className="space-y-3">
            {(demographics.byLevel || []).map((lvl: any) => (
              <div key={lvl.level} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold font-mono text-slate-800">{lvl.level}</span>
                  <span className="text-slate-500">
                    <strong className="text-slate-900">{lvl.total}</strong> headcount
                    {lvl.total > 0 && ` (${lvl.female}F · ${lvl.male}M)`}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                  {lvl.total > 0 ? (
                    <>
                      <div
                        style={{ width: `${(lvl.female / lvl.total) * 100}%` }}
                        className="bg-rose-400 h-full transition-all"
                        title={`${lvl.female} Females (${Math.round((lvl.female / lvl.total) * 100)}%)`}
                      />
                      <div
                        style={{ width: `${(lvl.male / lvl.total) * 100}%` }}
                        className="bg-sky-500 h-full transition-all"
                        title={`${lvl.male} Males (${Math.round((lvl.male / lvl.total) * 100)}%)`}
                      />
                    </>
                  ) : (
                    <div className="w-full bg-slate-100 h-full" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Work Mode & Tenure Split */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Work Mode</span>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Hybrid</span>
                  <span className="font-bold text-slate-900">{demographics.modeBreakdown?.['Hybrid'] || 0}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>On-site</span>
                  <span className="font-bold text-slate-900">{demographics.modeBreakdown?.['On-site'] || 0}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Remote</span>
                  <span className="font-bold text-slate-900">{demographics.modeBreakdown?.['Remote'] || 0}</span>
                </div>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Tenure Distribution</span>
              <div className="mt-2 space-y-1 text-xs">
                {Object.entries(demographics.tenureBands || {}).map(([b, count]: any) => (
                  <div key={b} className="flex justify-between text-slate-600">
                    <span>{b}</span>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: 9-Box Talent Matrix */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                9-Box Performance vs. Competence Matrix
              </h3>
              <p className="text-xs text-slate-500">Calibrated talent segmentation: Performance (1–5) vs. Competence (1–5). <em>Click any box to view employees.</em></p>
            </div>
            <button
              type="button"
              onClick={() => onSelectNineBoxCategory && onSelectNineBoxCategory('hipo', '⭐ Star / HIPO')}
              className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 hover:bg-amber-100 transition-all cursor-pointer"
              title="Click to view all HIPOs"
            >
              ⭐ {summary.hipoCount || 0} HIPOs
            </button>
          </div>

          {/* 3x3 Interactive Grid */}
          <div className="grid grid-cols-3 gap-2.5 aspect-square max-w-[420px] mx-auto">
            {/* Top row: High Competence (4-5) */}
            <button
              type="button"
              onClick={() => onSelectNineBoxCategory && onSelectNineBoxCategory('enigma', 'Enigma')}
              className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between hover:shadow-md hover:scale-[1.02] hover:border-amber-400 active:scale-95 transition-all text-left group cursor-pointer"
              title="Click to view employees bucketed under Enigma"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-amber-800 uppercase group-hover:text-amber-900">Enigma</span>
                <span className="text-[8px] text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">View →</span>
              </div>
              <span className="text-2xl font-black text-amber-700">{nineBox['low-high']?.count || 0}</span>
              <span className="text-[9px] text-slate-500">Low Perf / High Comp</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectNineBoxCategory && onSelectNineBoxCategory('growth', 'Growth Potential')}
              className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between hover:shadow-md hover:scale-[1.02] hover:border-emerald-400 active:scale-95 transition-all text-left group cursor-pointer"
              title="Click to view employees bucketed under Growth Potential"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-emerald-800 uppercase group-hover:text-emerald-900">Growth Potential</span>
                <span className="text-[8px] text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">View →</span>
              </div>
              <span className="text-2xl font-black text-emerald-700">{nineBox['med-high']?.count || 0}</span>
              <span className="text-[9px] text-slate-500">Med Perf / High Comp</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectNineBoxCategory && onSelectNineBoxCategory('star', 'Star / HIPO')}
              className="p-2.5 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-400 flex flex-col justify-between shadow-sm relative overflow-hidden ring-2 ring-amber-400/30 hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all text-left group cursor-pointer"
              title="Click to view employees bucketed under Star / HIPO"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-extrabold text-amber-900 uppercase flex items-center gap-1">
                  ⭐ Star / HIPO
                </span>
                <span className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded-full">Top</span>
              </div>
              <span className="text-2xl font-black text-amber-800">{nineBox['high-high']?.count || 0}</span>
              <div className="flex items-center justify-between w-full">
                <span className="text-[9px] font-semibold text-amber-900">High Perf / High Comp</span>
                <span className="text-[8px] text-amber-800 opacity-0 group-hover:opacity-100 transition-opacity font-bold">View →</span>
              </div>
            </button>

            {/* Middle row: Medium Competence (3) */}
            <button
              type="button"
              onClick={() => onSelectNineBoxCategory && onSelectNineBoxCategory('dilemma', 'Dilemma')}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:shadow-md hover:scale-[1.02] hover:border-slate-400 active:scale-95 transition-all text-left group cursor-pointer"
              title="Click to view employees bucketed under Dilemma"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-slate-600 uppercase group-hover:text-slate-900">Dilemma</span>
                <span className="text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">View →</span>
              </div>
              <span className="text-2xl font-black text-slate-700">{nineBox['low-med']?.count || 0}</span>
              <span className="text-[9px] text-slate-500">Low Perf / Med Comp</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectNineBoxCategory && onSelectNineBoxCategory('core', 'Core Performer')}
              className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex flex-col justify-between hover:shadow-md hover:scale-[1.02] hover:border-sky-400 active:scale-95 transition-all text-left group cursor-pointer"
              title="Click to view employees bucketed under Core Performer"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-slate-700 uppercase group-hover:text-sky-800">Core Performer</span>
                <span className="text-[8px] text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">View →</span>
              </div>
              <span className="text-2xl font-black text-slate-900">{nineBox['med-med']?.count || 0}</span>
              <span className="text-[9px] text-slate-500">Med Perf / Med Comp</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectNineBoxCategory && onSelectNineBoxCategory('high performer', 'High Performer')}
              className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex flex-col justify-between hover:shadow-md hover:scale-[1.02] hover:border-emerald-400 active:scale-95 transition-all text-left group cursor-pointer"
              title="Click to view employees bucketed under High Performer"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-emerald-700 uppercase group-hover:text-emerald-900">High Performer</span>
                <span className="text-[8px] text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">View →</span>
              </div>
              <span className="text-2xl font-black text-emerald-600">{nineBox['high-med']?.count || 0}</span>
              <span className="text-[9px] text-slate-500">High Perf / Med Comp</span>
            </button>

            {/* Bottom row: Foundational/Low Competence (1-2) */}
            <button
              type="button"
              onClick={() => onSelectNineBoxCategory && onSelectNineBoxCategory('underperformer', 'Underperformer')}
              className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex flex-col justify-between hover:shadow-md hover:scale-[1.02] hover:border-rose-400 active:scale-95 transition-all text-left group cursor-pointer"
              title="Click to view employees bucketed under Underperformer"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-rose-700 uppercase group-hover:text-rose-900">Underperformer</span>
                <span className="text-[8px] text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">View →</span>
              </div>
              <span className="text-2xl font-black text-rose-600">{nineBox['low-low']?.count || 0}</span>
              <span className="text-[9px] text-slate-500">Low Perf / Low Comp</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectNineBoxCategory && onSelectNineBoxCategory('contributor', 'Contributor')}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:shadow-md hover:scale-[1.02] hover:border-slate-400 active:scale-95 transition-all text-left group cursor-pointer"
              title="Click to view employees bucketed under Contributor"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-slate-600 uppercase group-hover:text-slate-900">Contributor</span>
                <span className="text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">View →</span>
              </div>
              <span className="text-2xl font-black text-slate-700">{nineBox['med-low']?.count || 0}</span>
              <span className="text-[9px] text-slate-500">Med Perf / Low Comp</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectNineBoxCategory && onSelectNineBoxCategory('solid pro', 'Solid Pro')}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:shadow-md hover:scale-[1.02] hover:border-slate-400 active:scale-95 transition-all text-left group cursor-pointer"
              title="Click to view employees bucketed under Solid Pro"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-slate-600 uppercase group-hover:text-slate-900">Solid Pro</span>
                <span className="text-[8px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">View →</span>
              </div>
              <span className="text-2xl font-black text-slate-700">{nineBox['high-low']?.count || 0}</span>
              <span className="text-[9px] text-slate-500">High Perf / Low Comp</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
            <span className="font-semibold">← Performance Rating: 1 (Low) to 5 (High) →</span>
            <span className="font-semibold">↑ Competence Score: 1 (Foundational) to 5 (Mastery) ↑</span>
          </div>
        </div>
      </div>

      {/* Module 3: Rewards & Compa-Ratio Distribution */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              Compensation Positioning & Pay Band Compa-Ratios
            </h3>
            <p className="text-xs text-slate-500">
              Salary distribution by career level against band midpoints (INR Lakhs).
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-2.5 px-3 font-semibold">Career Level</th>
                <th className="py-2.5 px-3 font-semibold">Population</th>
                <th className="py-2.5 px-3 font-semibold">Pay Band Range</th>
                <th className="py-2.5 px-3 font-semibold">Compa P25</th>
                <th className="py-2.5 px-3 font-semibold text-sky-700">Median Salary</th>
                <th className="py-2.5 px-3 font-semibold">Compa P75</th>
                <th className="py-2.5 px-3 font-semibold">Band Positioning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(compa.byLevel || []).map((lvl: any) => (
                <tr key={lvl.level} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{lvl.level}</td>
                  <td className="py-3 px-3 font-medium text-slate-700">{lvl.count}</td>
                  <td className="py-3 px-3 text-slate-600 font-mono">
                    ₹{lvl.bandMin}L – <span className="font-bold text-sky-700">₹{lvl.bandMid}L</span> – ₹{lvl.bandMax}L
                  </td>
                  <td className="py-3 px-3 text-slate-500 font-mono">₹{lvl.p25}L</td>
                  <td className="py-3 px-3 text-sky-700 font-mono font-bold">₹{lvl.median}L</td>
                  <td className="py-3 px-3 text-slate-500 font-mono">₹{lvl.p75}L</td>
                  <td className="py-3 px-3">
                    {lvl.count === 0 ? (
                      <span className="text-slate-400 text-[10px]">No employees</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Module 4: Span of Control */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 flex-wrap">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Organizational Layers & Managerial Load</span>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full shadow-xs">
                (Optimal Managerial Span: 6–8 Direct Reports)
              </span>
            </h3>
            <p className="text-xs text-slate-500">Supervisory span distribution and organizational hierarchy depth · Target: 6–8 direct reports per Manager/Sr. Manager</p>
          </div>
          <span className="text-xs text-slate-600">
            Total Managers: <strong className="text-slate-900">{spansAndLayers.managerCount || 0}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Span Distribution</span>
            <div className="mt-3 space-y-2">
              {Object.entries(spansAndLayers.spanBuckets || {}).map(([bucket, count]: any) => (
                <div key={bucket} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 font-medium">{bucket} direct reports</span>
                    {bucket.includes('6-10') && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                        Optimal (6–8 Target)
                      </span>
                    )}
                  </div>
                  <span className="font-mono font-bold text-slate-900">{count} managers</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Organizational Layer Depth</span>
            <div className="mt-3 space-y-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between">
                <span className="text-slate-700">Layer 1 (Business Unit Head)</span>
                <span className="font-mono font-bold text-slate-900">{spansAndLayers.layerDistribution?.Layer1 || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between">
                <span className="text-slate-700">Layer 2 (Senior Managers / Directors)</span>
                <span className="font-mono font-bold text-slate-900">{spansAndLayers.layerDistribution?.Layer2 || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between">
                <span className="text-slate-700">Layer 3 (Team Leads / Managers)</span>
                <span className="font-mono font-bold text-slate-900">{spansAndLayers.layerDistribution?.Layer3 || 0}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex justify-between">
                <span className="text-slate-700">Layer 4 (Individual Contributors)</span>
                <span className="font-mono font-bold text-slate-900">{spansAndLayers.layerDistribution?.Layer4 || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
