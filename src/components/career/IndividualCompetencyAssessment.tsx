'use client';

import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Award,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Edit2,
  Save,
  ArrowRight,
  UserPlus,
  Target,
  Calendar,
  Layers,
  ChevronRight,
  Clock,
  Trash2
} from 'lucide-react';

interface IndividualCompetencyAssessmentProps {
  initialEmployeeId?: string;
  onOpenPromotionWorkflow?: (employeeId: string) => void;
}

const CLASSIFICATION_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Learning and Development': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Coaching': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Mentoring': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Rewards': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Career Growth': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Role Enhancement and Role Enrichment': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' }
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  'PLANNED': { label: 'Planned', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  'IN_PROGRESS': { label: 'In Progress', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  'UNDER_REVIEW': { label: 'Under Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'COMPLETED': { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'ON_HOLD': { label: 'On Hold', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
};

export default function IndividualCompetencyAssessment({
  initialEmployeeId = '',
  onOpenPromotionWorkflow
}: IndividualCompetencyAssessmentProps) {
  const [employeeId, setEmployeeId] = useState(initialEmployeeId);
  const [employeeList, setEmployeeList] = useState<any[]>([]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [editingCompId, setEditingCompId] = useState<string | null>(null);
  const [editKGrade, setEditKGrade] = useState('C');
  const [editSGrade, setEditSGrade] = useState('C');
  const [saving, setSaving] = useState(false);
  const [generatingIDP, setGeneratingIDP] = useState(false);

  // Custom Action Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPriority, setNewPriority] = useState<'PRIMARY' | 'SECONDARY'>('PRIMARY');
  const [newClassification, setNewClassification] = useState('Learning and Development');
  const [newImprovementArea, setNewImprovementArea] = useState('');
  const [newCompetency, setNewCompetency] = useState('');
  const [newAction, setNewAction] = useState('');
  const [newEvidence, setNewEvidence] = useState('');
  const [newTargetDate, setNewTargetDate] = useState('Next 6 Months');
  const [creatingPlan, setCreatingPlan] = useState(false);

  // Fetch list of active employees for selector
  useEffect(() => {
    fetch('/api/employees?limit=300')
      .then(res => res.json())
      .then(json => {
        if (json.success && json.employees) {
          setEmployeeList(json.employees);
          if (!employeeId && json.employees.length > 0) {
            setEmployeeId(json.employees[0].id);
          }
        }
      })
      .catch(console.error);
  }, []);

  const fetchAssessment = async (id: string) => {
    if (!id) {
      setData(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/competencies/${id}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setData(null);
      }
    } catch (err) {
      console.error('Failed to load competency assessment:', err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (employeeId) {
      fetchAssessment(employeeId);
    }
  }, [employeeId]);

  const handleSaveGrade = async (comp: any) => {
    if (!employeeId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/competencies/${employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competencyId: comp.id,
          knowledgeGrade: editKGrade,
          skillsGrade: editSGrade,
          evidence: comp.evidence
        })
      });
      const json = await res.json();
      if (json.success) {
        setEditingCompId(null);
        fetchAssessment(employeeId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (planId: string, newStatus: string) => {
    if (!employeeId) return;
    try {
      const res = await fetch(`/api/employees/${employeeId}/idp`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, status: newStatus })
      });
      if (res.ok) {
        fetchAssessment(employeeId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!employeeId) return;
    if (!confirm('Are you sure you want to delete this IDP action item?')) return;
    try {
      const res = await fetch(`/api/employees/${employeeId}/idp?planId=${planId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchAssessment(employeeId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoGenerateIDP = async () => {
    if (!employeeId || !data) return;
    setGeneratingIDP(true);
    try {
      const comps = data.competencies || [];
      // Sort by gap severity
      const sortedGaps = [...comps].sort((a, b) => (b.maxGap || 0) - (a.maxGap || 0));

      const comp1 = sortedGaps[0] || comps[0];
      const comp2 = sortedGaps[1] || comps[1] || comps[0];

      const batch = [
        {
          priority: 'PRIMARY',
          classification: 'Role Enhancement and Role Enrichment',
          improvementArea: `${comp1.name} (Need Gap: -${comp1.maxGap || 1})`,
          competencyName: comp1.name,
          currentGrade: `Knowledge: ${comp1.currentKnowledge} / Skills: ${comp1.currentSkills}`,
          targetGrade: `Knowledge: ${comp1.targetKnowledge} / Skills: ${comp1.targetSkills}`,
          action: comp1.developmentAction || `Lead cross-functional architecture and sprint delivery for ${data.targetLevel} benchmark.`,
          expectedEvidence: 'Delivered production Architecture Decision Record (ADR) and review approval.',
          mentorOrCoach: 'Technical Architect & Lead Mentor',
          targetDate: 'Next 6 Months',
          checkpoint: 'Quarterly Calibration',
          status: 'IN_PROGRESS'
        },
        {
          priority: 'SECONDARY',
          classification: 'Mentoring',
          improvementArea: `${comp2.name} (Need Gap: -${comp2.maxGap || 1})`,
          competencyName: comp2.name,
          currentGrade: `Knowledge: ${comp2.currentKnowledge} / Skills: ${comp2.currentSkills}`,
          targetGrade: `Knowledge: ${comp2.targetKnowledge} / Skills: ${comp2.targetSkills}`,
          action: comp2.developmentAction || `Formally mentor senior data engineers through cross-functional reviews for ${data.targetLevel} leadership.`,
          expectedEvidence: 'Bi-weekly 1:1 mentorship log and code walkthrough presentations.',
          mentorOrCoach: 'Engineering Manager',
          targetDate: 'Next 9 Months',
          checkpoint: 'Mid-Year Review',
          status: 'PLANNED'
        }
      ];

      const res = await fetch(`/api/employees/${employeeId}/idp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batch)
      });

      if (res.ok) {
        fetchAssessment(employeeId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingIDP(false);
    }
  };

  const handleCreateCustomPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !newAction) return;
    setCreatingPlan(true);
    try {
      const res = await fetch(`/api/employees/${employeeId}/idp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priority: newPriority,
          classification: newClassification,
          improvementArea: newImprovementArea || newCompetency || 'Technical Capability Expansion',
          competencyName: newCompetency || 'Architecture & Delivery',
          action: newAction,
          expectedEvidence: newEvidence || 'Production deliverables and lead code review sign-off',
          targetDate: newTargetDate,
          status: 'IN_PROGRESS'
        })
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        setNewAction('');
        setNewImprovementArea('');
        setNewEvidence('');
        fetchAssessment(employeeId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingPlan(false);
    }
  };

  if (employeeList.length === 0) {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center max-w-2xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center mx-auto">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">No Employees Available for Assessment</h3>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              The employee directory is currently empty (0 records). Add an employee to evaluate individual Knowledge & Skills against progressive career benchmarks and plan IDPs.
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
              💡 Switch to <strong>Employee Master</strong> tab and click <strong>+ Add Employee</strong> or <strong>Upload Excel</strong> to begin.
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  const {
    employee,
    targetLevel = 'L6',
    targetTitle = 'Technical Architect',
    competencies = [],
    developmentPlans = [],
    readinessScore = 0,
    metCompetencies = 0,
    totalCompetencies = 12
  } = data || {};

  // Find Primary and Secondary Action Items
  const primaryPlan = developmentPlans.find((p: any) => p.priority === 'PRIMARY');
  const secondaryPlan = developmentPlans.find((p: any) => p.priority === 'SECONDARY');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Candidate Header & Career Progression Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-sm">
            {employee?.name ? employee.name[0] : 'U'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="text-lg font-extrabold text-slate-900 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
              >
                {employeeList.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.name} ({e.id}) · Level {e.careerLevel}
                  </option>
                ))}
              </select>

              {/* Progressive Career Level Display - Fixes L5 -> L4 Downgrade Bug! */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-slate-700 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg">
                  Current: <strong className="text-slate-900">{employee?.careerLevel || 'N/A'}</strong> ({employee?.jobTitle || 'Role'})
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-xs font-bold text-indigo-700 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg shadow-2xs">
                  New Target Level: <strong className="text-indigo-900">{targetLevel}</strong> ({targetTitle})
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Annual Fixed Comp: <strong>₹{employee?.annualFixedPay || 0} LPA</strong> · Team {employee?.teamId === 'A' ? 'Engineering' : (employee?.teamId === 'B' ? 'Operations' : 'Revenue')} · Evaluated against progressive <strong>{targetLevel}</strong> competency standard
            </p>
          </div>
        </div>

        {/* Readiness Index & Promotion Workflow Action */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-semibold">
              {targetLevel} Competency Readiness
            </span>
            <div className="flex items-center gap-2 justify-end">
              <span className="text-2xl font-black text-sky-700">{readinessScore}%</span>
              <span className="text-xs text-slate-500 font-medium">({metCompetencies}/{totalCompetencies} met)</span>
            </div>
          </div>

          {onOpenPromotionWorkflow && employeeId && (
            <button
              onClick={() => onOpenPromotionWorkflow(employeeId)}
              className="px-4 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Promotion Workflow</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Individual Development Plan (IDP) Section: Primary & Secondary Action Item Boxes */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Individual Development Plan (IDP) — Targeted Action Items
            </h3>
            <p className="text-xs text-slate-500">
              Personalized action items designed to bridge identified competency gaps and prepare {employee?.name} for {targetLevel} progression.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(!primaryPlan || !secondaryPlan) && (
              <button
                type="button"
                onClick={handleAutoGenerateIDP}
                disabled={generatingIDP}
                className="px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Sparkles className={`w-3.5 h-3.5 ${generatingIDP ? 'animate-spin' : ''}`} />
                <span>{generatingIDP ? 'Generating IDP...' : '⚡ Auto-Generate IDP from Gap Analysis'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>+ Add Action Item</span>
            </button>
          </div>
        </div>

        {/* The Two Dedicated Action Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Box 1: Primary Action Item */}
          <div className="p-5 rounded-2xl bg-white border-2 border-indigo-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-indigo-600 text-white flex items-center gap-1 shadow-2xs">
                    ⭐ Primary Action Item
                  </span>
                  {primaryPlan?.classification && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      CLASSIFICATION_COLORS[primaryPlan.classification]?.bg || 'bg-slate-50'
                    } ${CLASSIFICATION_COLORS[primaryPlan.classification]?.text || 'text-slate-700'} ${
                      CLASSIFICATION_COLORS[primaryPlan.classification]?.border || 'border-slate-200'
                    }`}>
                      {primaryPlan.classification}
                    </span>
                  )}
                </div>

                {primaryPlan && (
                  <div className="flex items-center gap-1.5">
                    <select
                      value={primaryPlan.status || 'IN_PROGRESS'}
                      onChange={(e) => handleUpdateStatus(primaryPlan.id, e.target.value)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border focus:outline-none cursor-pointer ${
                        STATUS_CONFIG[primaryPlan.status]?.bg || 'bg-slate-50'
                      } ${STATUS_CONFIG[primaryPlan.status]?.text || 'text-slate-700'} ${
                        STATUS_CONFIG[primaryPlan.status]?.border || 'border-slate-200'
                      }`}
                    >
                      <option value="PLANNED">Planned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ON_HOLD">On Hold</option>
                    </select>
                    <button
                      onClick={() => handleDeletePlan(primaryPlan.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete action item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {primaryPlan ? (
                <div className="space-y-2.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block">Need Gap Area to Improve</span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {primaryPlan.improvementArea || primaryPlan.competencyName}
                    </h4>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Action Deliverable</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
                      {primaryPlan.action}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-400 block text-[10px]">Expected Evidence</span>
                      <span className="text-slate-700">{primaryPlan.expectedEvidence}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400 block text-[10px]">Target Timeline</span>
                      <span className="font-bold text-indigo-800 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-indigo-600" />
                        {primaryPlan.targetDate || 'Next 6 Months'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto">
                    <Target className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700">No Primary Action Item Set</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Click &quot;Auto-Generate IDP&quot; above to populate high-impact development actions based on need gaps.
                  </p>
                  <button
                    type="button"
                    onClick={handleAutoGenerateIDP}
                    className="mt-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold transition-colors"
                  >
                    Generate Primary Action
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Box 2: Secondary Action Item */}
          <div className="p-5 rounded-2xl bg-white border-2 border-teal-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-teal-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-teal-700 text-white flex items-center gap-1 shadow-2xs">
                    🎯 Secondary Action Item
                  </span>
                  {secondaryPlan?.classification && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      CLASSIFICATION_COLORS[secondaryPlan.classification]?.bg || 'bg-slate-50'
                    } ${CLASSIFICATION_COLORS[secondaryPlan.classification]?.text || 'text-slate-700'} ${
                      CLASSIFICATION_COLORS[secondaryPlan.classification]?.border || 'border-slate-200'
                    }`}>
                      {secondaryPlan.classification}
                    </span>
                  )}
                </div>

                {secondaryPlan && (
                  <div className="flex items-center gap-1.5">
                    <select
                      value={secondaryPlan.status || 'PLANNED'}
                      onChange={(e) => handleUpdateStatus(secondaryPlan.id, e.target.value)}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border focus:outline-none cursor-pointer ${
                        STATUS_CONFIG[secondaryPlan.status]?.bg || 'bg-slate-50'
                      } ${STATUS_CONFIG[secondaryPlan.status]?.text || 'text-slate-700'} ${
                        STATUS_CONFIG[secondaryPlan.status]?.border || 'border-slate-200'
                      }`}
                    >
                      <option value="PLANNED">Planned</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ON_HOLD">On Hold</option>
                    </select>
                    <button
                      onClick={() => handleDeletePlan(secondaryPlan.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                      title="Delete action item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {secondaryPlan ? (
                <div className="space-y-2.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">Growth / Role Enrichment Area</span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {secondaryPlan.improvementArea || secondaryPlan.competencyName}
                    </h4>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Action Deliverable</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium bg-teal-50/50 p-2.5 rounded-xl border border-teal-100">
                      {secondaryPlan.action}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-400 block text-[10px]">Expected Evidence</span>
                      <span className="text-slate-700">{secondaryPlan.expectedEvidence}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-400 block text-[10px]">Target Timeline</span>
                      <span className="font-bold text-teal-800 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-teal-600" />
                        {secondaryPlan.targetDate || 'Next 9 Months'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
                    <Target className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-700">No Secondary Action Item Set</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Click &quot;Auto-Generate IDP&quot; above to populate secondary mentoring and role enrichment goals.
                  </p>
                  <button
                    type="button"
                    onClick={handleAutoGenerateIDP}
                    className="mt-1 px-3 py-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-xs font-bold transition-colors"
                  >
                    Generate Secondary Action
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Need Gap Analysis Table: Skills Possessed vs. Skills Required */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600" />
              Need Gap Analysis: Skills Possessed vs. Skills Required ({targetLevel} Benchmark)
            </h3>
            <p className="text-xs text-slate-500">
              Comparing {employee?.name}&apos;s current knowledge &amp; skills grades against target standards for {targetLevel} ({targetTitle}).
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
            Scale: Grade A (Foundational) to Grade E (Expert)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50">
                <th className="py-3 px-4 font-semibold">Competency Area</th>
                <th className="py-3 px-4 font-semibold">Skills Possessed (Current)</th>
                <th className="py-3 px-4 font-semibold text-indigo-800">Skills Should Possess ({targetLevel} Target)</th>
                <th className="py-3 px-4 font-semibold">Need Gap Analysis</th>
                <th className="py-3 px-4 font-semibold">Proposed Action to Close Gap</th>
                <th className="py-3 px-4 font-semibold text-right">Calibrate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {competencies?.map((comp: any) => {
                const isEditing = editingCompId === comp.id;
                const hasKGap = comp.knowledgeGap > 0;
                const hasSGap = comp.skillsGap > 0;

                return (
                  <tr key={comp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{comp.name}</div>
                      <span className="text-[10px] text-slate-500">{comp.category}</span>
                    </td>

                    {/* Skills Possessed (Current) */}
                    <td className="py-3.5 px-4 font-mono">
                      {isEditing ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">K:</span>
                            <select
                              value={editKGrade}
                              onChange={(e) => setEditKGrade(e.target.value)}
                              className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs text-slate-900"
                            >
                              {['A', 'B', 'C', 'D', 'E'].map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400">S:</span>
                            <select
                              value={editSGrade}
                              onChange={(e) => setEditSGrade(e.target.value)}
                              className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs text-slate-900"
                            >
                              {['A', 'B', 'C', 'D', 'E'].map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded font-bold text-xs bg-slate-100 text-slate-700 block w-fit">
                            Knowledge: Grade {comp.currentKnowledge}
                          </span>
                          <span className="px-2 py-0.5 rounded font-bold text-xs bg-slate-100 text-slate-700 block w-fit">
                            Skills: Grade {comp.currentSkills}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Skills Should Possess (Target Required for Next Level) */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 rounded font-bold text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 block w-fit">
                          Knowledge: Grade {comp.targetKnowledge || 'D'}
                        </span>
                        <span className="px-2 py-0.5 rounded font-bold text-xs bg-indigo-50 text-indigo-700 border border-indigo-100 block w-fit">
                          Skills: Grade {comp.targetSkills || 'D'}
                        </span>
                      </div>
                    </td>

                    {/* Need Gap Analysis */}
                    <td className="py-3.5 px-4">
                      {comp.isTargetMet ? (
                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3.5 h-3.5" /> Target Met
                        </span>
                      ) : (
                        <div className="space-y-1">
                          {hasKGap && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 block w-fit">
                              Need Gap (Knowledge): -{comp.knowledgeGap} level
                            </span>
                          )}
                          {hasSGap && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 block w-fit">
                              Need Gap (Skills): -{comp.skillsGap} level
                            </span>
                          )}
                          {!hasKGap && !hasSGap && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-500 block w-fit">
                              Pending Full Assessment
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Proposed Action to Close Gap */}
                    <td className="py-3.5 px-4 max-w-xs text-slate-600 text-[11px] leading-relaxed">
                      {comp.developmentAction}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      {isEditing ? (
                        <button
                          onClick={() => handleSaveGrade(comp)}
                          disabled={saving}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold flex items-center gap-1 ml-auto shadow-sm"
                        >
                          <Save className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingCompId(comp.id);
                            setEditKGrade(comp.currentKnowledge === 'Not Assessed' ? 'C' : comp.currentKnowledge);
                            setEditSGrade(comp.currentSkills === 'Not Assessed' ? 'C' : comp.currentSkills);
                          }}
                          className="p-1 text-slate-400 hover:text-sky-600 transition-colors"
                          title="Calibrate Knowledge & Skills"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Custom IDP Action Item */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Add Targeted IDP Action Item
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomPlan} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Priority Assignment</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPriority('PRIMARY')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                      newPriority === 'PRIMARY'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ⭐ Primary Action Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPriority('SECONDARY')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${
                      newPriority === 'SECONDARY'
                        ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🎯 Secondary Action Item
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Development Classification</label>
                <select
                  value={newClassification}
                  onChange={(e) => setNewClassification(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 font-semibold text-slate-800"
                >
                  <option value="Role Enhancement and Role Enrichment">Role Enhancement and Role Enrichment</option>
                  <option value="Learning and Development">Learning and Development</option>
                  <option value="Mentoring">Mentoring</option>
                  <option value="Coaching">Coaching</option>
                  <option value="Career Growth">Career Growth</option>
                  <option value="Rewards">Rewards</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Improvement / Need Gap Area</label>
                <input
                  type="text"
                  value={newImprovementArea}
                  onChange={(e) => setNewImprovementArea(e.target.value)}
                  placeholder="e.g. Data Architecture & System Design (Need Gap: -1)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Deliverable Action Item</label>
                <textarea
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="Specific, measurable action to close competency gap..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800 h-20"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Evidence</label>
                <input
                  type="text"
                  value={newEvidence}
                  onChange={(e) => setNewEvidence(e.target.value)}
                  placeholder="e.g. Architecture Decision Record (ADR), PR approval"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Completion Timeline</label>
                <input
                  type="text"
                  value={newTargetDate}
                  onChange={(e) => setNewTargetDate(e.target.value)}
                  placeholder="e.g. Next 6 Months"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPlan}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                >
                  {creatingPlan ? 'Saving...' : 'Save IDP Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
