'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertTriangle,
  Award,
  DollarSign,
  TrendingUp,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { DEFAULT_PAY_BANDS, calculateCompaRatio } from '@/lib/compensation';

interface PromotionWorkflowModalProps {
  employeeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onPromotionExecuted?: () => void;
}

export default function PromotionWorkflowModal({
  employeeId,
  isOpen,
  onClose,
  onPromotionExecuted
}: PromotionWorkflowModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);
  const [activeStage, setActiveStage] = useState<number>(6); // Default to decision stage for fast demo review
  const [proposedSalary, setProposedSalary] = useState<number>(34.0);
  const [decisionNotes, setDecisionNotes] = useState<string>(
    'Calibration committee endorses promotion to L4 Principal Data Engineer based on sustained multi-quarter delivery, architecture ownership, and positive peer reviews.'
  );

  const fetchPromotionDetails = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/promotions/${employeeId}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
        if (json.nomination?.proposedSalary) {
          setProposedSalary(json.nomination.proposedSalary);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchPromotionDetails();
    }
  }, [isOpen, employeeId]);

  if (!isOpen || !employeeId) return null;

  const emp = data?.employee;
  const nomination = data?.nomination;
  const isAlreadyL4 = emp?.careerLevel === 'L4';
  const bandL4 = DEFAULT_PAY_BANDS['L4'];
  const previewCompa = calculateCompaRatio(proposedSalary, 'L4');

  const handleExecutePromotion = async () => {
    setExecuting(true);
    try {
      const res = await fetch(`/api/employees/${employeeId}/promote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetLevel: 'L4',
          targetJobCode: 'A-PRIN-DATA',
          targetTitle: 'Principal Data Engineer',
          revisedSalary: proposedSalary,
          decisionRationale: decisionNotes
        })
      });

      const json = await res.json();
      if (json.success) {
        onPromotionExecuted?.();
        fetchPromotionDetails();
      }
    } catch (err) {
      console.error('Promotion execution error:', err);
    } finally {
      setExecuting(false);
    }
  };

  const STAGES = [
    { num: 1, name: 'Candidate Selection', status: 'Completed', detail: 'Eligible L3 Data Engineer identified.' },
    { num: 2, name: 'Manager Nomination', status: 'Completed', detail: 'Manager submitted dossier & technical outcomes.' },
    { num: 3, name: 'Competency Assessment', status: 'Completed', detail: 'Knowledge & Skills scored on A-E framework.' },
    { num: 4, name: 'Evidence Review', status: 'Completed', detail: 'Verified 3 RFCs and production streaming pipeline.' },
    { num: 5, name: 'Calibration Panel', status: 'Completed', detail: 'Cross-functional calibration by Engineering & HRBP.' },
    { num: 6, name: 'Promotion Decision', status: isAlreadyL4 ? 'Approved' : 'Pending Action', detail: 'Record final human-reviewed decision.' },
    { num: 7, name: 'Career & Comp Update', status: isAlreadyL4 ? 'Executed' : 'Ready', detail: 'Execute live transaction & update pay band.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Banner */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Structured 7-Stage Promotion Assessment Workflow
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Data Engineering L3 to L4 Promotion Calibration
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Candidate: <strong className="text-slate-900">{emp?.name}</strong> ({emp?.id}) · Current: {emp?.careerLevel} ({emp?.jobTitle}) → Target: <strong className="text-sky-700">L4 Principal Data Engineer</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-Stage Horizontal Stepper */}
        <div className="p-4 bg-slate-50/50 border-b border-slate-200 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-[720px]">
            {STAGES.map((s, idx) => (
              <React.Fragment key={s.num}>
                <button
                  onClick={() => setActiveStage(s.num)}
                  className={`p-2.5 rounded-xl border text-left flex-1 transition-all ${
                    activeStage === s.num
                      ? 'bg-sky-50 border-sky-400 text-sky-900 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
                    <span>Stage {s.num}</span>
                    <span className={s.status === 'Approved' || s.status === 'Executed' || s.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}>
                      {s.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">{s.name}</div>
                </button>
                {idx < STAGES.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Stage Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs bg-white">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-2"></div>
              Loading promotion workflow data...
            </div>
          ) : (
            <>
              {/* Review summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[11px] block font-semibold">Manager Nomination Rationale</span>
                  <p className="text-slate-700 mt-1 leading-relaxed">
                    {nomination?.managerNominationNotes || 'Demonstrated multi-quarter L3 excellence and owned the Lakehouse telemetry ingestion stream.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[11px] block font-semibold">Verified Observable Artifacts</span>
                  <p className="text-slate-700 mt-1 leading-relaxed">
                    {nomination?.evidenceNotes || '3 major RFCs; telemetry latency reduced by 42%; mentored two junior engineers.'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[11px] block font-semibold">Calibration Committee</span>
                  <p className="text-sky-800 font-medium mt-1">
                    {nomination?.committeeMembers || 'Arunachalam S. (Eng), Bhavna Rao (Ops), Soma Kiran Gonella (HRBP)'}
                  </p>
                </div>
              </div>

              {/* Compensation & Band Positioning Impact Preview */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Proposed L4 Compensation & Pay Band Alignment
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-500 mb-1 font-semibold">Proposed Annual Fixed Pay (INR Lakhs)</label>
                    <input
                      type="number"
                      step="0.5"
                      disabled={isAlreadyL4}
                      value={proposedSalary}
                      onChange={(e) => setProposedSalary(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <span className="text-slate-500 mb-1 block font-semibold">Applicable L4 Pay Band</span>
                    <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-sky-800">
                      ₹{bandL4.min}L – <span className="font-bold">₹{bandL4.midpoint}L</span> – ₹{bandL4.max}L
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 mb-1 block font-semibold">New Compa-Ratio (Derived)</span>
                    <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono font-bold text-emerald-700">
                      {previewCompa.toFixed(3)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Committee Decision Rationale */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block font-bold text-slate-900 text-sm">Committee Decision & Calibration Rationale</label>
                <textarea
                  rows={3}
                  disabled={isAlreadyL4}
                  value={decisionNotes}
                  onChange={(e) => setDecisionNotes(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs focus:border-sky-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Success / Current Status Banner */}
              {isAlreadyL4 && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold block">Promotion to L4 Principal Data Engineer is ACTIVE & APPROVED!</span>
                    <span className="text-xs text-slate-600">
                      Current career level is L4, compensation band is updated, and the transaction is recorded in the permanent audit ledger.
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            * Promotion updates the Single Source of Truth, recalculates compa-ratio, and reflects in leadership analytics.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Close
            </button>
            {!isAlreadyL4 && (
              <button
                onClick={handleExecutePromotion}
                disabled={executing}
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{executing ? 'Executing...' : 'Approve & Execute L4 Promotion'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
