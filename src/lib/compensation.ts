export interface PayBandDef {
  level: string;
  min: number;
  midpoint: number;
  max: number;
}

export const DEFAULT_PAY_BANDS: Record<string, PayBandDef> = {
  L1: { level: 'L1', min: 5.5, midpoint: 8.0, max: 11.5 },
  L2: { level: 'L2', min: 9.0, midpoint: 13.0, max: 18.0 },
  L3: { level: 'L3', min: 15.0, midpoint: 21.0, max: 29.0 },
  L4: { level: 'L4', min: 25.0, midpoint: 34.0, max: 46.0 },
  L5: { level: 'L5', min: 42.0, midpoint: 57.0, max: 75.0 },
  L6: { level: 'L6', min: 65.0, midpoint: 85.0, max: 110.0 },
  L7: { level: 'L7', min: 95.0, midpoint: 125.0, max: 160.0 },
  L8: { level: 'L8', min: 140.0, midpoint: 180.0, max: 240.0 },
};

export interface LevelTrackDef {
  level: string;
  name: string;
  icTitle: string;
  mgmtTitle: string;
  scope: string;
}

export const CAREER_LEVEL_TRACKS: Record<string, LevelTrackDef> = {
  L1: { level: 'L1', name: 'Data Engineer I', icTitle: 'Data Engineer I', mgmtTitle: '—', scope: 'Task execution, foundational pipeline development, guided delivery within established frameworks.' },
  L2: { level: 'L2', name: 'Data Engineer II', icTitle: 'Data Engineer II', mgmtTitle: '—', scope: 'Independent feature & pipeline delivery, data modeling, query optimization, standard problem solving.' },
  L3: { level: 'L3', name: 'Sr. Data Engineer', icTitle: 'Sr. Data Engineer', mgmtTitle: '—', scope: 'Complex distributed pipeline ownership, streaming architecture, peer code reviews & mentoring.' },
  L4: { level: 'L4', name: 'Principal / Lead', icTitle: 'Principal Engineer I', mgmtTitle: 'Lead', scope: 'Enterprise pipeline architecture, high-impact technical delivery and pod leadership.' },
  L5: { level: 'L5', name: 'Principal II / Engineering Manager', icTitle: 'Principal Engineer II', mgmtTitle: 'Engineering Manager', scope: 'Data platform strategy, managerial supervision, cross-squad alignment and SLA governance.' },
  L6: { level: 'L6', name: 'Technical Architect / Sr. Manager', icTitle: 'Technical Architect', mgmtTitle: 'Sr. Manager', scope: 'Enterprise data architecture standards, multi-pod organizational leadership, thought leadership.' },
  L7: { level: 'L7', name: 'Director', icTitle: '— (No IC Track at L7)', mgmtTitle: 'Director', scope: 'Departmental strategic vision, data science organization governance, operational excellence.' },
  L8: { level: 'L8', name: 'Sr. Director', icTitle: '— (No IC Track at L8)', mgmtTitle: 'Sr. Director', scope: 'Executive business unit ownership, enterprise workforce architecture and long-range tech strategy.' },
};

/**
 * Automatically calculate compa-ratio: (Fixed Pay / Band Midpoint)
 */
export function calculateCompaRatio(fixedPay: number, careerLevel: string): number {
  const band = DEFAULT_PAY_BANDS[careerLevel] || DEFAULT_PAY_BANDS['L3'];
  if (!band || band.midpoint <= 0) return 1.0;
  return Number((fixedPay / band.midpoint).toFixed(3));
}

/**
 * Format currency in INR Lakhs
 */
export function formatLakhs(value: number, decimals: number = 2): string {
  if (value == null || isNaN(value)) return '₹0.00 LPA';
  return `₹${value.toFixed(decimals)} LPA`;
}
