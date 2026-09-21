'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  UserPlus,
  Download,
  Star,
  Shield,
  RefreshCw,
  Eye,
  Sparkles
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface EmployeeDirectoryProps {
  onSelectEmployee: (id: string) => void;
  onOpenAddModal: () => void;
  onOpenExcelModal?: () => void;
  refreshTrigger?: number;
  initialNineBoxFilter?: string | null;
  onClearNineBoxFilter?: () => void;
}

export default function EmployeeDirectory({
  onSelectEmployee,
  onOpenAddModal,
  onOpenExcelModal,
  refreshTrigger,
  initialNineBoxFilter,
  onClearNineBoxFilter
}: EmployeeDirectoryProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [teamFilter, setTeamFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [talentFilter, setTalentFilter] = useState('all');
  const [nineBoxFilter, setNineBoxFilter] = useState<string>(initialNineBoxFilter || 'all');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (initialNineBoxFilter) {
      setNineBoxFilter(initialNineBoxFilter);
    }
  }, [initialNineBoxFilter]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (teamFilter !== 'all') params.append('team', teamFilter);
      if (levelFilter !== 'all') params.append('level', levelFilter);
      if (talentFilter !== 'all') params.append('talent', talentFilter);
      if (nineBoxFilter !== 'all') params.append('ninebox', nineBoxFilter);
      params.append('limit', '350');

      const res = await fetch(`/api/employees?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEmployees(data.employees || []);
        setTotalCount(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [search, teamFilter, levelFilter, talentFilter, nineBoxFilter, refreshTrigger]);

  const handleExportCSV = () => {
    if (!employees.length) return;
    const cleanData = employees.map(e => {
      const isHipo = (e.currentRating >= 4) && ((e.competence || e.potential || 0) >= 4);
      return {
        ID: e.id,
        Name: e.name,
        Team: e.teamId === 'A' ? 'Engineering' : (e.teamId === 'B' ? 'Operations' : 'Revenue'),
        Level: e.careerLevel,
        Title: e.jobTitle,
        Fixed_Pay_LPA: e.annualFixedPay,
        Compa_Ratio: e.compaRatio,
        Gender: e.gender,
        Work_Mode: e.workMode,
        Location: e.location,
        Rating_1to5: e.currentRating || 'Unrated',
        Competence_1to5: e.competence || e.potential || 'Unrated',
        HIPO_Status: isHipo ? 'Yes (⭐ Star HIPO)' : 'No',
        Top_Talent: e.topTalent ? 'Yes' : 'No',
        Critical_Role: e.criticalRole ? 'Yes' : 'No'
      };
    });

    const ws = XLSX.utils.json_to_sheet(cleanData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employees');
    XLSX.writeFile(wb, `Employee_Roster_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Search & Actions Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, ID, or job title..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-500 shadow-sm"
          >
            <option value="all">All Teams</option>
            <option value="A">Team A · Engineering</option>
            <option value="B">Team B · Operations</option>
            <option value="C">Team C · Revenue</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-500 shadow-sm"
          >
            <option value="all">All Levels</option>
            {['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <select
            value={talentFilter}
            onChange={(e) => setTalentFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-500 shadow-sm"
          >
            <option value="all">All Talent</option>
            <option value="hipo">⭐ HIPOs (Rating &ge;4, Comp &ge;4)</option>
            <option value="topTalent">Top Talent Only</option>
            <option value="criticalRole">Critical Roles Only</option>
          </select>

          {/* 9-Box Matrix Filter */}
          <select
            value={nineBoxFilter}
            onChange={(e) => setNineBoxFilter(e.target.value)}
            className={`px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:border-sky-500 shadow-sm transition-all ${
              nineBoxFilter !== 'all'
                ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                : 'bg-white border-slate-300 text-slate-700'
            }`}
          >
            <option value="all">All 9-Box Segments</option>
            <option value="enigma">Enigma (Low Perf, High Comp)</option>
            <option value="growth">Growth Potential (Med Perf, High Comp)</option>
            <option value="star">⭐ Star / HIPO (High Perf, High Comp)</option>
            <option value="dilemma">Dilemma (Low Perf, Med Comp)</option>
            <option value="core">Core Performer (Med Perf, Med Comp)</option>
            <option value="high performer">High Performer (High Perf, Med Comp)</option>
            <option value="underperformer">Underperformer (Low Perf, Low Comp)</option>
            <option value="contributor">Contributor (Med Perf, Low Comp)</option>
            <option value="solid pro">Solid Pro (High Perf, Low Comp)</option>
          </select>

          {/* Action Buttons */}
          {onOpenExcelModal && (
            <button
              onClick={onOpenExcelModal}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all"
              title="Upload Excel Spreadsheet Roster"
            >
              <Download className="w-3.5 h-3.5 rotate-180" />
              <span>Upload Excel</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            disabled={employees.length === 0}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Download Excel Roster"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Excel</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-sky-600/20 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Active 9-Box Filter Banner */}
      {nineBoxFilter !== 'all' && (
        <div className="px-4 py-3 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-900 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-bold flex items-center gap-1.5 text-amber-800">
              <Sparkles className="w-4 h-4 text-amber-600" />
              9-Box Matrix Filter Active:
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold uppercase text-[11px] tracking-wide border border-amber-300">
              {nineBoxFilter}
            </span>
            <span className="text-amber-700">
              Showing employees segmented under <strong>{nineBoxFilter.toUpperCase()}</strong> ({employees.length} employee{employees.length === 1 ? '' : 's'})
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setNineBoxFilter('all');
              if (onClearNineBoxFilter) onClearNineBoxFilter();
            }}
            className="text-xs font-bold text-amber-800 hover:text-rose-700 px-2.5 py-1 bg-white border border-amber-200 rounded-lg hover:border-rose-300 transition-colors shadow-2xs"
          >
            ✕ Clear 9-Box Filter
          </button>
        </div>
      )}

      {/* Roster Table */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-900">{employees.length}</strong> of <strong className="text-slate-900">{totalCount}</strong> active employee records
          </div>
          <button
            onClick={fetchEmployees}
            className="text-xs text-slate-500 hover:text-sky-600 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto mb-2"></div>
            Loading workforce roster...
          </div>
        ) : employees.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3">
              <UserPlus className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900">No Employees in Roster</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              All dummy records have been removed. Upload an Excel roster to import your workforce at once, or add employees individually.
            </p>
            <div className="flex items-center justify-center gap-3">
              {onOpenExcelModal && (
                <button
                  onClick={onOpenExcelModal}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4 rotate-180" />
                  <span>Upload Excel Roster</span>
                </button>
              )}
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Employee</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 bg-slate-50/75">
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Name</th>
                  <th className="py-3 px-4 font-semibold">Team & Function</th>
                  <th className="py-3 px-4 font-semibold">Career Level</th>
                  <th className="py-3 px-4 font-semibold">Job Title</th>
                  <th className="py-3 px-4 font-semibold">Fixed Compensation</th>
                  <th className="py-3 px-4 font-semibold">Compa-Ratio</th>
                  <th className="py-3 px-4 font-semibold">Rating & Comp</th>
                  <th className="py-3 px-4 font-semibold">Talent Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => {
                  const isHipo = (emp.currentRating >= 4) && ((emp.competence || emp.potential || 0) >= 4);
                  return (
                    <tr
                      key={emp.id}
                      onClick={() => onSelectEmployee(emp.id)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-sky-700">{emp.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {emp.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 border border-slate-200">
                          {emp.teamId === 'A' ? 'Engineering' : (emp.teamId === 'B' ? 'Operations' : 'Revenue')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono font-bold text-slate-800 px-1.5 py-0.5 bg-slate-100 rounded">
                          {emp.careerLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[180px]">{emp.jobTitle}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                        ₹{emp.annualFixedPay.toFixed(2)} LPA
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="font-bold text-slate-700">
                          {emp.compaRatio.toFixed(3)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-800">
                            {emp.currentRating ? `Perf: ${emp.currentRating}/5` : 'Perf: —'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {emp.competence || emp.potential ? `Comp: ${emp.competence || emp.potential}/5` : 'Comp: —'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {isHipo && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-gradient-to-r from-amber-100 to-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-xs">
                              ⭐ HIPO
                            </span>
                          )}
                          {emp.topTalent && !isHipo && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-500" />
                              Top
                            </span>
                          )}
                          {emp.criticalRole && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                              <Shield className="w-3 h-3 text-sky-600" />
                              Critical
                            </span>
                          )}
                          {!isHipo && !emp.topTalent && !emp.criticalRole && (
                            <span className="text-slate-400 text-[10px]">Standard</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEmployee(emp.id);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 ml-auto transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
