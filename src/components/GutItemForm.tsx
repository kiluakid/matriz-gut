/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GutItem, StatusType } from '../types';
import { X, Save, AlertTriangle, Clock, TrendingUp, Sliders, Zap } from 'lucide-react';

interface GutItemFormProps {
  initialItem?: GutItem | null;
  onSave: (item: Omit<GutItem, 'id' | 'createdAt' | 'score'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function GutItemForm({ initialItem, onSave, onCancel }: GutItemFormProps) {
  const [equipment, setEquipment] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [gravity, setGravity] = useState(3);
  const [urgency, setUrgency] = useState(3);
  const [tendency, setTendency] = useState(3);
  const [status, setStatus] = useState<StatusType>('pending');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');

  // Live score calculation
  const liveScore = gravity * urgency * tendency;

  // Sync state if editing
  useEffect(() => {
    if (initialItem) {
      setEquipment(initialItem.equipment);
      setArea(initialItem.area);
      setDescription(initialItem.description);
      setGravity(initialItem.gravity);
      setUrgency(initialItem.urgency);
      setTendency(initialItem.tendency);
      setStatus(initialItem.status);
      setAssignedTo(initialItem.assignedTo || '');
      setNotes(initialItem.notes || '');
    } else {
      // Clear forms
      setEquipment('');
      setArea('');
      setDescription('');
      setGravity(3);
      setUrgency(3);
      setTendency(3);
      setStatus('pending');
      setAssignedTo('');
      setNotes('');
    }
  }, [initialItem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipment.trim() || !description.trim()) return;

    onSave({
      id: initialItem?.id,
      equipment,
      area,
      description,
      gravity,
      urgency,
      tendency,
      status,
      assignedTo: assignedTo.trim() || undefined,
      notes: notes.trim() || undefined,
    });
  };

  // Color helper for preview score
  const getScoreColor = (score: number) => {
    if (score >= 64) return 'from-rose-500/20 to-rose-600/10 border-rose-500/30 text-rose-400';
    if (score >= 27) return 'from-amber-500/15 to-amber-600/5 border-amber-500/30 text-amber-400';
    return 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400';
  };

  const getPriorityLabel = (score: number) => {
    if (score >= 80) return 'Extrema (Crítica)';
    if (score >= 60) return 'Alta';
    if (score >= 27) return 'Média';
    return 'Baixa';
  };

  const levels = [1, 2, 3, 4, 5];  return (
    <div id="gut-item-form-container" className="bg-[#141414] border border-white/10 rounded shadow-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />
      
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
        <div>
          <h3 className="font-sans font-bold text-lg text-white uppercase tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block animate-pulse" />
            {initialItem ? 'Editar Ocorrência' : 'Cadastrar Nova Ocorrência'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {initialItem ? 'Modifique os parâmetros e o cálculo será atualizado automaticamente.' : 'Crie um registro elétrico informando local, gravidade, urgência e tendência.'}
          </p>
        </div>
        <button
          id="btn-form-cancel"
          onClick={onCancel}
          className="text-gray-400 hover:text-white bg-[#0a0a0a] hover:bg-white/5 p-2 rounded transition-colors border border-white/10 focus:outline-none cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" id="gut-entry-form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Base Meta Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5" htmlFor="equipment-input">
                Equipamento / Ativo *
              </label>
              <input
                id="equipment-input"
                type="text"
                required
                placeholder="Ex: Motor de Indução M3 (Injetora 5), Cabine Primária T1"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-blue-500/50 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5" htmlFor="area-input">
                Setor / Área Elétrica
              </label>
              <input
                id="area-input"
                type="text"
                placeholder="Ex: Utilidades, Linha B de Estamparia, Subestação"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-blue-500/50 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5" htmlFor="description-input">
                Falha / Descrição Técnica *
              </label>
              <textarea
                id="description-input"
                required
                rows={3}
                placeholder="Descreva o problema elétrico, sintomas de aquecimento, vibrações, perdas de cabos ou falhas de retenção física..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-blue-500/50 focus:outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5" htmlFor="assigned-input">
                  Responsável / Executor
                </label>
                <input
                  id="assigned-input"
                  type="text"
                  placeholder="Ex: Técnico Kaique"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-blue-500/50 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5" htmlFor="status-select">
                  Status Inicial
                </label>
                <select
                  id="status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusType)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded px-3 py-2.5 text-sm text-gray-200 focus:border-blue-500/50 focus:outline-none transition-all cursor-pointer"
                >
                  <option value="pending">Pendente / Bloqueado</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Resolvido (OK)</option>
                </select>
              </div>
            </div>
          </div>

          {/* GUT Parametric Controls */}
          <div className="space-y-5 bg-[#0a0a0a] p-5 rounded border border-white/10 relative">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-500" /> Fatores da Prioridade GUT
            </h4>

            {/* Gravity Slider Slider buttons */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  Gravidade (G)
                </span>
                <span className="text-xs text-red-400 font-mono font-bold uppercase">Nota: {gravity}</span>
              </div>
              <div className="flex justify-between gap-1">
                {levels.map((lvl) => (
                  <button
                    key={`G-${lvl}`}
                    type="button"
                    onClick={() => setGravity(lvl)}
                    className={`flex-1 py-2 text-xs font-mono font-bold rounded border transition-all cursor-pointer ${
                      gravity === lvl
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : 'bg-[#1e1e1e] text-gray-500 border-transparent hover:border-white/5'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">
                {gravity === 1 && 'Sem danos de produção ou risco pessoal.'}
                {gravity === 2 && 'Danos leves, fáceis de resolver em linha.'}
                {gravity === 3 && 'Parada de máquina parcial, custo médio.'}
                {gravity === 4 && 'Prejuízo expressivo ou risco elétrico moderado.'}
                {gravity === 5 && 'Acidente grave, explosão, ou multas pesadas. Risco à integridade.'}
              </p>
            </div>

            {/* Urgency Sliders */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  Urgência (U)
                </span>
                <span className="text-xs text-amber-500 font-mono font-bold uppercase">Nota: {urgency}</span>
              </div>
              <div className="flex justify-between gap-1">
                {levels.map((lvl) => (
                  <button
                    key={`U-${lvl}`}
                    type="button"
                    onClick={() => setUrgency(lvl)}
                    className={`flex-1 py-2 text-xs font-mono font-bold rounded border transition-all cursor-pointer ${
                      urgency === lvl
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-[#1e1e1e] text-gray-500 border-transparent hover:border-white/5'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">
                {urgency === 1 && 'Pode aguardar cronogramas bem futuros.'}
                {urgency === 2 && 'Prazo confortável de alguns dias.'}
                {urgency === 3 && 'Ação necessária nos próximos turnos.'}
                {urgency === 4 && 'Apressar atuação. Linha opera com gargalo térmico.'}
                {urgency === 5 && 'Atuação imediata necessária. Risco elétrico ativo agora.'}
              </p>
            </div>

            {/* Tendency Sliders */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                  Tendência (T)
                </span>
                <span className="text-xs text-blue-400 font-mono font-bold uppercase">Nota: {tendency}</span>
              </div>
              <div className="flex justify-between gap-1">
                {levels.map((lvl) => (
                  <button
                    key={`T-${lvl}`}
                    type="button"
                    onClick={() => setTendency(lvl)}
                    className={`flex-1 py-2 text-xs font-mono font-bold rounded border transition-all cursor-pointer ${
                      tendency === lvl
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-[#1e1e1e] text-gray-500 border-transparent hover:border-white/5'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 leading-tight">
                {tendency === 1 && 'O desgaste e aquecimento não se expandem.'}
                {tendency === 2 && 'Degradação acumulada no decorrer de meses.'}
                {tendency === 3 && 'Problema piorará gradualmente em semanas.'}
                {tendency === 4 && 'Problema evolui visivelmente em poucos dias.'}
                {tendency === 5 && 'Propagação iminente para interrupção ou perigo fulminante.'}
              </p>
            </div>

            {/* LIVE PRIORITY PREVIEW DIAL */}
            <div className={`mt-4 p-4 rounded border bg-gradient-to-r flex items-center justify-between transition-all duration-350 ${getScoreColor(liveScore)}`}>
              <div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#a3a3a3] block mb-0.5">Prioridade Calculada</span>
                <span className="text-sm font-bold uppercase block">{getPriorityLabel(liveScore)}</span>
                <span className="text-[10px] text-gray-400 mt-0.5 block font-mono">G ({gravity}) x U ({urgency}) x T ({tendency})</span>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[9px] font-mono text-[#a3a3a3] uppercase tracking-widest font-extrabold">Score GUT</div>
                <div className="text-3xl font-extrabold font-mono tracking-tight">{liveScore}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical notes & Submit button */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5" htmlFor="notes-input">
              Anotações Técnicas Adicionais (Recomendações e Observações de Medição)
            </label>
            <input
              id="notes-input"
              type="text"
              placeholder="Ex: Agendar termografia extra, aferir corrente elétrica com alicate amperímetro..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-blue-500/50 focus:outline-none transition-all"
            />
          </div>

          <div className="flex items-end gap-3 justify-end h-full">
            <button
              id="btn-confirm-cancel"
              type="button"
              onClick={onCancel}
              className="flex-1 md:flex-none px-5 py-3 rounded text-xs uppercase tracking-wider font-bold border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="btn-confirm-save"
              type="submit"
              className="flex-2 md:flex-none px-6 py-3 rounded text-xs uppercase tracking-wider font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/10 focus:outline-none cursor-pointer animate-pulse-slow"
            >
              <Save className="w-4 h-4" />
              Salvar Registro
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
