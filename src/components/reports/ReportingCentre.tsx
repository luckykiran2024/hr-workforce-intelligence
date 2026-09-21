'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Presentation,
  Download,
  CheckCircle,
  FileText,
  Layers,
  Sparkles
} from 'lucide-react';
import * as XLSX from 'xlsx';
import pptxgen from 'pptxgenjs';

interface ReportingCentreProps {
  workforceData: any;
}

export default function ReportingCentre({ workforceData }: ReportingCentreProps) {
  const [generatingPptx, setGeneratingPptx] = useState(false);

  const handleDownloadPPTX = async () => {
    setGeneratingPptx(true);
    try {
      const pres = new pptxgen();
      pres.layout = 'LAYOUT_16x9';

      // Slide 1: Title Slide
      const slide1 = pres.addSlide();
      slide1.background = { color: '090D16' };
      slide1.addText('WORKFORCE INTELLIGENCE & APPRAISAL HEALTH', {
        x: 1.0,
        y: 2.2,
        w: 11.3,
        h: 1.0,
        fontSize: 32,
        fontFace: 'Arial',
        bold: true,
        color: '38BDF8'
      });
      slide1.addText('HRBP / Executive Leadership Decision Brief — Interview Case Study', {
        x: 1.0,
        y: 3.3,
        w: 11.3,
        h: 0.6,
        fontSize: 18,
        fontFace: 'Arial',
        color: '94A3B8'
      });
      slide1.addText('100% Synthetic Records · Snapshot Date: 19 Sep 2026', {
        x: 1.0,
        y: 5.5,
        w: 11.3,
        h: 0.4,
        fontSize: 12,
        fontFace: 'Arial',
        color: '64748B'
      });

      // Slide 2: Executive Overview
      const slide2 = pres.addSlide();
      slide2.background = { color: '090D16' };
      slide2.addText('Executive Overview & Key Metrics', {
        x: 0.8,
        y: 0.6,
        w: 10.0,
        h: 0.6,
        fontSize: 24,
        fontFace: 'Arial',
        bold: true,
        color: 'FFFFFF'
      });

      const summary = workforceData?.summary || {};
      const metricsText = [
        `• Total Active Headcount: ${summary.headcount || 0} employees across 3 teams`,
        `• Women Representation: ${summary.femalePct || 0}% with ${summary.adjustedGenderGap || 0} adjusted gender compensation gap`,
        `• Top Talent Density: ${summary.topTalentPct || 0}% actively calibrated in 9-Box framework`,
        `• Mean Compa-Ratio: ${summary.avgCompaRatio || 0} aligned with market midpoints`,
        `• Average Managerial Span: ${summary.avgSpan || 0} reports per manager`
      ].join('\n\n');

      slide2.addText(metricsText, {
        x: 1.0,
        y: 1.6,
        w: 11.3,
        h: 4.5,
        fontSize: 16,
        fontFace: 'Arial',
        color: 'E2E8F0',
        lineSpacing: 24
      });

      // Slide 3: 3-Team Appraisal Diagnosis
      const slide3 = pres.addSlide();
      slide3.background = { color: '090D16' };
      slide3.addText('Three-Team Appraisal Case Study Findings', {
        x: 0.8,
        y: 0.6,
        w: 10.0,
        h: 0.6,
        fontSize: 24,
        fontFace: 'Arial',
        bold: true,
        color: 'FFFFFF'
      });

      const caseText = [
        `TEAM A (Engineering - 128 Staff):`,
        `Pronounced upward rating leniency (mean 3.84/5) and grade compression. Requires deliverable calibration.`,
        ``,
        `TEAM B (Operations - 96 Staff):`,
        `Managerial span overload (up to 18 reports). Correlates with compressed ratings and review delay.`,
        ``,
        `TEAM C (Revenue - 64 Staff):`,
        `Work-proximity paradox (+0.45 rating gap for on-site staff despite identical objective goal realization).`
      ].join('\n');

      slide3.addText(caseText, {
        x: 1.0,
        y: 1.5,
        w: 11.3,
        h: 5.0,
        fontSize: 15,
        fontFace: 'Arial',
        color: 'E2E8F0',
        lineSpacing: 20
      });

      // Slide 4: 90-Day Action Plan
      const slide4 = pres.addSlide();
      slide4.background = { color: '090D16' };
      slide4.addText('90-Day Strategic HRBP Leadership Action Plan', {
        x: 0.8,
        y: 0.6,
        w: 10.0,
        h: 0.6,
        fontSize: 24,
        fontFace: 'Arial',
        bold: true,
        color: 'FFFFFF'
      });

      const planText = [
        `DAYS 1-30: Evidence Calibration & Span Relief`,
        `• Publish objective technical rubrics; institute interim span delegation in Operations.`,
        ``,
        `DAYS 31-60: Structural Pod Re-alignment & Blinding`,
        `• Formalize Layer 3 leads capping spans at 8; introduce asynchronous dossiers in Revenue.`,
        ``,
        `DAYS 61-90: Institutional Governance & Competency Linking`,
        `• Anchor L1-L8 competency progression directly to appraisal calibrations and pay band updates.`
      ].join('\n');

      slide4.addText(planText, {
        x: 1.0,
        y: 1.5,
        w: 11.3,
        h: 5.0,
        fontSize: 15,
        fontFace: 'Arial',
        color: 'E2E8F0',
        lineSpacing: 20
      });

      await pres.writeFile({ fileName: `Workforce_Intelligence_Decision_Brief_${new Date().toISOString().split('T')[0]}.pptx` });
    } catch (err) {
      console.error('PPTX generation error:', err);
    } finally {
      setGeneratingPptx(false);
    }
  };

  const handleDownloadExcelReport = (reportType: string) => {
    let filename = `${reportType}_Report.xlsx`;
    let sheetData: any[] = [];

    if (reportType === 'Headcount_and_Demographics') {
      const demo = workforceData?.demographics || {};
      sheetData = Object.entries(demo.levelDistribution || {}).map(([lvl, val]: any) => ({
        Career_Level: lvl,
        Total_Employees: val.total,
        Women: val.women,
        Men: val.men
      }));
    } else if (reportType === 'Compensation_and_Bands') {
      const compa = workforceData?.compa || {};
      sheetData = (compa.byLevel || []).map((lvl: any) => ({
        Level: lvl.level,
        Population: lvl.count,
        Band_Min_LPA: lvl.bandMin,
        Band_Mid_LPA: lvl.bandMid,
        Band_Max_LPA: lvl.bandMax,
        Median_Pay_LPA: lvl.median,
        P25_Compa_LPA: lvl.p25,
        P75_Compa_LPA: lvl.p75
      }));
    } else {
      sheetData = [
        { Metric: 'Active Headcount', Value: workforceData?.summary?.headcount || 0 },
        { Metric: 'Female Pct', Value: `${workforceData?.summary?.femalePct || 0}%` },
        { Metric: 'Top Talent Pct', Value: `${workforceData?.summary?.topTalentPct || 0}%` },
        { Metric: 'Mean Compa-Ratio', Value: workforceData?.summary?.avgCompaRatio || 0 },
        { Metric: 'Avg Manager Span', Value: workforceData?.summary?.avgSpan || 0 }
      ];
    }

    const ws = XLSX.utils.json_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, reportType);
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Executive Reporting Centre
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Exportable Leadership Briefs & Data Dossiers
            </h2>
            <p className="text-sm text-slate-500 max-w-3xl mt-1">
              Download presentation decks (.pptx) and spreadsheet dossiers (.xlsx) derived from the authoritative Single Source of Truth.
            </p>
          </div>

          <button
            onClick={handleDownloadPPTX}
            disabled={generatingPptx}
            className="px-5 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all shrink-0"
          >
            <Presentation className="w-4 h-4" />
            <span>{generatingPptx ? 'Building Deck...' : 'Download Deck (.pptx)'}</span>
          </button>
        </div>
      </div>

      {/* Downloadable Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Workforce Demographics Dossier</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Complete career-level breakdown, gender distribution, and working mode analytics.
            </p>
          </div>
          <button
            onClick={() => handleDownloadExcelReport('Headcount_and_Demographics')}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-sky-600" />
            <span>Download Excel</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Compensation & Compa-Ratio Audit</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Pay band spread (L1-L8), median compensation, and adjusted gender equity gap.
            </p>
          </div>
          <button
            onClick={() => handleDownloadExcelReport('Compensation_and_Bands')}
            className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download Excel</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold mb-3">
              <Presentation className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Leadership Executive Presentation</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              16:9 executive PowerPoint slide deck with diagnosis and 90-day action plan.
            </p>
          </div>
          <button
            onClick={handleDownloadPPTX}
            disabled={generatingPptx}
            className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{generatingPptx ? 'Generating...' : 'Export .pptx'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
