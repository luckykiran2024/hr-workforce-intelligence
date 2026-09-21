'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Users,
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { DEFAULT_PAY_BANDS } from '@/lib/compensation';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (importedCount: number) => void;
}

export default function ExcelUploadModal({
  isOpen,
  onClose,
  onUploadSuccess
}: ExcelUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Generate and download a standard Excel template
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Employee ID': 'SYN-0001',
        'Full Name': 'Priya Nair',
        'Team (A/B/C)': 'A',
        'Department': 'Digital Engineering',
        'Career Level (L1-L8)': 'L4',
        'Job Title': 'Principal Engineer I',
        'Gender (Female/Male)': 'Female',
        'Annual Fixed Pay (INR Lakhs)': 33.5,
        'Work Mode (Hybrid/On-site/Remote)': 'Hybrid',
        'Location': 'Bengaluru',
        'Performance Rating (1-5)': 5,
        'Competence Score (1-5)': 5,
        'Is Manager (TRUE/FALSE)': 'FALSE',
        'Manager Span': 0
      },
      {
        'Employee ID': 'SYN-0002',
        'Full Name': 'Amit Vikram',
        'Team (A/B/C)': 'B',
        'Department': 'Operations & Support',
        'Career Level (L1-L8)': 'L4',
        'Job Title': 'Technical Lead',
        'Gender (Female/Male)': 'Male',
        'Annual Fixed Pay (INR Lakhs)': 33.0,
        'Work Mode (Hybrid/On-site/Remote)': 'On-site',
        'Location': 'Hyderabad',
        'Performance Rating (1-5)': 4,
        'Competence Score (1-5)': 4,
        'Is Manager (TRUE/FALSE)': 'TRUE',
        'Manager Span': 8
      },
      {
        'Employee ID': 'SYN-0003',
        'Full Name': 'Sunita Deshmukh',
        'Team (A/B/C)': 'C',
        'Department': 'Commercial & Revenue',
        'Career Level (L1-L8)': 'L3',
        'Job Title': 'Senior Client Partner',
        'Gender (Female/Male)': 'Female',
        'Annual Fixed Pay (INR Lakhs)': 23.5,
        'Work Mode (Hybrid/On-site/Remote)': 'Remote',
        'Location': 'Pune',
        'Performance Rating (1-5)': 4,
        'Competence Score (1-5)': 3,
        'Is Manager (TRUE/FALSE)': 'FALSE',
        'Manager Span': 0
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    // Set auto column width
    ws['!cols'] = [
      { wch: 15 }, // ID
      { wch: 22 }, // Name
      { wch: 14 }, // Team
      { wch: 24 }, // Department
      { wch: 22 }, // Level
      { wch: 26 }, // Role
      { wch: 22 }, // Gender
      { wch: 26 }, // Pay
      { wch: 30 }, // Mode
      { wch: 16 }, // Location
      { wch: 24 }, // Rating
      { wch: 24 }, // Competence Score
      { wch: 22 }, // IsManager
      { wch: 16 }  // Span
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee_Master_Template');
    XLSX.writeFile(wb, 'Employee_Master_Upload_Template.xlsx');
  };

  const parseFile = (uploadedFile: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonRows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (jsonRows.length === 0) {
          setErrorMsg('The selected spreadsheet contains no data rows.');
          setParsedRows([]);
          setPreviewRows([]);
          return;
        }

        // Map column variations intelligently
        const normalized = jsonRows.map((r) => {
          const keys = Object.keys(r);
          const findKey = (candidates: string[]) => {
            for (const cand of candidates) {
              const matched = keys.find(k => k.trim().toLowerCase() === cand.toLowerCase());
              if (matched) return r[matched];
            }
            return '';
          };

          const name = findKey(['Full Name', 'Name', 'Employee Name', 'EmployeeName']);
          const id = findKey(['Employee ID', 'EmployeeId', 'ID', 'EmpId', 'Code']);
          const teamId = findKey(['Team (A/B/C)', 'Team', 'TeamId', 'Team ID', 'Business Unit']);
          const department = findKey(['Department', 'Dept', 'Function', 'Business Area']);
          const careerLevel = findKey(['Career Level (L1-L8)', 'Career Level', 'Level', 'Band', 'Grade']);
          const jobTitle = findKey(['Job Title', 'Title', 'Role', 'Designation']);
          const gender = findKey(['Gender (Female/Male)', 'Gender', 'Gender (Woman/Man)', 'Sex']);
          const annualFixedPay = findKey([
            'Annual Fixed Pay (INR Lakhs)',
            'Annual Fixed Pay',
            'Fixed Pay',
            'Salary',
            'CTC',
            'Pay'
          ]);
          const workMode = findKey(['Work Mode (Hybrid/On-site/Remote)', 'Work Mode', 'Mode', 'Location Type']);
          const location = findKey(['Location', 'City', 'Base Location']);
          const currentRating = findKey(['Performance Rating (1-5)', 'Rating', 'Performance Rating', 'Appraisal Rating']);
          const potential = findKey(['Competence Score (1-5)', 'Competence (1-5)', 'Competence', 'Potential (1-5)', 'Potential (1-3)', 'Potential', 'Talent Potential']);
          const isManager = findKey(['Is Manager (TRUE/FALSE)', 'Is Manager', 'IsManager', 'Manager?']);
          const span = findKey(['Manager Span', 'Span', 'Direct Reports', 'Headcount Managed']);

          return {
            id,
            name,
            teamId,
            department,
            careerLevel,
            jobTitle,
            gender,
            annualFixedPay,
            workMode,
            location,
            currentRating,
            potential,
            isManager,
            span
          };
        }).filter(r => r.name && String(r.name).trim() !== '');

        if (normalized.length === 0) {
          setErrorMsg('Could not detect valid employee records. Please ensure your file has a "Name" column.');
          setParsedRows([]);
          setPreviewRows([]);
          return;
        }

        setParsedRows(normalized);
        setPreviewRows(normalized.slice(0, 5));
      } catch (err: any) {
        console.error('Excel parse error:', err);
        setErrorMsg('Failed to parse the file. Please ensure it is a valid .xlsx, .xls, or .csv spreadsheet.');
      }
    };

    reader.readAsArrayBuffer(uploadedFile);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      parseFile(e.dataTransfer.files[0]);
    }
  };

  const handleCommitUpload = async () => {
    if (parsedRows.length === 0) return;
    setUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/employees/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employees: parsedRows })
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg(`Successfully imported ${json.importedCount} employees! Total Headcount: ${json.totalHeadcount}`);
        setTimeout(() => {
          onUploadSuccess(json.importedCount);
          onClose();
        }, 1200);
      } else {
        setErrorMsg(json.error || 'Failed to import employee records.');
      }
    } catch (err: any) {
      console.error('Upload request failed:', err);
      setErrorMsg('Network error while importing records. Please check connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Batch Ingestion Engine
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Bulk Upload Employee Data via Excel
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Upload your employee roster. Central benchmarks (Pay Bands L1–L8, Compa-Ratios, and 9-Box mapping) are automatically derived.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs bg-white">
          {/* Action Row: Template Download & Requirements */}
          <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-600" />
                Need the official column format?
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Download our pre-structured template containing exact headers and sample rows.
              </p>
            </div>
            <button
              onClick={handleDownloadTemplate}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Download Template (.xlsx)</span>
            </button>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-sky-500 bg-sky-50/50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".xlsx,.xls,.csv"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  parseFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mx-auto mb-3 text-sky-600">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-800">
              {file ? file.name : 'Click to select or drag and drop your spreadsheet'}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Supports .xlsx, .xls, or .csv up to 10MB
            </p>
          </div>

          {/* Error / Success Messages */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Live Data Preview */}
          {previewRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-600" />
                  Roster Preview ({parsedRows.length} total employees detected)
                </span>
                <span className="text-[11px] text-slate-500">Showing first 5 entries</span>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <th className="py-2.5 px-3 font-semibold">Name</th>
                      <th className="py-2.5 px-3 font-semibold">Team</th>
                      <th className="py-2.5 px-3 font-semibold">Level</th>
                      <th className="py-2.5 px-3 font-semibold">Role</th>
                      <th className="py-2.5 px-3 font-semibold">Fixed Pay</th>
                      <th className="py-2.5 px-3 font-semibold">Gender</th>
                      <th className="py-2.5 px-3 font-semibold">Perf & Comp</th>
                      <th className="py-2.5 px-3 font-semibold">Talent Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewRows.map((r, i) => {
                      const rating = Number(r.currentRating || 3);
                      const comp = Number(r.potential || 3);
                      const isHipo = rating >= 4 && comp >= 4;

                      return (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-bold text-slate-900">{r.name}</td>
                          <td className="py-2 px-3 font-mono font-bold text-sky-700">Team {r.teamId || 'A'}</td>
                          <td className="py-2 px-3 font-mono text-slate-700">{r.careerLevel || 'L3'}</td>
                          <td className="py-2 px-3 text-slate-600 truncate max-w-[130px]">{r.jobTitle || 'Role'}</td>
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">₹{r.annualFixedPay || 15}L</td>
                          <td className="py-2 px-3 text-slate-600 font-medium">{r.gender || 'Undisclosed'}</td>
                          <td className="py-2 px-3 font-medium">
                            <span className="font-bold text-sky-700">P:{rating}</span> / <span className="font-bold text-amber-700">C:{comp}</span>
                          </td>
                          <td className="py-2 px-3">
                            {isHipo ? (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                                ⭐ HIPO
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[10px]">Standard</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            * Pay bands & compa-ratios will be automatically calculated against centrally governed levels.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCommitUpload}
              disabled={uploading || parsedRows.length === 0}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Importing {parsedRows.length} Employees...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Import {parsedRows.length > 0 ? `${parsedRows.length} Employees` : 'Records'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
