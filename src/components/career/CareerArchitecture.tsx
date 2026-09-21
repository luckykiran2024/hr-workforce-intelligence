'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Users,
  Briefcase,
  Target,
  Sparkles
} from 'lucide-react';

export default function CareerArchitecture() {
  const [data, setData] = useState<any>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>('L3');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/career')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  const currentLevelDef = data.levels.find((l: any) => l.level === selectedLevel) || data.levels[2];
  const currentPayBand = data.payBands[selectedLevel] || { min: 15, midpoint: 21, max: 29 };
  const currentHeadcount = data.levelCounts[selectedLevel] || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider mb-1">
              L1–L8 Structured Job Architecture
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Enterprise Career Framework & Dual Tracks
            </h2>
            <p className="text-xs text-slate-500 max-w-3xl mt-0.5">
              Structured 8-tier job architecture decoupling tenure and years of experience from demonstrated role scope, technical mastery, problem-solving complexity, and business impact.
            </p>
          </div>
        </div>
      </div>

      {/* Dual Track Summary Table */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-sky-600" />
              Dual-Track Enterprise Career Matrix (IC vs. Management)
            </h3>
            <p className="text-xs text-slate-500">
              Direct parity between technical individual contribution and people leadership across L1 to L8.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <th className="py-2.5 px-4 font-semibold">Level</th>
                <th className="py-2.5 px-4 font-semibold text-sky-700">Individual Contributor (IC) Track</th>
                <th className="py-2.5 px-4 font-semibold text-indigo-700">Management Track</th>
                <th className="py-2.5 px-4 font-semibold">Band Midpoint</th>
                <th className="py-2.5 px-4 font-semibold">Active Staff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { lvl: 'L1', ic: 'Data Engineer I', mgmt: '—', mid: '₹8.0L', count: data.levelCounts?.L1 || 0 },
                { lvl: 'L2', ic: 'Data Engineer II', mgmt: '—', mid: '₹13.0L', count: data.levelCounts?.L2 || 0 },
                { lvl: 'L3', ic: 'Sr. Data Engineer', mgmt: '—', mid: '₹21.0L', count: data.levelCounts?.L3 || 0 },
                { lvl: 'L4', ic: 'Principal Engineer I', mgmt: 'Lead', mid: '₹34.0L', count: data.levelCounts?.L4 || 0, split: true },
                { lvl: 'L5', ic: 'Principal Engineer II', mgmt: 'Engineering Manager', mid: '₹57.0L', count: data.levelCounts?.L5 || 0, split: true },
                { lvl: 'L6', ic: 'Technical Architect', mgmt: 'Sr. Manager', mid: '₹85.0L', count: data.levelCounts?.L6 || 0, split: true },
                { lvl: 'L7', ic: '— (No IC Role at L7)', mgmt: 'Director', mid: '₹125.0L', count: data.levelCounts?.L7 || 0, leadershipOnly: true },
                { lvl: 'L8', ic: '— (No IC Role at L8)', mgmt: 'Sr. Director', mid: '₹180.0L', count: data.levelCounts?.L8 || 0, leadershipOnly: true }
              ].map(row => (
                <tr key={row.lvl} className={`hover:bg-slate-50 transition-colors ${row.split ? 'bg-sky-50/20' : (row.leadershipOnly ? 'bg-indigo-50/20' : '')}`}>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{row.lvl}</td>
                  <td className={`py-2.5 px-4 ${row.leadershipOnly ? 'text-slate-400 italic font-medium' : 'font-bold text-sky-800'}`}>{row.ic}</td>
                  <td className="py-2.5 px-4 font-bold text-indigo-800">{row.mgmt}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-600">{row.mid}</td>
                  <td className="py-2.5 px-4 font-mono text-slate-900">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Architecture Boundary Rule Note */}
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
          <span className="text-sm">📌</span>
          <div>
            <strong>Career Architecture Boundary Rule:</strong> The Individual Contributor (IC) technical ladder culminates at <strong>L6 (Technical Architect)</strong>. For <strong>L7 (Director)</strong> and <strong>L8 (Sr. Director)</strong>, there is no IC track — these levels are dedicated Executive People Leadership roles responsible for departmental and business unit governance.
          </div>
        </div>
      </div>

      {/* L1-L8 Horizontal Stepper Map */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-x-auto">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Select any career level to inspect 10-dimensional role expectations & pay bands
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 min-w-[700px]">
          {data.levels.map((lvl: any) => {
            const isSelected = lvl.level === selectedLevel;
            const count = data.levelCounts[lvl.level] || 0;

            return (
              <button
                key={lvl.level}
                onClick={() => setSelectedLevel(lvl.level)}
                className={`p-3.5 rounded-xl text-left border transition-all flex flex-col justify-between h-28 relative ${
                  isSelected
                    ? 'bg-sky-50/70 border-sky-500 shadow-sm ring-1 ring-sky-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-sm font-black ${isSelected ? 'text-sky-700' : 'text-slate-900'}`}>
                    {lvl.level}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">n={count}</span>
                </div>
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{lvl.title}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{lvl.track}</div>
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-sky-600 absolute -top-1 -right-1 shadow-sm"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Level Deep-Dive Explorer (10 Dimensions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Summary & Compensation */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="font-mono text-xs font-bold text-sky-700 px-2 py-0.5 bg-sky-50 border border-sky-200 rounded">
                Level {currentLevelDef.level}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">{currentLevelDef.title}</h3>
            </div>
            <span className="text-xs font-bold text-indigo-700 px-2.5 py-1 rounded bg-indigo-50 border border-indigo-200">
              {currentLevelDef.track}
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Applicable Pay Band</span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono">
              <div className="text-xs text-slate-600">Midpoint: <strong className="text-sky-700">₹{currentPayBand.midpoint} LPA</strong></div>
              <div className="text-xs text-slate-500 mt-1">Band Range: ₹{currentPayBand.min}L – ₹{currentPayBand.max} LPA</div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Employees</span>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600">Workforce Assigned:</span>
              <span className="text-base font-bold text-slate-900 font-mono">{currentHeadcount} employees</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 text-xs text-slate-700 space-y-1.5">
            <span className="font-bold text-sky-800 block">Core Role Purpose:</span>
            <p className="leading-relaxed">{currentLevelDef.purpose}</p>
          </div>
        </div>

        {/* Right 2 Columns: 10 Role Expectations Dimensions */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-5">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            10 Dimensional Role Expectations for {currentLevelDef.level} ({currentLevelDef.title})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-sky-700 block mb-1">1. Expected Knowledge:</span>
              <p className="text-slate-600 leading-relaxed">{currentLevelDef.knowledge}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-sky-700 block mb-1">2. Technical & Functional Skills:</span>
              <p className="text-slate-600 leading-relaxed">{currentLevelDef.skills}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-sky-700 block mb-1">3. Problem-Solving Complexity:</span>
              <p className="text-slate-600 leading-relaxed">{currentLevelDef.complexity}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-sky-700 block mb-1">4. Decision-Making Authority:</span>
              <p className="text-slate-600 leading-relaxed">{currentLevelDef.decisionScope}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-sky-700 block mb-1">5. Accountability & Delivery:</span>
              <p className="text-slate-600 leading-relaxed">{currentLevelDef.accountability}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-sky-700 block mb-1">6. Scope of Impact:</span>
              <p className="text-slate-600 leading-relaxed">{currentLevelDef.impact}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-sky-700 block mb-1">7. Stakeholder Management:</span>
              <p className="text-slate-600 leading-relaxed">{currentLevelDef.stakeholders}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-sky-700 block mb-1">8. Leadership Expectations:</span>
              <p className="text-slate-600 leading-relaxed">{currentLevelDef.leadership}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 md:col-span-2">
              <span className="font-bold text-sky-700 block mb-1">9 & 10. Expected Organisational Contribution:</span>
              <p className="text-slate-600 leading-relaxed">{currentLevelDef.contribution}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
