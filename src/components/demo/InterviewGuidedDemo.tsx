'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Eye,
  UserPlus,
  Star,
  Layers,
  Award,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface InterviewGuidedDemoProps {
  currentStage: number;
  onSelectStage: (stage: number) => void;
  onTriggerReset: () => void;
  onOpenAddModal?: () => void;
  onOpenCandidateProfile?: (id: string) => void;
  onOpenPromotionModal?: (id: string) => void;
  resetting?: boolean;
}

export const DEMO_STAGES = [
  {
    stage: 1,
    title: 'Executive Dashboard',
    desc: 'Present the workforce, demographic distributions, compensation positioning, and managerial spans.',
    tabTarget: 'workforce',
    talkingPoint: 'Demonstrate how all four modules draw from one unified dataset without disconnected data silos.'
  },
  {
    stage: 2,
    title: 'Employee Master & Live SSOT',
    desc: 'Create or upload employees. Demonstrate instantaneous headcount updates and dynamic metric calculations.',
    tabTarget: 'employees',
    talkingPoint: 'Notice how every employee immediately reflects in team headcounts and demographic analytics live.'
  },
  {
    stage: 3,
    title: 'Talent Identification & 9-Box',
    desc: 'Open an employee profile and toggle Top Talent. Show real-time re-segmentation in the 9-Box matrix.',
    tabTarget: 'workforce',
    talkingPoint: 'Top Talent designation is an independent employee talent classification, strictly separated from critical role position importance.'
  },
  {
    stage: 4,
    title: 'L1–L8 Career Architecture',
    desc: 'Explore the 8-tier career ladder and explain how role scope, complexity, and decision autonomy decouple from tenure.',
    tabTarget: 'career-arch',
    talkingPoint: 'Walk through the 10 role dimensions and explain how Individual Contributor and People Manager tracks diverge at L4/L5.'
  },
  {
    stage: 5,
    title: 'Competency Assessment (A–E)',
    desc: 'Select an L3 Data Engineer (SYN-0012). Compare Knowledge and Skills against L4 targets and generate an automated IDP.',
    tabTarget: 'career-assessment',
    talkingPoint: 'Knowledge (understanding) and Skills (delivery) are graded independently on the 5-level scale (Awareness to Expert).'
  },
  {
    stage: 6,
    title: 'L3-to-L4 Promotion Workflow',
    desc: 'Step through the 7-stage promotion workflow, review calibration evidence, and execute live approval updating to L4 & new pay band.',
    tabTarget: 'career-assessment',
    talkingPoint: 'Competency readiness informs promotion, but human calibration evaluates sustained multi-quarter organizational impact.'
  },
  {
    stage: 7,
    title: 'Appraisal Case Study & 90-Day Plan',
    desc: 'Present the 3 distinct team challenges (Engineering Leniency, Operations Overload, Revenue Proximity Paradox) and the 90-day plan.',
    tabTarget: 'case-study',
    talkingPoint: 'Recommend targeted systemic interventions (span capping, blinded calibration) over disruptive blanket rating adjustments.'
  }
];

export default function InterviewGuidedDemo({
  currentStage,
  onSelectStage,
  onTriggerReset,
  onOpenAddModal,
  onOpenCandidateProfile,
  onOpenPromotionModal,
  resetting
}: InterviewGuidedDemoProps) {
  const [isOpen, setIsOpen] = useState(true);
  const cur = DEMO_STAGES.find(s => s.stage === currentStage) || DEMO_STAGES[0];

  return (
    <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 p-4 shadow-2xl relative overflow-hidden animate-fadeIn">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Stage Indicator & Title */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center font-mono font-black text-cyan-400 shrink-0 mt-0.5">
            {cur.stage}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                Stage {cur.stage} of 7 · Guided Interview Demonstration
              </span>
              <span className="text-slate-400 text-xs font-bold">{cur.title}</span>
            </div>
            <p className="text-xs text-slate-200 mt-1 max-w-2xl leading-relaxed">
              {cur.desc}
            </p>
            <div className="text-[11px] text-cyan-300/90 mt-1 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3 h-3 text-cyan-400 shrink-0" />
              <span>HRBP Narrative: &quot;{cur.talkingPoint}&quot;</span>
            </div>
          </div>
        </div>

        {/* Quick Demo Action Buttons & Navigation */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {cur.stage === 2 && onOpenAddModal && (
            <button
              onClick={onOpenAddModal}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Female L3 Engineer</span>
            </button>
          )}

          {cur.stage === 3 && onOpenCandidateProfile && (
            <button
              onClick={() => onOpenCandidateProfile('SYN-0012')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <Star className="w-3.5 h-3.5" />
              <span>Open Profile (SYN-0012)</span>
            </button>
          )}

          {cur.stage === 6 && onOpenPromotionModal && (
            <button
              onClick={() => onOpenPromotionModal('SYN-0012')}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Open Promotion Workflow</span>
            </button>
          )}

          {/* Stepper Buttons */}
          <button
            onClick={() => onSelectStage(Math.max(1, currentStage - 1))}
            disabled={currentStage <= 1}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 disabled:opacity-40 transition-colors"
            title="Previous Stage"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelectStage(Math.min(7, currentStage + 1))}
            disabled={currentStage >= 7}
            className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40 transition-colors flex items-center gap-1 text-xs font-bold px-3"
          >
            <span>Next Stage</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onTriggerReset}
            disabled={resetting}
            className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ml-1"
            title="Restores workforce baseline"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? 'Resetting...' : 'Reset Demo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
