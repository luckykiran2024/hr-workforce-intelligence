'use client';

import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Layers,
  MapPin,
  UserCheck,
  Shield,
  Briefcase
} from 'lucide-react';

export default function OrgManager() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/organization')
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  const bu = data.businessUnits?.[0] || {
    name: 'Digital Technologies & Commerce',
    head: 'Soma Kiran Gonella',
    hrbp: 'Lead HRBP',
    location: 'Bengaluru / Hyderabad',
    teams: []
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Building2 className="w-3.5 h-3.5" />
              Organisation Master & Hierarchy
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Business Unit & Team Management Architecture
            </h2>
            <p className="text-sm text-slate-500 max-w-3xl mt-1">
              Authoritative structure connecting Business Units, Teams, Functional Departments, and Reporting Hierarchies.
            </p>
          </div>
        </div>
      </div>

      {/* Business Unit Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center font-bold">
              BU
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{bu.name}</h3>
              <span className="text-xs text-slate-500">{bu.function} · Location: {bu.location}</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active Unit
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px] block font-semibold">Business Unit Head</span>
            <span className="text-slate-900 font-bold text-sm mt-0.5 block">{bu.head}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-500 text-[11px] block font-semibold">Lead HR Business Partner</span>
            <span className="text-sky-700 font-bold text-sm mt-0.5 block">{bu.hrbp}</span>
          </div>
        </div>
      </div>

      {/* 3 Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bu.teams?.map((team: any) => (
          <div key={team.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-sky-300 transition-all">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
                Team {team.id}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Headcount: <strong className="text-slate-900">{team._count?.employees || 0}</strong>
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-slate-900">{team.name}</h4>
              <p className="text-xs text-slate-500">{team.department} · {team.location}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-500 text-[11px] block font-semibold">Team Leader</span>
              <span className="text-slate-800 font-bold block mt-0.5">{team.teamHead}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
