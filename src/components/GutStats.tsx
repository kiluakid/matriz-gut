/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GutItem } from '../types';
import { ShieldAlert, Activity, CheckCircle, Flame, BarChart3 } from 'lucide-react';

interface GutStatsProps {
  items: GutItem[];
}

export default function GutStats({ items }: GutStatsProps) {
  const total = items.length;
  const criticalCount = items.filter(item => item.score >= 60).length;
  const inProgressCount = items.filter(item => item.status === 'in_progress').length;
  const completedCount = items.filter(item => item.status === 'completed').length;
  
  // Calculate average score
  const avgScore = total > 0 
    ? Math.round(items.reduce((acc, item) => acc + item.score, 0) / total) 
    : 0;

  return (
    <div id="gut-stats-dashboard" className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Metric 1: Total */}
      <div id="stat-total" className="bg-[#141414] border border-white/5 rounded-lg p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Total Lançado</span>
          <div className="w-6 h-6 rounded bg-white/5 text-gray-400 flex items-center justify-center">
            <BarChart3 className="w-3 h-3" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono text-white">{total}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">ativos</span>
        </div>
      </div>

      {/* Metric 2: Critical / Urgent */}
      <div id="stat-critical" className="bg-[#141414] border border-white/5 rounded-lg p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Críticos</span>
          <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
            criticalCount > 0 
              ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
              : 'bg-white/5 text-gray-650'
          }`}>
            <Flame className="w-3" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl font-bold font-mono ${criticalCount > 0 ? 'text-red-500' : 'text-white'}`}>
            {criticalCount}
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">GUT ≥ 60</span>
        </div>
      </div>

      {/* Metric 3: In Progress */}
      <div id="stat-progress" className="bg-[#141414] border border-white/5 rounded-lg p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Em Atendimento</span>
          <div className="w-6 h-6 rounded bg-amber-500/5 text-amber-400 flex items-center justify-center">
            <Activity className="w-3 h-3" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono text-white">{inProgressCount}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">rodando</span>
        </div>
      </div>

      {/* Metric 4: Completed */}
      <div id="stat-completed" className="bg-[#141414] border border-white/5 rounded-lg p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Solucionados</span>
          <div className="w-6 h-6 rounded bg-emerald-500/5 text-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-3 h-3" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono text-white">{completedCount}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">concluídos</span>
        </div>
      </div>

      {/* Metric 5: Average Risk Index */}
      <div id="stat-avg" className="col-span-2 lg:col-span-1 bg-[#141414] border border-white/5 rounded-lg p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#6366f1]/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Carga Média Gút</span>
          <div className="w-6 h-6 rounded bg-indigo-500/5 text-indigo-400 flex items-center justify-center">
            <ShieldAlert className="w-3 h-3" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl font-bold font-mono ${
            avgScore >= 64 ? 'text-red-500' : avgScore >= 25 ? 'text-yellow-500' : 'text-green-500'
          }`}>
            {avgScore}
          </span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">score</span>
        </div>
      </div>
    </div>
  );
}
