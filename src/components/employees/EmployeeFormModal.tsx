'use client';

import React, { useState } from 'react';
import { X, UserPlus, Save, AlertCircle, Award } from 'lucide-react';
import { DEFAULT_PAY_BANDS, calculateCompaRatio, CAREER_LEVEL_TRACKS } from '@/lib/compensation';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (emp: any) => void;
}

export default function EmployeeFormModal({
  isOpen,
  onClose,
  onSuccess
}: EmployeeFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    teamId: 'A',
    department: 'Engineering',
    jobCodeId: 'A-SR-DATA',
    jobTitle: 'Senior Engineer',
    careerLevel: 'L3',
    careerTrack: 'IC',
    gender: 'Female',
    age: 28,
    tenure: 1.0,
    workMode: 'Hybrid',
    location: 'Hyderabad',
    annualFixedPay: 22.0,
    variablePay: 3.3,
    reportingManagerId: '',
    coachId: '',
    currentRating: 4,
    potential: 4, // Mapped to Competence Score (1-5)
    topTalent: true,
    criticalRole: false,
    highPotential: true,
    positionCriticality: 'Standard'
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentBand = DEFAULT_PAY_BANDS[formData.careerLevel] || DEFAULT_PAY_BANDS['L3'];
  const previewCompa = calculateCompaRatio(formData.annualFixedPay, formData.careerLevel);
  const trackInfo = CAREER_LEVEL_TRACKS[formData.careerLevel as keyof typeof CAREER_LEVEL_TRACKS];
  const isHipo = (formData.currentRating >= 4) && (formData.potential >= 4);

  const handleLevelChange = (newLevel: string) => {
    const tInfo = CAREER_LEVEL_TRACKS[newLevel as keyof typeof CAREER_LEVEL_TRACKS];
    const isLeadershipOnly = newLevel === 'L7' || newLevel === 'L8';
    let defaultTitle = isLeadershipOnly 
      ? (newLevel === 'L7' ? 'Director' : 'Sr. Director') 
      : (tInfo ? tInfo.icTitle : 'Engineer');
    
    if (!isLeadershipOnly && formData.careerTrack === 'Management' && tInfo && tInfo.mgmtTitle) {
      defaultTitle = tInfo.mgmtTitle;
    }
    const newBand = DEFAULT_PAY_BANDS[newLevel] || DEFAULT_PAY_BANDS['L3'];

    setFormData(prev => ({
      ...prev,
      careerLevel: newLevel,
      careerTrack: isLeadershipOnly ? 'Management' : prev.careerTrack,
      jobTitle: defaultTitle,
      annualFixedPay: newBand.midpoint
    }));
  };

  const handleTrackChange = (newTrack: string) => {
    const isLeadershipOnly = formData.careerLevel === 'L7' || formData.careerLevel === 'L8';
    if (isLeadershipOnly) return; // No IC track at L7/L8

    let title = trackInfo ? trackInfo.icTitle : formData.jobTitle;
    if (newTrack === 'Management' && trackInfo && trackInfo.mgmtTitle) {
      title = trackInfo.mgmtTitle;
    }
    setFormData(prev => ({
      ...prev,
      careerTrack: newTrack,
      jobTitle: title
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...formData,
        highPotential: isHipo,
        topTalent: formData.topTalent || isHipo
      };

      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create employee');
      }

      onSuccess(data.employee);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                <UserPlus className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Create Employee Record</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Adds an employee into the Single Source of Truth (SSOT). All dashboards recalculate dynamically.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section A: Identification */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
              Section A: Employee Identification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Iyer"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Work Mode</label>
                <select
                  value={formData.workMode}
                  onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-sky-500 focus:outline-none"
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section B: Organisation Assignment & Dual Track Roles */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
              Section B: Organisation & Career Architecture
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Team & Function *</label>
                <select
                  value={formData.teamId}
                  onChange={(e) => {
                    const t = e.target.value;
                    const dept = t === 'A' ? 'Engineering' : (t === 'B' ? 'Operations' : 'Revenue');
                    setFormData({ ...formData, teamId: t, department: dept });
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-sky-500 focus:outline-none"
                >
                  <option value="A">Team A · Engineering</option>
                  <option value="B">Team B · Operations</option>
                  <option value="C">Team C · Revenue</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Career Level (L1–L8) *</label>
                <select
                  value={formData.careerLevel}
                  onChange={(e) => handleLevelChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:border-sky-500 focus:outline-none"
                >
                  {['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Career Track</label>
                <select
                  value={formData.careerTrack}
                  onChange={(e) => handleTrackChange(e.target.value)}
                  disabled={formData.careerLevel === 'L7' || formData.careerLevel === 'L8'}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-sky-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-500"
                >
                  {(formData.careerLevel === 'L7' || formData.careerLevel === 'L8') ? (
                    <option value="Management">Leadership Track (No IC Role at {formData.careerLevel})</option>
                  ) : (
                    <>
                      <option value="IC">Individual Contributor (IC)</option>
                      <option value="Management">Management Track</option>
                    </>
                  )}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-600 mb-1 font-medium">Standard Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:border-sky-500 focus:outline-none"
                />
                {trackInfo && (
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 flex-wrap">
                    <span>Suggested titles for {formData.careerLevel}:</span>
                    {(formData.careerLevel === 'L7' || formData.careerLevel === 'L8') ? (
                      <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold">
                        {formData.careerLevel === 'L7' ? 'Director (Only Director · No IC Role)' : 'Senior Director (Only Senior Director · No IC Role)'}
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, jobTitle: trackInfo.icTitle, careerTrack: 'IC' })}
                          className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                        >
                          IC: {trackInfo.icTitle}
                        </button>
                        {trackInfo.mgmtTitle && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, jobTitle: trackInfo.mgmtTitle!, careerTrack: 'Management' })}
                            className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium"
                          >
                            Mgmt: {trackInfo.mgmtTitle}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Reporting Manager ID</label>
                <input
                  type="text"
                  value={formData.reportingManagerId}
                  onChange={(e) => setFormData({ ...formData, reportingManagerId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:border-sky-500 focus:outline-none"
                  placeholder="e.g. SYN-0001"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-slate-600 mb-1 font-medium">Career Coach ID (Decoupled Governance)</label>
                <input
                  type="text"
                  value={formData.coachId}
                  onChange={(e) => setFormData({ ...formData, coachId: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono focus:border-sky-500 focus:outline-none"
                  placeholder="e.g. SYN-0002"
                />
              </div>
            </div>
          </div>

          {/* Section C: Demographics (Male vs Female) */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
              Section C: Demographics (Male vs Female)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold focus:border-sky-500 focus:outline-none"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Undisclosed">Undisclosed</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Age (Years)</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Tenure (Years)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.tenure}
                  onChange={(e) => setFormData({ ...formData, tenure: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section D: Compensation */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
              Section D: Compensation & Pay Band
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Fixed Annual Pay (INR Lakhs) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.annualFixedPay}
                  onChange={(e) => setFormData({ ...formData, annualFixedPay: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Applicable Pay Band</label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sky-700">
                  ₹{currentBand.min}L – ₹{currentBand.midpoint}L – ₹{currentBand.max}L
                </div>
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Derived Compa-Ratio</label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold text-emerald-600">
                  {previewCompa.toFixed(3)}
                </div>
              </div>
            </div>
          </div>

          {/* Section E: Performance & Competence Calibration (1 to 5) */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1">
              Section E: Performance & Competence Calibration (1 to 5 Max)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Performance Rating (1 to 5 Max)</label>
                <select
                  value={formData.currentRating}
                  onChange={(e) => setFormData({ ...formData, currentRating: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-sky-500 focus:outline-none"
                >
                  <option value={5}>5 - Far Exceeds Expectations</option>
                  <option value={4}>4 - Exceeds Expectations</option>
                  <option value={3}>3 - Meets Expectations</option>
                  <option value={2}>2 - Partially Meets Expectations</option>
                  <option value={1}>1 - Does Not Meet Expectations</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Competence Score (1 to 5 Max)</label>
                <select
                  value={formData.potential}
                  onChange={(e) => setFormData({ ...formData, potential: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-sky-500 focus:outline-none"
                >
                  <option value={5}>5 - Mastery (Industry Standard Authority)</option>
                  <option value={4}>4 - Advanced (Independent Multi-Squad Leader)</option>
                  <option value={3}>3 - Proficient (Consistent Autonomous Delivery)</option>
                  <option value={2}>2 - Developing (Requires Occasional Guidance)</option>
                  <option value={1}>1 - Foundational (Entry / Guided Execution)</option>
                </select>
              </div>
            </div>

            {/* HIPO Diagnostic Feedback */}
            <div className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
              isHipo
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div className="flex items-center gap-2">
                <Award className={`w-4 h-4 ${isHipo ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="font-bold">
                  {isHipo
                    ? '⭐ Qualified for High Potential (HIPO) & Accelerated IDP Pipeline!'
                    : 'Standard Talent Classification (Requires Rating &ge; 4 and Competence &ge; 4 for HIPO)'}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-300">
                Perf: {formData.currentRating}/5 | Comp: {formData.potential}/5
              </span>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={formData.topTalent}
                  onChange={(e) => setFormData({ ...formData, topTalent: e.target.checked })}
                  className="rounded border-slate-300 text-sky-600 focus:ring-0"
                />
                <span>Designate Top Talent</span>
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={formData.criticalRole}
                  onChange={(e) => setFormData({ ...formData, criticalRole: e.target.checked })}
                  className="rounded border-slate-300 text-sky-600 focus:ring-0"
                />
                <span>Critical Role Incumbent</span>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              ⚡ Creates authoritative record & updates SSOT metrics immediately.
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Employee'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

