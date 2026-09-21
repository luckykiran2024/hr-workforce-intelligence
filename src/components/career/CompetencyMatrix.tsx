'use client';

import React, { useState } from 'react';
import {
  Award,
  Layers,
  BookOpen,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Cpu,
  Users,
  Building2,
  Workflow,
  ChevronRight,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import {
  MASTER_LEVEL_MAPPING,
  BEHAVIORAL_PILLARS,
  CRAFT_DATA_ENGINEERING,
  PROFICIENCY_SCALE,
  LevelMapping
} from '@/lib/competencyFrameworkData';

interface CompetencyMatrixProps {
  onNavigateToCareerArch?: () => void;
}

export default function CompetencyMatrix({ onNavigateToCareerArch }: CompetencyMatrixProps) {
  const [activeTab, setActiveTab] = useState<'matrix' | 'behavioral' | 'craft'>('matrix');
  const [selectedLevel, setSelectedLevel] = useState<LevelMapping>(MASTER_LEVEL_MAPPING[2]); // Default L3
  const [selectedPillarId, setSelectedPillarId] = useState<string>('execution');
  const [selectedGrade, setSelectedGrade] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('C');
  const [craftGrade, setCraftGrade] = useState<'A' | 'B' | 'C' | 'D' | 'E'>('D');

  const activePillar = BEHAVIORAL_PILLARS.find(p => p.id === selectedPillarId) || BEHAVIORAL_PILLARS[0];
  const activeCraft = CRAFT_DATA_ENGINEERING[craftGrade];

  const getGradeBadge = (grade: string, pillarType: 'execution' | 'organization' | 'people' | 'craft') => {
    if (grade === '—' || !grade) {
      return <span className="text-slate-300 font-mono text-xs">—</span>;
    }
    const colorMap = {
      execution: 'bg-sky-100 text-sky-800 border-sky-300',
      organization: 'bg-pink-100 text-pink-800 border-pink-300',
      people: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      craft: 'bg-teal-100 text-teal-800 border-teal-300'
    };
    return (
      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black font-mono border shadow-sm ${colorMap[pillarType]}`}>
        {grade}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Header Banner with Presentation Context */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-indigo-100/40 via-sky-100/30 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Articulation Sequence · Part 1 of 2
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Enterprise Competency Framework & Level Rubric
            </h1>
            <p className="text-sm text-slate-500 max-w-3xl leading-relaxed">
              Before discussing career level ladders, we anchor capability evaluation on <strong>4 Core Pillars</strong> (Execution, Organization, People, and Functional Craft) measured on an objective <strong>5-grade continuum (A to E)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onNavigateToCareerArch && (
              <button
                onClick={onNavigateToCareerArch}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-sky-600/20 hover:from-sky-500 hover:to-indigo-500 transition-all cursor-pointer"
              >
                <span>Proceed to L1–L8 Architecture</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 5-Grade Proficiency Continuum Quick Scale */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PROFICIENCY_SCALE.map(p => (
            <div
              key={p.grade}
              onClick={() => {
                setSelectedGrade(p.grade as any);
                setCraftGrade(p.grade as any);
              }}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                selectedGrade === p.grade
                  ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-400/20'
                  : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center shadow-sm">
                  {p.grade}
                </span>
                <span className="font-bold text-slate-900 text-xs truncate">{p.name.split('/')[0]}</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'matrix'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Master Level-to-Proficiency Mapping (L1–L8)
        </button>
        <button
          onClick={() => setActiveTab('behavioral')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'behavioral'
              ? 'bg-white text-pink-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          3 Behavioral Pillars (Execution, Org, People)
        </button>
        <button
          onClick={() => setActiveTab('craft')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'craft'
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Functional Craft (Data Engineering Knowledge & Experience)
        </button>
      </div>

      {/* VIEW 1: MASTER LEVEL-TO-PROFICIENCY MAPPING MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-600">
                  <BookOpen className="w-3.5 h-3.5" />
                  Enterprise Matrix Standard
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  Master Level-to-Proficiency Mapping (L1 to L8)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any level row to inspect the consolidated target capability expectations.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-sky-500"></span> Execution
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-pink-500"></span> Organization
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> People
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-teal-500"></span> Craft
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-slate-700 font-bold text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-4">Level</th>
                    <th className="py-3.5 px-4">Experience Band</th>
                    <th className="py-3.5 px-4">Data Engineering Role</th>
                    <th className="py-3.5 px-4 text-center bg-sky-50/80 text-sky-900 border-x border-sky-200/60">
                      Execution
                      <span className="block text-[10px] font-normal normal-case text-sky-700 mt-0.5">PM, Comm, Stakeholder</span>
                    </th>
                    <th className="py-3.5 px-4 text-center bg-pink-50/80 text-pink-900 border-r border-pink-200/60">
                      Organization
                      <span className="block text-[10px] font-normal normal-case text-pink-700 mt-0.5">Org Design, Change, Team</span>
                    </th>
                    <th className="py-3.5 px-4 text-center bg-emerald-50/80 text-emerald-900 border-r border-emerald-200/60">
                      People
                      <span className="block text-[10px] font-normal normal-case text-emerald-700 mt-0.5">Acquisition, Happiness, Engagement</span>
                    </th>
                    <th className="py-3.5 px-4 text-center bg-teal-50/80 text-teal-900 border-r border-teal-200/60">
                      Craft
                      <span className="block text-[10px] font-normal normal-case text-teal-700 mt-0.5">Knowledge & Deliverables</span>
                    </th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MASTER_LEVEL_MAPPING.map((row) => {
                    const isSelected = selectedLevel.level === row.level;
                    return (
                      <tr
                        key={row.level}
                        onClick={() => setSelectedLevel(row)}
                        className={`transition-colors cursor-pointer ${
                          isSelected ? 'bg-indigo-50/60 font-semibold' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono font-black text-xs">
                            {row.level}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium text-xs whitespace-nowrap">
                          {row.experience}
                        </td>
                        <td className="py-3.5 px-4 text-slate-900 font-bold text-xs">
                          {row.title}
                        </td>
                        <td className="py-3.5 px-4 text-center bg-sky-50/30 border-x border-sky-100">
                          {getGradeBadge(row.execution, 'execution')}
                        </td>
                        <td className="py-3.5 px-4 text-center bg-pink-50/30 border-r border-pink-100">
                          {getGradeBadge(row.organization, 'organization')}
                        </td>
                        <td className="py-3.5 px-4 text-center bg-emerald-50/30 border-r border-emerald-100">
                          {getGradeBadge(row.people, 'people')}
                        </td>
                        <td className="py-3.5 px-4 text-center bg-teal-50/30 border-r border-teal-100">
                          {getGradeBadge(row.craft, 'craft')}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLevel(row);
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? 'Selected' : 'Inspect'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Level Summary Card */}
          {selectedLevel && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-mono font-black text-lg">
                    {selectedLevel.level}
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900">
                      {selectedLevel.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Experience Expectation: <strong className="text-slate-800">{selectedLevel.experience}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-xl bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200">
                    Execution: {selectedLevel.execution}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-pink-100 text-pink-800 text-xs font-bold border border-pink-200">
                    Organization: {selectedLevel.organization}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                    People: {selectedLevel.people}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200">
                    Craft: {selectedLevel.craft}
                  </span>
                </div>
              </div>

              {/* Functional Craft Deep Dive for selected level */}
              {CRAFT_DATA_ENGINEERING[selectedLevel.craft] && (
                <div className="pt-2">
                  <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/80 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                      Craft Standard · Grade {selectedLevel.craft}
                    </span>
                    <p className="text-xs text-teal-950 font-semibold italic mt-1 leading-relaxed">
                      "{CRAFT_DATA_ENGINEERING[selectedLevel.craft].summary}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <h5 className="font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-teal-600" />
                        Knowledge Requirements (Grade {selectedLevel.craft})
                      </h5>
                      <div className="space-y-2.5">
                        {CRAFT_DATA_ENGINEERING[selectedLevel.craft].knowledge.map((k, i) => (
                          <div key={i} className="text-xs">
                            <span className="font-bold text-slate-800 block">• {k.title}</span>
                            <span className="text-slate-600 text-[11px] leading-relaxed pl-3 block">{k.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <h5 className="font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                        Experience & Impact Requirements (Grade {selectedLevel.craft})
                      </h5>
                      <div className="space-y-2.5">
                        {CRAFT_DATA_ENGINEERING[selectedLevel.craft].experience.map((e, i) => (
                          <div key={i} className="text-xs">
                            <span className="font-bold text-slate-800 block">• {e.title}</span>
                            <span className="text-slate-600 text-[11px] leading-relaxed pl-3 block">{e.desc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: 3 BEHAVIORAL PILLARS (EXECUTION, ORGANIZATION, PEOPLE) */}
      {activeTab === 'behavioral' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Pillar Selector Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BEHAVIORAL_PILLARS.map(pillar => {
              const isSelected = selectedPillarId === pillar.id;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillarId(pillar.id)}
                  className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? `${pillar.color.bg} ${pillar.color.border} ring-2 ring-indigo-400/20 shadow-sm`
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${pillar.color.badgeBg} ${pillar.color.badgeText}`}>
                      Pillar
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      3 Sub-Competencies
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 tracking-tight">
                    {pillar.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 italic line-clamp-2">
                    "{pillar.scope}"
                  </p>
                </button>
              );
            })}
          </div>

          {/* Proficiency Grade Selector (A to E) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Filter by Proficiency Grade
              </span>
              <span className="text-sm font-black text-slate-900">
                Grade {selectedGrade} · {PROFICIENCY_SCALE.find(p => p.grade === selectedGrade)?.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {(['A', 'B', 'C', 'D', 'E'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`w-10 h-10 rounded-xl font-mono font-black text-sm transition-all cursor-pointer ${
                    selectedGrade === g
                      ? 'bg-slate-900 text-white shadow-md scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-competencies Rubric Cards */}
          {activePillar.levels[selectedGrade] && (
            <div className="space-y-4">
              {/* Optional overall summary row */}
              {activePillar.levels[selectedGrade].summaryRow && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-semibold italic">
                  💡 Pillar Baseline: {activePillar.levels[selectedGrade].summaryRow}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {activePillar.subPillarNames.map(subName => {
                  const subComp = activePillar.levels[selectedGrade].subCompetencies[subName];
                  if (!subComp) return null;
                  return (
                    <div
                      key={subName}
                      className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h5 className="font-black text-slate-900 text-sm">
                            {subComp.name}
                          </h5>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono font-bold text-xs">
                            Grade {selectedGrade}
                          </span>
                        </div>

                        {/* Top statement from user spreadsheet */}
                        <div className={`p-3 rounded-xl ${activePillar.color.bg} border ${activePillar.color.border}`}>
                          <p className={`text-xs font-semibold italic ${activePillar.color.text} leading-relaxed`}>
                            "{subComp.summary}"
                          </p>
                        </div>

                        {/* Behavioral Indicators List */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Key Behavioral Evidence:
                          </span>
                          <ul className="space-y-2">
                            {subComp.indicators.map((ind, idx) => (
                              <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                                <span>{ind}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Pillar: {activePillar.name}</span>
                        <span>Evaluation continuum A–E</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: FUNCTIONAL CRAFT (DATA ENGINEERING) */}
      {activeTab === 'craft' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Grade Selector Header */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black uppercase tracking-wider mb-1">
                  <Cpu className="w-3.5 h-3.5" />
                  Domain Expertise & Engineering Depth
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Data Engineering Craft Rubric (Grades A to E)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dual-faceted technical evaluation: Theoretical <strong>Knowledge</strong> vs. Applied <strong>Experience</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {(['A', 'B', 'C', 'D', 'E'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setCraftGrade(g)}
                    className={`w-11 h-11 rounded-2xl font-mono font-black text-sm transition-all cursor-pointer ${
                      craftGrade === g
                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/20 scale-105'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Scope Statement */}
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-teal-950">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block mb-1">
                Proficiency Grade {activeCraft.grade} Definition
              </span>
              <p className="text-sm font-semibold italic leading-relaxed">
                "{activeCraft.summary}"
              </p>
            </div>
          </div>

          {/* Split Columns: Knowledge vs Experience */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Knowledge Column */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">
                    Knowledge & Conceptual Depth
                  </h4>
                  <p className="text-xs text-slate-500">
                    What the engineer knows, analyzes, designs, and architects
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {activeCraft.knowledge.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-teal-100 text-teal-800 font-mono font-black text-[11px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h5 className="font-bold text-slate-900 text-xs">{item.title}</h5>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-7">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Column */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">
                    Applied Experience & Delivery Impact
                  </h4>
                  <p className="text-xs text-slate-500">
                    What the engineer demonstrably executes, leads, and transforms
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {activeCraft.experience.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-800 font-mono font-black text-[11px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h5 className="font-bold text-slate-900 text-xs">{item.title}</h5>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pl-7">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Presentation Transition Call-out Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 font-bold">
            Interview Presentation Flow
          </span>
          <h4 className="text-lg font-black tracking-tight">
            Step 1 Complete: Competency Architecture Established
          </h4>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Now that the 4-pillar evaluation criteria (Execution, Organization, People, Craft) are articulated, proceed to <strong>Step 2: L1–L8 Career Architecture</strong> to present how individual contributors and managers advance, including track splits and the IC ceiling rule.
          </p>
        </div>

        {onNavigateToCareerArch && (
          <button
            onClick={onNavigateToCareerArch}
            className="shrink-0 px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-indigo-50 font-black text-xs transition-all shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <span>Proceed to Step 2: L1–L8 Career Architecture</span>
            <ArrowRight className="w-4 h-4 text-indigo-600" />
          </button>
        )}
      </div>
    </div>
  );
}
