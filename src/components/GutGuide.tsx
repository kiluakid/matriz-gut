/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info, AlertTriangle, Clock, TrendingUp, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { GUT_EXPLANATIONS } from '../data/defaultItems';

export default function GutGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'gravity' | 'urgency' | 'tendency'>('gravity');

  return (
    <div id="gut-reference-guide" className="bg-[#141414] border border-white/5 rounded-lg overflow-hidden transition-all duration-300">
      {/* Header Button */}
      <button
        id="gut-guide-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-sans font-medium text-gray-200 text-sm tracking-tight text-white uppercase text-xs tracking-wider">
              Glossário & Critérios de Avaliação GUT Elétrica
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Guia oficial de auxílio na atribuição dos pesos (1 a 5) para manutenção elétrica industrial
            </p>
          </div>
        </div>
        <div className="text-gray-400 p-1 hover:text-white transition-colors">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="gut-guide-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-white/5"
          >
            <div className="p-6">
              {/* Tabs */}
              <div id="guide-tabs" className="flex border-b border-white/5 mb-6 p-1 bg-[#0f0f0f] rounded">
                <button
                  id="tab-gravity"
                  onClick={() => setActiveTab('gravity')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded text-xs font-medium transition-all duration-200 cursor-pointer ${
                    activeTab === 'gravity'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Gravidade (G)
                </button>
                <button
                  id="tab-urgency"
                  onClick={() => setActiveTab('urgency')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded text-xs font-medium transition-all duration-200 cursor-pointer ${
                    activeTab === 'urgency'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Urgência (U)
                </button>
                <button
                  id="tab-tendency"
                  onClick={() => setActiveTab('tendency')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded text-xs font-medium transition-all duration-200 cursor-pointer ${
                    activeTab === 'tendency'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  Tendência (T)
                </button>
              </div>

              {/* Dynamic explanations */}
              <div id="guide-tab-pane" className="space-y-4">
                {GUT_EXPLANATIONS.map((exp) => (
                  <div
                    key={exp.level}
                    id={`guide-item-${exp.level}`}
                    className="flex flex-col md:flex-row items-stretch gap-4 p-4 rounded bg-[#1e1e1e] border border-white/5 hover:border-white/10 transition-all duration-200"
                  >
                    {/* Badge */}
                    <div className="flex md:flex-col items-center justify-between md:justify-center md:w-24 p-3 rounded bg-black/40 border border-white/5">
                      <span className="text-xs text-gray-500 font-mono uppercase tracking-widest font-bold">Nota</span>
                      <span className="text-2xl font-bold font-mono text-white">{exp.level}</span>
                    </div>

                    {/* Explanatory Text */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`text-[10px] tracking-wider uppercase px-2 py-0.5 rounded font-bold border ${exp.color}`}>
                          {exp.label}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans">
                        {activeTab === 'gravity' && exp.gravityDesc}
                        {activeTab === 'urgency' && exp.urgencyDesc}
                        {activeTab === 'tendency' && exp.tendencyDesc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div id="guia-calculo-info" className="mt-6 p-4 rounded bg-[#1e1717]/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5 block text-blue-400" />
                <div>
                  <span className="font-semibold block mb-0.5 uppercase tracking-wider text-xs">Cálculo de Prioridade Elétrica:</span>
                  A prioridade final é obtida multiplicando os fatores: <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-blue-400">G x U x T</code>. 
                  A escala oscila de <strong className="font-bold text-white">1 (Menor prioridade)</strong> até <strong className="font-bold text-white">125 (Máxima prioridade extrema)</strong>. 
                  Use pontuação acima de <strong className="font-bold text-red-400">60</strong> para atuar imediatamente em frentes de Segurança (NR10, NR12) ou risco crítico de parada no sistema.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
