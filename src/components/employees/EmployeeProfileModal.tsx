'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Award,
  DollarSign,
  TrendingUp,
  History,
  Star,
  Shield,
  ArrowUpRight,
  BookOpen,
  Target,
  Compass,
  CheckCircle2,
  Plus,
  Sparkles,
  GraduationCap,
  Users,
  Trophy,
  Zap,
  Filter,
  Trash2,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface EmployeeProfileModalProps {
  employeeId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPromotionModal?: (employeeId: string) => void;
  onEmployeeUpdated?: () => void;
}

export default function EmployeeProfileModal({
  employeeId,
  isOpen,
  onClose,
  onOpenPromotionModal,
  onEmployeeUpdated
}: EmployeeProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'performance' | 'compensation' | 'career' | 'history'>('personal');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Enhanced IDP Form & Filter State
  const [showIdpForm, setShowIdpForm] = useState(false);
  const [idpPriority, setIdpPriority] = useState<'PRIMARY' | 'SECONDARY'>('PRIMARY');
  const [idpClassification, setIdpClassification] = useState<string>('Role Enhancement and Role Enrichment');
  const [idpImprovementArea, setIdpImprovementArea] = useState('');
  const [idpAction, setIdpAction] = useState('');
  const [idpEvidence, setIdpEvidence] = useState('');
  const [idpTargetDate, setIdpTargetDate] = useState('Next 6 Months');
  const [idpMentor, setIdpMentor] = useState('');
  const [idpStatus, setIdpStatus] = useState<'PLANNED' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'ON_HOLD'>('IN_PROGRESS');
  const [savingIdp, setSavingIdp] = useState(false);

  // IDP Filter States
  const [filterPriority, setFilterPriority] = useState<'ALL' | 'PRIMARY' | 'SECONDARY'>('ALL');
  const [filterClassification, setFilterClassification] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const fetchProfile = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/employees/${employeeId}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchProfile();
    }
  }, [isOpen, employeeId]);

  const handleToggleTopTalent = async () => {
    if (!data?.employee) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topTalent: !data.employee.topTalent })
      });
      const json = await res.json();
      if (json.success) {
        setData((prev: any) => ({
          ...prev,
          employee: { ...prev.employee, topTalent: json.employee.topTalent }
        }));
        onEmployeeUpdated?.();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleCreateIdpItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idpAction || !idpImprovementArea) return;
    setSavingIdp(true);
    try {
      const res = await fetch(`/api/employees/${employeeId}/idp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priority: idpPriority,
          classification: idpClassification,
          improvementArea: idpImprovementArea,
          competencyName: idpImprovementArea,
          currentGrade: 'Proficient',
          targetGrade: 'Advanced',
          action: idpAction,
          expectedEvidence: idpEvidence || 'Demonstrated in production deliverables & quarterly reviews',
          mentorOrCoach: idpMentor || data?.coachName || data?.managerName || 'Executive Sponsor',
          targetDate: idpTargetDate,
          checkpoint: 'Quarterly Calibration Milestone',
          status: idpStatus
        })
      });
      const json = await res.json();
      if (json.success) {
        setShowIdpForm(false);
        setIdpAction('');
        setIdpImprovementArea('');
        setIdpEvidence('');
        await fetchProfile();
        onEmployeeUpdated?.();
      }
    } catch (err) {
      console.error('Failed to save IDP:', err);
    } finally {
      setSavingIdp(false);
    }
  };

  const handleUpdateStatus = async (planId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/employees/${employeeId}/idp`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, status: newStatus })
      });
      const json = await res.json();
      if (json.success) {
        await fetchProfile();
        onEmployeeUpdated?.();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteIdp = async (planId: string) => {
    try {
      const res = await fetch(`/api/employees/${employeeId}/idp?planId=${planId}`, {
        method: 'DELETE'
      });
      const json = await res.json();
      if (json.success) {
        await fetchProfile();
        onEmployeeUpdated?.();
      }
    } catch (err) {
      console.error('Failed to delete IDP item:', err);
    }
  };

  const handleLoadBlueprint = async () => {
    if (!employeeId || !data?.employee) return;
    setSavingIdp(true);
    try {
      const isSenior = ['L4', 'L5', 'L6', 'L7', 'L8'].includes(data.employee.careerLevel);
      const blueprintItems = [
        {
          priority: 'PRIMARY',
          classification: 'Role Enhancement and Role Enrichment',
          improvementArea: isSenior 
            ? 'Cross-Squad Data Platform Governance & SLA Resilience' 
            : 'Distributed Stream Processing & Real-Time Pipeline Ownership',
          competencyName: isSenior ? 'Platform Governance & Reliability' : 'Stream Processing (Kafka & Flink)',
          action: isSenior
            ? 'Lead end-to-end multi-squad architectural delivery, SLA calibration, and automated disaster recovery across core pipelines.'
            : 'Assume primary ownership of real-time Kafka-Flink streaming pipeline migration, achieving sub-second latency and zero data loss.',
          expectedEvidence: 'Zero SLA breaches in quarterly audit; approved architectural RFC by Technical SteerCo.',
          mentorOrCoach: data.managerName || 'Engineering Lead',
          targetDate: 'Next 6 Months',
          status: 'IN_PROGRESS'
        },
        {
          priority: 'PRIMARY',
          classification: 'Learning and Development',
          improvementArea: isSenior
            ? 'Enterprise Big Data Cloud Architecture & FinOps Optimization'
            : 'Advanced Query Performance Tuning & Automated Testing',
          competencyName: isSenior ? 'Cloud FinOps & Distributed Query Engines' : 'Data Modeling & Query Optimization',
          action: isSenior
            ? 'Complete Cloud Enterprise Architecture & Cost Governance certification; drive 20% cloud compute optimization across clusters.'
            : 'Complete advanced Distributed Computing & DBT certification; implement automated regression test suite.',
          expectedEvidence: 'Certification credentials validated; cost reduction / regression test suite deployed to production.',
          mentorOrCoach: data.coachName || 'Development Coach',
          targetDate: 'Q3 2026',
          status: 'PLANNED'
        },
        {
          priority: 'PRIMARY',
          classification: 'Mentoring',
          improvementArea: isSenior
            ? 'Senior Engineering Succession & Technical Guild Leadership'
            : 'Peer Code Governance & Knowledge Repository Contribution',
          competencyName: 'Talent Development & Mentorship',
          action: isSenior
            ? 'Mentor 2 high-potential engineers on system architecture; conduct bi-weekly technical design reviews and succession shadowing.'
            : 'Act as technical onboarding buddy for 2 new joiners; author 3 comprehensive runbooks in central knowledge repo.',
          expectedEvidence: 'Positive mentee calibration feedback; runbooks published and utilized across squad.',
          mentorOrCoach: data.coachName || 'Leadership Team',
          targetDate: 'Ongoing',
          status: 'IN_PROGRESS'
        },
        {
          priority: 'SECONDARY',
          classification: 'Coaching',
          improvementArea: 'Cross-Functional Executive Communication & Conflict Resolution',
          competencyName: 'Stakeholder Management & Executive Presence',
          action: `Bi-weekly strategic 1:1 coaching sessions with Coach ${data.coachName || 'Executive Sponsor'} on executive presence and translating technical trade-offs into business value.`,
          expectedEvidence: 'Successful stakeholder presentation to CXO / Business Unit SteerCo with positive alignment.',
          mentorOrCoach: data.coachName || 'Executive Sponsor',
          targetDate: 'Next 3 Months',
          status: 'IN_PROGRESS'
        },
        {
          priority: 'SECONDARY',
          classification: 'Career Growth',
          improvementArea: 'Next-Level Promotion Calibration & Capability Portfolio',
          competencyName: 'Career Growth & Scope Expansion',
          action: 'Establish calibrated readiness portfolio against next level rubric expectations for upcoming appraisal review.',
          expectedEvidence: 'Completion of 360 multi-rater feedback and formal promotion committee submission.',
          mentorOrCoach: data.managerName || 'Reporting Manager',
          targetDate: 'Next Appraisal Cycle',
          status: 'PLANNED'
        },
        {
          priority: 'SECONDARY',
          classification: 'Rewards',
          improvementArea: 'Strategic Business Impact & Milestone Recognition',
          competencyName: 'Enterprise Delivery Impact',
          action: 'Deliver key platform milestone on schedule to qualify for departmental spot award and merit compensation review.',
          expectedEvidence: 'Milestone sign-off by Product VP; formal appraisal merit recommendation.',
          mentorOrCoach: data.managerName || 'Reporting Manager',
          targetDate: 'Fiscal Year End',
          status: 'PLANNED'
        }
      ];

      const res = await fetch(`/api/employees/${employeeId}/idp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blueprintItems)
      });
      const json = await res.json();
      if (json.success) {
        await fetchProfile();
        onEmployeeUpdated?.();
      }
    } catch (err) {
      console.error('Failed to load blueprint:', err);
    } finally {
      setSavingIdp(false);
    }
  };

  if (!isOpen || !employeeId) return null;

  const emp = data?.employee;
  const competenceScore = emp?.competence || emp?.potential || 3;
  const ratingScore = emp?.currentRating || 3;
  const isHipo = (ratingScore >= 4) && (competenceScore >= 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top High Potential Banner */}
        {isHipo && (
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-6 py-2.5 text-amber-950 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-base">⭐</span>
              <div>
                <span className="font-extrabold text-xs uppercase tracking-wider">High Potential (HIPO) Talent Profile</span>
                <span className="text-[11px] font-medium opacity-90 ml-2 hidden sm:inline">
                  Calibrated High Performance ({ratingScore}/5) & High Competence ({competenceScore}/5). Enrolled in Accelerated IDP.
                </span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-100 uppercase tracking-wider shadow-xs">
              Tier 1 Succession Pipeline
            </span>
          </div>
        )}

        {/* Profile Header Banner */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-md">
              {emp ? emp.name.split(' ').map((n: string) => n[0]).join('') : '...'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-slate-900">{emp?.name || 'Loading Employee...'}</h2>
                <span className="font-mono text-xs font-bold text-sky-700 px-2 py-0.5 bg-sky-50 border border-sky-200 rounded">
                  {emp?.id}
                </span>
                <span className="font-mono text-xs font-bold text-slate-700 px-2 py-0.5 bg-slate-200 rounded">
                  {emp?.careerLevel}
                </span>
                {isHipo && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-xs">
                    ⭐ HIPO
                  </span>
                )}
                {emp?.topTalent && !isHipo && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500" /> Top Talent
                  </span>
                )}
                {emp?.criticalRole && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-sky-600" /> Critical Role
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {emp?.jobTitle} · Team {emp?.teamId} ({emp?.department}) · Gender: <strong>{emp?.gender}</strong> · {emp?.location} ({emp?.workMode})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleTopTalent}
              disabled={updating}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                emp?.topTalent
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${emp?.topTalent ? 'fill-amber-500' : ''}`} />
              <span>{emp?.topTalent ? 'Top Talent' : 'Mark Top Talent'}</span>
            </button>

            {onOpenPromotionModal && (
              <button
                onClick={() => onOpenPromotionModal(emp.id)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Promotion Review</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 5 Tabs Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('personal')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'personal'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>1. Personal & Org</span>
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'performance'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. Performance & Competence</span>
          </button>
          <button
            onClick={() => setActiveTab('compensation')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'compensation'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>3. Compensation & Rewards</span>
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'career'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>4. Career & 70-20-10 IDP</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'history'
                ? 'border-sky-600 text-sky-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-4 h-4" />
            <span>5. History Timeline</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
              Loading profile details...
            </div>
          ) : !emp ? (
            <div className="text-center py-12 text-slate-500">Employee profile not found.</div>
          ) : (
            <>
              {/* Tab 1: Personal & Org */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">Corporate Email</span>
                      <span className="text-slate-900 font-medium mt-1 block truncate">{emp.corporateEmail || 'N/A'}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">Gender (Female vs Male)</span>
                      <span className="text-slate-900 font-bold mt-1 block">{emp.gender}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">Date of Joining</span>
                      <span className="text-slate-900 font-medium mt-1 block">{emp.dateOfJoining} ({emp.tenure} yrs tenure)</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">Employment Status</span>
                      <span className="text-emerald-600 font-bold mt-1 block">{emp.status}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="font-bold text-slate-900 text-sm">Leadership & Reporting Hierarchy</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 text-[11px]">Reporting Manager (Operational Accountability)</span>
                        <div className="text-slate-900 font-bold text-sm mt-1">{data.managerName}</div>
                        <span className="font-mono text-[10px] text-sky-700">{emp.reportingManagerId || 'None'}</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 text-[11px]">Development Coach (Career Growth & IDP Sponsor)</span>
                        <div className="text-slate-900 font-bold text-sm mt-1">{data.coachName}</div>
                        <span className="font-mono text-[10px] text-indigo-700">{emp.coachId || 'None'}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">
                      * Manager and Coach are independently configured entities, decoupling operational performance governance from developmental mentorship.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Performance & Competence */}
              {activeTab === 'performance' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">Performance Rating (Scale 1–5)</span>
                      <span className="text-2xl font-black text-sky-700 mt-1 block">
                        {emp.currentRating ? `${emp.currentRating} / 5` : 'Not Rated'}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {ratingScore >= 4 ? 'High Performance' : (ratingScore === 3 ? 'Meets Expectations' : 'Needs Improvement')}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">Competence Score (Scale 1–5)</span>
                      <span className="text-2xl font-black text-amber-700 mt-1 block">
                        {competenceScore} / 5
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {competenceScore === 5 ? 'Mastery (Level 5)' : (competenceScore === 4 ? 'Advanced (Level 4)' : (competenceScore === 3 ? 'Proficient (Level 3)' : 'Foundational (Level 1-2)'))}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">Flight Risk Assessment</span>
                      <span className={`text-2xl font-black mt-1 block ${emp.flightRisk === 'High' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {emp.flightRisk}
                      </span>
                      <span className="text-[10px] text-slate-500 mt-1 block">Retention Priority: High</span>
                    </div>
                  </div>

                  {/* 9-Box Placement Diagnostic Card */}
                  <div className="p-5 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-600" />
                        9-Box Talent Matrix Placement Diagnostic
                      </h4>
                      {isHipo ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          ⭐ Star / High Potential (HIPO)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          Standard Calibration
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-lg bg-white border border-slate-200">
                        <div className="font-bold text-slate-700 mb-1">HIPO Qualification Criteria</div>
                        <ul className="space-y-1 text-slate-600 text-[11px]">
                          <li className="flex items-center gap-1.5">
                            <span className={ratingScore >= 4 ? "text-emerald-600 font-bold" : "text-slate-400"}>
                              {ratingScore >= 4 ? '✓' : '○'} Performance Rating ≥ 4/5 (Current: {ratingScore})
                            </span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <span className={competenceScore >= 4 ? "text-emerald-600 font-bold" : "text-slate-400"}>
                              {competenceScore >= 4 ? '✓' : '○'} Competence Score ≥ 4/5 (Current: {competenceScore})
                            </span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-lg bg-white border border-slate-200">
                        <div className="font-bold text-slate-700 mb-1">Talent Action & Strategy</div>
                        <p className="text-[11px] text-slate-600">
                          {isHipo
                            ? 'Enrolled in Tier 1 Accelerated IDP, assigned an Executive Mentor, targeted for fast-track progression (6–12 months to next career band).'
                            : 'Focus on competency progression through targeted assignments and 70-20-10 learning interventions.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Compensation & Rewards */}
              {activeTab === 'compensation' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">Annual Fixed Compensation</span>
                      <span className="text-2xl font-black text-slate-900 mt-1 block">
                        ₹{emp.annualFixedPay.toFixed(2)} LPA
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">Compa-Ratio</span>
                      <span className="text-2xl font-black text-emerald-600 mt-1 block">
                        {emp.compaRatio.toFixed(3)}
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 text-[11px] block">Applicable Band Range</span>
                      <span className="text-sm font-mono font-bold text-sky-700 mt-2 block">
                        ₹{data?.payBand?.min}L – ₹{data?.payBand?.midpoint}L – ₹{data?.payBand?.max}L
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Career & 70-20-10 IDP Plan Studio */}
              {activeTab === 'career' && (
                <div className="space-y-6">
                  {/* Current Stage Banner */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-500 text-[11px]">Current Career Stage & Dual-Track Alignment</span>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">{emp.careerLevel} · {emp.jobTitle}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Track: <strong>{emp.careerTrack === 'MGT' ? 'Management Track' : 'Individual Contributor (IC) Track'}</strong>
                      </p>
                    </div>
                    {onOpenPromotionModal && (
                      <button
                        onClick={() => onOpenPromotionModal(emp.id)}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Launch Promotion Assessment</span>
                      </button>
                    )}
                  </div>

                  {/* Enhanced IDP Studio: Primary & Secondary Framework */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-5">
                    {/* Header with Title & Add/Blueprint Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black uppercase tracking-wider mb-1">
                          <Compass className="w-3 h-3" />
                          Individual Development Plan (IDP) Architecture
                        </div>
                        <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                          Capability Gap Remediation & Role Enrichment Studio
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Tracking targeted improvement areas across <strong>Primary & Secondary</strong> priorities and 6 strategic HR classifications.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {(!emp.developmentPlans || emp.developmentPlans.length === 0) && (
                          <button
                            onClick={handleLoadBlueprint}
                            disabled={savingIdp}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                            title="Pre-populate 6 curated primary & secondary action items"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{savingIdp ? 'Initializing...' : 'Load Curated Blueprint'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => setShowIdpForm(!showIdpForm)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{showIdpForm ? 'Close Form' : 'Add Action Item'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Classification Guide Banner */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
                      {[
                        { name: 'Learning & Development', icon: GraduationCap, color: 'bg-purple-50 text-purple-800 border-purple-200', desc: 'Certifications & academies' },
                        { name: 'Coaching', icon: Target, color: 'bg-sky-50 text-sky-800 border-sky-200', desc: '1:1 behavioral sprints' },
                        { name: 'Mentoring', icon: Users, color: 'bg-indigo-50 text-indigo-800 border-indigo-200', desc: 'Executive sponsor guidance' },
                        { name: 'Rewards', icon: Trophy, color: 'bg-amber-50 text-amber-800 border-amber-200', desc: 'Recognition & incentives' },
                        { name: 'Career Growth', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-800 border-emerald-200', desc: 'Succession & readiness' },
                        { name: 'Role Enrichment', icon: Zap, color: 'bg-teal-50 text-teal-800 border-teal-200', desc: 'Stretch pod leadership' }
                      ].map((c, i) => (
                        <div key={i} className={`p-2 rounded-xl border ${c.color} flex flex-col justify-between`}>
                          <div className="flex items-center gap-1.5 font-bold mb-0.5">
                            <c.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{c.name}</span>
                          </div>
                          <span className="text-[10px] opacity-75 truncate">{c.desc}</span>
                        </div>
                      ))}
                    </div>

                    {/* Add IDP Form (if toggled) */}
                    {showIdpForm && (
                      <form onSubmit={handleCreateIdpItem} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="font-black text-slate-900 text-xs flex items-center gap-2">
                            <Plus className="w-4 h-4 text-indigo-600" />
                            Log New Action Item
                          </span>
                          <span className="text-[11px] text-slate-500">All fields required for audit tracking</span>
                        </div>

                        {/* Priority & Classification Selection */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] text-slate-600 font-bold uppercase tracking-wider block mb-1">
                              Action Priority *
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={() => setIdpPriority('PRIMARY')}
                                className={`py-2 px-3 rounded-xl text-xs font-black border transition-all text-center ${
                                  idpPriority === 'PRIMARY'
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                ⭐ Primary (Critical)
                              </button>
                              <button
                                type="button"
                                onClick={() => setIdpPriority('SECONDARY')}
                                className={`py-2 px-3 rounded-xl text-xs font-black border transition-all text-center ${
                                  idpPriority === 'SECONDARY'
                                    ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                🌱 Secondary (Enrichment)
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-600 font-bold uppercase tracking-wider block mb-1">
                              HR Classification *
                            </label>
                            <select
                              value={idpClassification}
                              onChange={(e) => setIdpClassification(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                            >
                              <option value="Learning and Development">📚 Learning and Development</option>
                              <option value="Coaching">🎯 Coaching</option>
                              <option value="Mentoring">🤝 Mentoring</option>
                              <option value="Rewards">🏆 Rewards</option>
                              <option value="Career Growth">🚀 Career Growth</option>
                              <option value="Role Enhancement and Role Enrichment">⚡ Role Enhancement and Role Enrichment</option>
                            </select>
                          </div>
                        </div>

                        {/* Where Employee Has to Improve */}
                        <div>
                          <label className="text-[10px] text-slate-700 font-black uppercase tracking-wider block mb-1">
                            🎯 Where the Employee Has to Improve (Capability Gap) *
                          </label>
                          <input
                            type="text"
                            required
                            value={idpImprovementArea}
                            onChange={(e) => setIdpImprovementArea(e.target.value)}
                            placeholder="e.g. Distributed Stream Processing (Kafka & Flink), Cross-Functional Executive Communication"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        {/* Concrete Action & Deliverable */}
                        <div>
                          <label className="text-[10px] text-slate-700 font-black uppercase tracking-wider block mb-1">
                            📋 Concrete Action Item & Deliverable *
                          </label>
                          <input
                            type="text"
                            required
                            value={idpAction}
                            onChange={(e) => setIdpAction(e.target.value)}
                            placeholder="e.g. Lead the migration of real-time pipeline clusters to event-driven Kafka architecture"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-medium focus:border-indigo-500 focus:outline-none"
                          />
                        </div>

                        {/* Evidence, Target Date, Sponsor, Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          <div>
                            <label className="text-[10px] text-slate-600 font-bold block mb-1">Success Evidence</label>
                            <input
                              type="text"
                              value={idpEvidence}
                              onChange={(e) => setIdpEvidence(e.target.value)}
                              placeholder="e.g. Approved RFC, sub-second latency"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-600 font-bold block mb-1">Target Date</label>
                            <input
                              type="text"
                              value={idpTargetDate}
                              onChange={(e) => setIdpTargetDate(e.target.value)}
                              placeholder="e.g. Q4 2026, Next 6 Months"
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-600 font-bold block mb-1">Assigned Sponsor / Coach</label>
                            <input
                              type="text"
                              value={idpMentor}
                              onChange={(e) => setIdpMentor(e.target.value)}
                              placeholder={data?.coachName || data?.managerName || 'Executive Sponsor'}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-slate-600 font-bold block mb-1">Initial Status</label>
                            <select
                              value={idpStatus}
                              onChange={(e: any) => setIdpStatus(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                            >
                              <option value="PLANNED">Planned / Not Started</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="UNDER_REVIEW">Under Review</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="ON_HOLD">On Hold</option>
                            </select>
                          </div>
                        </div>

                        {/* Form Buttons */}
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => setShowIdpForm(false)}
                            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={savingIdp}
                            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-sm"
                          >
                            {savingIdp ? 'Saving...' : 'Save Action Item'}
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Filter & Search Bar */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      {/* Priority Filters */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-1">Priority:</span>
                        <button
                          onClick={() => setFilterPriority('ALL')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            filterPriority === 'ALL'
                              ? 'bg-slate-900 text-white'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          All ({emp.developmentPlans?.length || 0})
                        </button>
                        <button
                          onClick={() => setFilterPriority('PRIMARY')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            filterPriority === 'PRIMARY'
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50'
                          }`}
                        >
                          ⭐ Primary ({emp.developmentPlans?.filter((p: any) => p.priority === 'PRIMARY').length || 0})
                        </button>
                        <button
                          onClick={() => setFilterPriority('SECONDARY')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            filterPriority === 'SECONDARY'
                              ? 'bg-teal-600 text-white'
                              : 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50'
                          }`}
                        >
                          🌱 Secondary ({emp.developmentPlans?.filter((p: any) => p.priority === 'SECONDARY').length || 0})
                        </button>
                      </div>

                      {/* Classification & Status Filter Dropdowns */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Filter className="w-3 h-3 text-slate-400" />
                          <select
                            value={filterClassification}
                            onChange={(e) => setFilterClassification(e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
                          >
                            <option value="ALL">All Classifications</option>
                            <option value="Learning and Development">Learning & Development</option>
                            <option value="Coaching">Coaching</option>
                            <option value="Mentoring">Mentoring</option>
                            <option value="Rewards">Rewards</option>
                            <option value="Career Growth">Career Growth</option>
                            <option value="Role Enhancement and Role Enrichment">Role Enhancement & Enrichment</option>
                          </select>
                        </div>

                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700"
                        >
                          <option value="ALL">All Statuses</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="PLANNED">Planned</option>
                          <option value="UNDER_REVIEW">Under Review</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="ON_HOLD">On Hold</option>
                        </select>
                      </div>
                    </div>

                    {/* Action Items Cards List */}
                    <div className="space-y-3">
                      {(() => {
                        const rawPlans = emp.developmentPlans || [];
                        const filtered = rawPlans.filter((p: any) => {
                          if (filterPriority !== 'ALL' && p.priority !== filterPriority) return false;
                          if (filterClassification !== 'ALL' && p.classification !== filterClassification) return false;
                          if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
                          return true;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="p-8 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300 space-y-3">
                              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mx-auto">
                                <Compass className="w-5 h-5" />
                              </div>
                              <div>
                                <h5 className="font-bold text-slate-800 text-xs">No matching IDP action items found</h5>
                                <p className="text-[11px] text-slate-500 max-w-md mx-auto mt-0.5">
                                  {rawPlans.length === 0 
                                    ? 'No development milestones logged yet. Click "Load Curated Blueprint" to establish standard primary and secondary items, or click "Add Action Item" to create one.'
                                    : 'No items match your active priority, classification, or status filters.'}
                                </p>
                              </div>
                              {rawPlans.length === 0 && (
                                <button
                                  onClick={handleLoadBlueprint}
                                  disabled={savingIdp}
                                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black inline-flex items-center gap-1.5 shadow-sm transition-all"
                                >
                                  <Sparkles className="w-4 h-4" />
                                  <span>{savingIdp ? 'Loading Blueprint...' : 'Load Curated Primary & Secondary Blueprint'}</span>
                                </button>
                              )}
                            </div>
                          );
                        }

                        return filtered.map((plan: any) => {
                          const isPrimary = plan.priority === 'PRIMARY';
                          const classBadge = (() => {
                            switch (plan.classification) {
                              case 'Learning and Development':
                                return { bg: 'bg-purple-50 text-purple-800 border-purple-200', icon: GraduationCap, label: 'Learning & Development' };
                              case 'Coaching':
                                return { bg: 'bg-sky-50 text-sky-800 border-sky-200', icon: Target, label: 'Coaching' };
                              case 'Mentoring':
                                return { bg: 'bg-indigo-50 text-indigo-800 border-indigo-200', icon: Users, label: 'Mentoring' };
                              case 'Rewards':
                                return { bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: Trophy, label: 'Rewards' };
                              case 'Career Growth':
                                return { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: TrendingUp, label: 'Career Growth' };
                              case 'Role Enhancement and Role Enrichment':
                              default:
                                return { bg: 'bg-teal-50 text-teal-800 border-teal-200', icon: Zap, label: 'Role Enhancement & Enrichment' };
                            }
                          })();

                          return (
                            <div
                              key={plan.id}
                              className={`p-4 rounded-2xl border transition-all ${
                                isPrimary
                                  ? 'bg-white border-indigo-200 shadow-sm hover:shadow'
                                  : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                              }`}
                            >
                              {/* Top Bar: Priority, Classification, Status Dropdown, Delete */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Priority Pill */}
                                  <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                                      isPrimary
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-teal-700 text-white shadow-xs'
                                    }`}
                                  >
                                    {isPrimary ? '⭐ Primary Priority' : '🌱 Secondary Priority'}
                                  </span>

                                  {/* Classification Pill */}
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${classBadge.bg}`}>
                                    <classBadge.icon className="w-3 h-3" />
                                    <span>{classBadge.label}</span>
                                  </span>
                                </div>

                                {/* Status Selector & Actions */}
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Status:</span>
                                    <select
                                      value={plan.status}
                                      onChange={(e) => handleUpdateStatus(plan.id, e.target.value)}
                                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                                        plan.status === 'COMPLETED'
                                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                          : (plan.status === 'IN_PROGRESS'
                                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                                            : (plan.status === 'UNDER_REVIEW'
                                              ? 'bg-indigo-50 text-indigo-800 border-indigo-300'
                                              : (plan.status === 'ON_HOLD'
                                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                                : 'bg-slate-100 text-slate-700 border-slate-300')))
                                      }`}
                                    >
                                      <option value="PLANNED">Planned</option>
                                      <option value="IN_PROGRESS">In Progress</option>
                                      <option value="UNDER_REVIEW">Under Review</option>
                                      <option value="COMPLETED">✓ Completed</option>
                                      <option value="ON_HOLD">On Hold</option>
                                    </select>
                                  </div>

                                  <button
                                    onClick={() => handleDeleteIdp(plan.id)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                                    title="Delete action item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Card Body: Where to Improve & Concrete Action */}
                              <div className="pt-3 space-y-2">
                                {/* Where Employee Has to Improve */}
                                <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                                  <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs mb-0.5">
                                    <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                    <span>Where Employee Has to Improve:</span>
                                  </div>
                                  <p className="text-xs text-amber-950 font-semibold pl-5">
                                    {plan.improvementArea || plan.competencyName}
                                  </p>
                                </div>

                                {/* Concrete Action Item & Deliverable */}
                                <div className="pl-1 space-y-1">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                                    📋 Action Item & Expected Deliverable:
                                  </span>
                                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                                    {plan.action}
                                  </p>
                                </div>

                                {/* Evidence Requirement */}
                                {plan.expectedEvidence && (
                                  <div className="pl-1 pt-0.5 flex items-start gap-1.5 text-[11px] text-slate-500">
                                    <span className="font-bold text-slate-700 shrink-0">🔍 Success Evidence:</span>
                                    <span>{plan.expectedEvidence}</span>
                                  </div>
                                )}
                              </div>

                              {/* Card Footer: Metadata */}
                              <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                                <div className="flex items-center gap-3">
                                  <span>
                                    Sponsor / Coach: <strong className="text-slate-700 font-semibold">{plan.mentorOrCoach || data.coachName || 'Executive Sponsor'}</strong>
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span>Target: <strong className="text-slate-700 font-semibold">{plan.targetDate}</strong></span>
                                  <span className="text-slate-300">|</span>
                                  <span className="font-mono text-slate-400">ID: {plan.id.slice(-6)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: History Timeline */}
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 text-sm mb-2">Authoritative Transaction History</h4>
                  {emp.lifecycleEvents?.length ? (
                    <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {emp.lifecycleEvents.map((evt: any) => (
                        <div key={evt.id} className="flex items-start gap-4 relative pl-8">
                          <div className="w-3 h-3 rounded-full bg-sky-600 absolute left-1.5 top-1.5 border-2 border-white"></div>
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                              <span className="font-bold text-sky-700 uppercase">{evt.eventType}</span>
                              <span>{evt.effectiveDate}</span>
                            </div>
                            <p className="text-slate-800 text-xs font-medium">{evt.summary}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-400 italic">No lifecycle events recorded yet.</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
