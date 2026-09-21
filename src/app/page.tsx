'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  Building2,
  TrendingUp,
  Award,
  FileSpreadsheet,
  UserPlus,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

import WorkforceIntelligence from '@/components/dashboard/WorkforceIntelligence';
import AppraisalCaseStudy from '@/components/dashboard/AppraisalCaseStudy';
import EmployeeDirectory from '@/components/employees/EmployeeDirectory';
import EmployeeFormModal from '@/components/employees/EmployeeFormModal';
import EmployeeProfileModal from '@/components/employees/EmployeeProfileModal';
import ExcelUploadModal from '@/components/employees/ExcelUploadModal';
import OrgManager from '@/components/organization/OrgManager';
import CareerArchitecture from '@/components/career/CareerArchitecture';
import CompetencyMatrix from '@/components/career/CompetencyMatrix';
import IndividualCompetencyAssessment from '@/components/career/IndividualCompetencyAssessment';
import PromotionWorkflowModal from '@/components/career/PromotionWorkflowModal';
import ReportingCentre from '@/components/reports/ReportingCentre';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('workforce');
  const [scope, setScope] = useState<string>('all');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Workforce API Data
  const [workforceData, setWorkforceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [promotionCandidateId, setPromotionCandidateId] = useState<string | null>(null);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [directoryNineBoxFilter, setDirectoryNineBoxFilter] = useState<string | null>(null);

  const fetchWorkforceData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/workforce?scope=${scope}&mode=current`);
      const json = await res.json();
      if (json.success) {
        setWorkforceData(json);
      }
    } catch (err) {
      console.error('Failed to fetch workforce data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkforceData();
  }, [scope, refreshTrigger]);

  const handleClearAllData = async () => {
    if (!confirm('Are you sure you want to reset all employee data to zero? You will be able to add your own data fresh.')) {
      return;
    }

    setClearing(true);
    try {
      const res = await fetch('/api/demo/clear', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClearing(false);
    }
  };

  const totalHeadcount = workforceData?.totalCount || 0;

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col font-sans">
      {/* Top Leadership Navigation Bar - Clean White Executive Theme */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-md shadow-sky-600/20">
            WI
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-black text-slate-900 tracking-tight">Workforce Intelligence & HR Architecture</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                LIVE DATA
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                HEADCOUNT: {totalHeadcount}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Senior HR Business Partner Decision Platform · Single Source of Truth
            </p>
          </div>
        </div>

        {/* Global Controls: Scope Filter, Clear Button & Add Employee */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Scope Filter */}
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-500 shadow-sm"
          >
            <option value="all">Entire Business Unit ({totalHeadcount})</option>
            <option value="A">Engineering · Team A ({workforceData?.teamCounts?.A || 0})</option>
            <option value="B">Operations · Team B ({workforceData?.teamCounts?.B || 0})</option>
            <option value="C">Revenue · Team C ({workforceData?.teamCounts?.C || 0})</option>
          </select>

          {/* Upload Excel Button */}
          <button
            onClick={() => setIsExcelModalOpen(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Upload Excel</span>
          </button>

          {/* Add Employee Primary Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </button>

          {/* Clear / Reset to Zero button */}
          {totalHeadcount > 0 && (
            <button
              onClick={handleClearAllData}
              disabled={clearing}
              className="px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Reset all employee records to zero"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${clearing ? 'animate-spin' : ''}`} />
              <span>{clearing ? 'Clearing...' : 'Clear All (0)'}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* If headcount is 0, show a helpful getting-started banner */}
        {totalHeadcount === 0 && !loading && (
          <div className="p-6 rounded-2xl bg-white border border-sky-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Database Initialized — Ready for Your Data</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  All dummy records have been removed. Upload an Excel roster to batch import your workforce, or click <strong>&quot;Add Employee&quot;</strong> to add one manually. All workforce dashboards, compa-ratios, and demographics calculate live.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsExcelModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Upload Excel Roster</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Employee</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Functional Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-semibold overflow-x-auto gap-2 bg-white/60 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('workforce')}
            className={`py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'workforce'
                ? 'bg-white text-sky-700 font-bold shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-sky-600" />
            <span>Workforce Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab('employees')}
            className={`py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'employees'
                ? 'bg-white text-sky-700 font-bold shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-600" />
            <span>Employee Master & Directory ({totalHeadcount})</span>
          </button>

          <button
            onClick={() => setActiveTab('competency-matrix')}
            className={`py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'competency-matrix'
                ? 'bg-white text-sky-700 font-bold shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Award className="w-4 h-4 text-amber-600" />
            <span>Competency Framework</span>
          </button>

          <button
            onClick={() => setActiveTab('career-arch')}
            className={`py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'career-arch'
                ? 'bg-white text-sky-700 font-bold shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>L1–L8 Career Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('career-assessment')}
            className={`py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'career-assessment'
                ? 'bg-white text-sky-700 font-bold shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span>Promotion Assessment & IDP</span>
          </button>

          <button
            onClick={() => setActiveTab('organization')}
            className={`py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'organization'
                ? 'bg-white text-sky-700 font-bold shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>Organisation Master</span>
          </button>

          <button
            onClick={() => setActiveTab('case-study')}
            className={`py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'case-study'
                ? 'bg-white text-sky-700 font-bold shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Appraisal Framework (90-Day Plan)</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-2.5 px-4 rounded-lg flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'reports'
                ? 'bg-white text-sky-700 font-bold shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Reporting Centre</span>
          </button>
        </div>

        {/* Tab View Container */}
        <div>
          {activeTab === 'workforce' && (
            <WorkforceIntelligence
              data={workforceData}
              loading={loading}
              scope={scope}
              onOpenEmployeeProfile={(id) => {
                setSelectedEmployeeId(id);
                setIsProfileModalOpen(true);
              }}
              onSelectNineBoxCategory={(catKey) => {
                setDirectoryNineBoxFilter(catKey);
                setActiveTab('employees');
              }}
            />
          )}

          {activeTab === 'case-study' && (
            <AppraisalCaseStudy
              caseStudyData={workforceData?.caseStudy}
              loading={loading}
            />
          )}

          {activeTab === 'employees' && (
            <EmployeeDirectory
              onSelectEmployee={(id) => {
                setSelectedEmployeeId(id);
                setIsProfileModalOpen(true);
              }}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenExcelModal={() => setIsExcelModalOpen(true)}
              refreshTrigger={refreshTrigger}
              initialNineBoxFilter={directoryNineBoxFilter}
              onClearNineBoxFilter={() => setDirectoryNineBoxFilter(null)}
            />
          )}

          {activeTab === 'career-arch' && (
            <CareerArchitecture />
          )}

          {activeTab === 'competency-matrix' && (
            <CompetencyMatrix onNavigateToCareerArch={() => setActiveTab('career-arch')} />
          )}

          {activeTab === 'career-assessment' && (
            <IndividualCompetencyAssessment
              initialEmployeeId={selectedEmployeeId || ''}
              onOpenPromotionWorkflow={(id) => {
                setPromotionCandidateId(id);
                setIsPromotionModalOpen(true);
              }}
            />
          )}

          {activeTab === 'organization' && (
            <OrgManager />
          )}

          {activeTab === 'reports' && (
            <ReportingCentre workforceData={workforceData} />
          )}
        </div>
      </main>

      {/* Modals */}
      <ExcelUploadModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onUploadSuccess={() => {
          fetchWorkforceData();
          setRefreshTrigger(prev => prev + 1);
        }}
      />

      <EmployeeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(newEmp) => {
          fetchWorkforceData();
          setRefreshTrigger(prev => prev + 1);
          setSelectedEmployeeId(newEmp.id);
          setIsProfileModalOpen(true);
        }}
      />

      <EmployeeProfileModal
        employeeId={selectedEmployeeId}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenPromotionModal={(id) => {
          setIsProfileModalOpen(false);
          setPromotionCandidateId(id);
          setIsPromotionModalOpen(true);
        }}
        onEmployeeUpdated={() => {
          fetchWorkforceData();
          setRefreshTrigger(prev => prev + 1);
        }}
      />

      <PromotionWorkflowModal
        employeeId={promotionCandidateId}
        isOpen={isPromotionModalOpen}
        onClose={() => setIsPromotionModalOpen(false)}
        onPromotionExecuted={() => {
          fetchWorkforceData();
          setRefreshTrigger(prev => prev + 1);
        }}
      />
    </div>
  );
}
