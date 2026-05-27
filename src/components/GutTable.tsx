/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GutItem, GutScoreRange, StatusType } from '../types';
import { 
  Search, SlidersHorizontal, Trash2, Edit2, Copy, AlertTriangle, 
  Clock, TrendingUp, CheckCircle, ShieldAlert, ArrowUpDown, Calendar, MonitorPlay, Check, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GutTableProps {
  items: GutItem[];
  onEdit: (item: GutItem) => void;
  onDelete: (id: string) => void;
  onDuplicate: (item: GutItem) => void;
  onUpdateValue: (id: string, field: 'gravity' | 'urgency' | 'tendency', value: number) => void;
  onUpdateStatus: (id: string, status: StatusType) => void;
  onAddNewClick: () => void;
}

type SortField = 'score' | 'createdAt' | 'equipment' | 'gravity';

export default function GutTable({ 
  items, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onUpdateValue, 
  onUpdateStatus,
  onAddNewClick
}: GutTableProps) {
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<GutScoreRange>('all');
  const [statusFilter, setStatusFilter] = useState<StatusType | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortAsc, setSortAsc] = useState(false); // Default desc

  // Handle live score boundaries
  const handleScoreTweak = (id: string, field: 'gravity' | 'urgency' | 'tendency', currentVal: number, direction: 'inc' | 'dec') => {
    let newVal = currentVal;
    if (direction === 'inc' && currentVal < 5) newVal = currentVal + 1;
    if (direction === 'dec' && currentVal > 1) newVal = currentVal - 1;
    if (newVal !== currentVal) {
      onUpdateValue(id, field, newVal);
    }
  };

  // Status helper colors
  const getStatusBadge = (status: StatusType, itemId: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <Check className="w-3 h-3" /> Solucionado
          </span>
        );
      case 'in_progress':
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Em Andamento
          </span>
        );
      case 'pending':
        default:
          return (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Pendente / LOTO
            </span>
          );
    }
  };

  // Color helper for GUT index score
  const getScoreStyle = (score: number) => {
    if (score >= 64) {
      return {
        bg: 'bg-rose-500/10 border-rose-500/40 text-rose-400',
        badge: 'bg-rose-500 text-[#090a0f] font-bold',
        indicator: 'border-l-4 border-l-rose-500',
        text: 'text-rose-400'
      };
    }
    if (score >= 27) {
      return {
        bg: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
        badge: 'bg-amber-500 text-[#090a0f] font-bold',
        indicator: 'border-l-4 border-l-amber-500',
        text: 'text-amber-400'
      };
    }
    return {
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      badge: 'bg-emerald-500 text-[#090a0f] font-bold',
      indicator: 'border-l-4 border-l-emerald-500',
      text: 'text-emerald-400'
    };
  };

  // Filter items based on user criteria
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.equipment.toLowerCase().includes(search.toLowerCase()) ||
      item.area.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      (item.assignedTo && item.assignedTo.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    let matchesPriority = true;
    if (priorityFilter === 'high') matchesPriority = item.score >= 60;
    else if (priorityFilter === 'medium') matchesPriority = item.score >= 27 && item.score < 60;
    else if (priorityFilter === 'low') matchesPriority = item.score < 27;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let matchA: any = a[sortField];
    let matchB: any = b[sortField];

    if (sortField === 'createdAt') {
      matchA = new Date(a.createdAt).getTime();
      matchB = new Date(b.createdAt).getTime();
    } else if (typeof matchA === 'string') {
      matchA = matchA.toLowerCase();
      matchB = matchB.toLowerCase();
    }

    if (sortAsc) {
      return matchA > matchB ? 1 : -1;
    } else {
      return matchA < matchB ? 1 : -1;
    }
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for raw numbers
    }
  };

  return (
    <div id="gut-matrix-table-root" className="space-y-6">
      {/* Search & Filtering Suite */}
      <div id="controls-bar" className="bg-[#141414] border border-white/5 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3.5 text-gray-500 w-4 h-4" />
          <input
            id="table-search-input"
            type="text"
            placeholder="Pesquisar por equipamento, setor, técnico ou sintoma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded pl-10 pr-4 py-3 text-xs md:text-sm text-gray-200 placeholder-gray-500 focus:border-blue-500/50 focus:outline-none transition-all"
          />
        </div>

        {/* Priority Filter Trigger Tabs */}
        <div className="flex bg-[#0a0a0a] border border-white/10 p-1 rounded gap-1 overflow-x-auto self-start md:self-auto shrink-0">
          <button
            id="filter-pri-all"
            onClick={() => setPriorityFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              priorityFilter === 'all'
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Todos
          </button>
          <button
            id="filter-pri-high"
            onClick={() => setPriorityFilter('high')}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              priorityFilter === 'high'
                ? 'bg-red-500/10 text-red-505 border border-red-500/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Críticos (≥60)
          </button>
          <button
            id="filter-pri-med"
            onClick={() => setPriorityFilter('medium')}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              priorityFilter === 'medium'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Médios (27-59)
          </button>
          <button
            id="filter-pri-low"
            onClick={() => setPriorityFilter('low')}
            className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              priorityFilter === 'low'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Baixos (&lt;27)
          </button>
        </div>

        {/* Status Dropdown */}
        <div className="flex gap-2">
          <select
            id="filter-status-dropdown"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusType | 'all')}
            className="bg-[#0a0a0a] border border-white/10 text-xs text-gray-300 rounded px-3 py-2 focus:border-blue-500/50 focus:outline-none cursor-pointer font-bold uppercase tracking-wider"
          >
            <option value="all">Status: Todos</option>
            <option value="pending">Pendente / LOTO</option>
            <option value="in_progress">Em Andamento</option>
            <option value="completed">Solucionado</option>
          </select>

          {/* Sort Controller Trigger */}
          <button
            id="sort-toggle-score"
            onClick={() => toggleSort('score')}
            className={`px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider ${
              sortField === 'score' ? 'border-blue-500 text-blue-400 bg-blue-500/10' : ''
            }`}
            title="Ordenar por Score GUT"
          >
            GUT <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {sortedItems.length === 0 ? (
        <div id="no-items-state" className="flex flex-col items-center justify-center py-16 px-6 bg-[#141414] border border-dashed border-white/10 rounded text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-gray-600 stroke-[1.5]" />
          <div>
            <h4 className="text-gray-350 font-bold text-sm uppercase tracking-wider">Nenhum registro encontrado</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              Experimente ajustar os filtros ou cadastrar uma nova ocorrência elétrica para preencher o quadro de manutenção.
            </p>
          </div>
          <button
            id="btn-blankslate-add"
            onClick={onAddNewClick}
            className="px-4 py-2 bg-[#1e1e1e] hover:bg-[#2e2e2e] text-xs uppercase font-bold tracking-wider text-white border border-white/10 transition-all rounded flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-blue-400" />
            Criar Ocorrência
          </button>
        </div>
      ) : (
        <div id="gut-cards-grid" className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {sortedItems.map((item) => {
              const styles = getScoreStyle(item.score);

              return (
                <motion.div
                  key={item.id}
                  id={`item-card-${item.id}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-[#141414] border border-white/5 hover:border-white/10 rounded p-5 transition-all duration-300 relative flex flex-col justify-between ${styles.indicator}`}
                >
                  {/* Card Main Block */}
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-extrabold tracking-widest font-mono uppercase bg-[#1e1e1e] text-blue-400 border border-white/5 px-2 py-0.5 rounded">
                            {item.area}
                          </span>
                          <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">
                            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <h4 className="font-sans font-bold text-white text-base leading-snug tracking-tight">
                          {item.equipment}
                        </h4>
                      </div>
                      
                      {/* Action status select & badge */}
                      <div className="flex flex-col items-end gap-1.5 self-center shrink-0">
                        {/* Quick custom selection or badge */}
                        <select
                          id={`status-dropdown-${item.id}`}
                          value={item.status}
                          onChange={(e) => onUpdateStatus(item.id, e.target.value as StatusType)}
                          className="bg-[#0a0a0a] border border-white/10 hover:border-white/20 font-mono text-[10px] uppercase font-bold text-gray-300 rounded px-1.5 py-1 focus:outline-none cursor-pointer"
                        >
                          <option value="pending">Pendente (LOTO)</option>
                          <option value="in_progress">Em Andamento</option>
                          <option value="completed">Resolvido</option>
                        </select>
                        <div id={`status-badge-container-${item.id}`}>
                          {getStatusBadge(item.status, item.id)}
                        </div>
                      </div>
                    </div>

                    {/* Technical Description */}
                    <p className="text-xs text-gray-400 leading-relaxed font-sans mt-3.5 mb-5 bg-[#0a0a0a] p-3 rounded border border-white/5">
                      {item.description}
                    </p>

                    {/* INTERACTIVE GUT TWEAKER PANEL */}
                    <div className="bg-[#0a0a0a] p-3 rounded border border-white/5 grid grid-cols-3 gap-2.5 items-center mb-4">
                      {/* Gravity Controller */}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 flex items-center gap-0.5 mb-1.5 self-start px-1.5">
                          <AlertTriangle className="w-2.5 h-2.5 text-red-500" /> Gravidade
                        </span>
                        <div className="flex items-center bg-[#1e1e1e] rounded border border-white/5 p-0.5 w-full justify-between">
                          <button
                            id={`btn-dec-g-${item.id}`}
                            onClick={() => handleScoreTweak(item.id, 'gravity', item.gravity, 'dec')}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold transition-all focus:outline-none cursor-pointer"
                            title="Diminuir Gravidade"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-black text-white">{item.gravity}</span>
                          <button
                            id={`btn-inc-g-${item.id}`}
                            onClick={() => handleScoreTweak(item.id, 'gravity', item.gravity, 'inc')}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold transition-all focus:outline-none cursor-pointer"
                            title="Aumentar Gravidade"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Urgency Controller */}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 flex items-center gap-0.5 mb-1.5 self-start px-1.5">
                          <Clock className="w-2.5 h-2.5 text-amber-500" /> Urgência
                        </span>
                        <div className="flex items-center bg-[#1e1e1e] rounded border border-white/5 p-0.5 w-full justify-between">
                          <button
                            id={`btn-dec-u-${item.id}`}
                            onClick={() => handleScoreTweak(item.id, 'urgency', item.urgency, 'dec')}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold transition-all focus:outline-none cursor-pointer"
                            title="Diminuir Urgência"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-black text-white">{item.urgency}</span>
                          <button
                            id={`btn-inc-u-${item.id}`}
                            onClick={() => handleScoreTweak(item.id, 'urgency', item.urgency, 'inc')}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold transition-all focus:outline-none cursor-pointer"
                            title="Aumentar Urgência"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Tendency Controller */}
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-500 flex items-center gap-0.5 mb-1.5 self-start px-1.5">
                          <TrendingUp className="w-2.5 h-2.5 text-blue-500" /> Tendência
                        </span>
                        <div className="flex items-center bg-[#1e1e1e] rounded border border-white/5 p-0.5 w-full justify-between">
                          <button
                            id={`btn-dec-t-${item.id}`}
                            onClick={() => handleScoreTweak(item.id, 'tendency', item.tendency, 'dec')}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold transition-all focus:outline-none cursor-pointer"
                            title="Diminuir Tendência"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-black text-white">{item.tendency}</span>
                          <button
                            id={`btn-inc-t-${item.id}`}
                            onClick={() => handleScoreTweak(item.id, 'tendency', item.tendency, 'inc')}
                            className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 text-xs font-bold transition-all focus:outline-none cursor-pointer"
                            title="Aumentar Tendência"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Tools */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-auto">
                    {/* Assigned info */}
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase text-gray-500 font-extrabold tracking-wider">Responsável</span>
                      <span className="text-xs text-gray-300 font-sans font-semibold">
                        {item.assignedTo || 'Não definido'}
                      </span>
                    </div>

                    {/* Actions and Score Indicator */}
                    <div className="flex items-center gap-3">
                      {/* Action buttons */}
                      <div className="flex items-center bg-[#0a0a0a] border border-white/10 rounded p-0.5">
                        <button
                          id={`btn-edit-item-${item.id}`}
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all focus:outline-none cursor-pointer"
                          title="Editar Registro Completo"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-duplicate-item-${item.id}`}
                          onClick={() => onDuplicate(item)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-all focus:outline-none cursor-pointer"
                          title="Duplicar Item"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-item-${item.id}`}
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all focus:outline-none cursor-pointer"
                          title="Remover Registro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Floating dynamic circular indicator badge representation */}
                      <div 
                        id={`score-badge-${item.id}`}
                        className={`w-12 h-12 rounded-full flex flex-col items-center justify-center border font-mono shadow ${styles.bg}`}
                        title="Prioridade Final (G x U x T)"
                      >
                        <span className="text-[8px] uppercase tracking-widest text-[#a3a3a3] font-bold">GUT</span>
                        <span className="text-sm font-black tracking-tighter leading-none mt-0.5">{item.score}</span>
                      </div>
                    </div>
                  </div>

                  {item.notes && (
                    <div id={`notes-preview-${item.id}`} className="mt-3 text-[10px] text-gray-400 italic bg-[#0a0a0a] px-3 py-1.5 rounded border border-white/5 flex items-start gap-1">
                      <span className="font-bold uppercase text-[9px] tracking-wider text-gray-500 select-none shrink-0">Notas:</span>
                      <span className="truncate">{item.notes}</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
