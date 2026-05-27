/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, Plus, RotateCcw, Trash2, Download, Upload, 
  Wrench, ShieldCheck, AlertCircle, FileJson, Layers, Settings, X, RefreshCw
} from 'lucide-react';

import { GutItem, StatusType } from './types';
import { DEFAULT_GUT_ITEMS } from './data/defaultItems';
import GutGuide from './components/GutGuide';
import GutItemForm from './components/GutItemForm';
import GutStats from './components/GutStats';
import GutTable from './components/GutTable';

const LOCAL_STORAGE_KEY = 'industrial_gut_matrix_items';

export default function App() {
  const [items, setItems] = useState<GutItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GutItem | null>(null);
  const [currentTime, setCurrentTime] = useState('');
  
  // Importer state
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Status/Alert Message toast representation
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // Live ticking clock
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString('pt-BR', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load items from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as GutItem[];
        setItems(parsed);
      } else {
        // First load: Prefill with highly realistic electrical records
        setItems(DEFAULT_GUT_ITEMS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_GUT_ITEMS));
      }
    } catch (err) {
      console.error('Falha ao carregar itens do LocalStorage:', err);
      setItems(DEFAULT_GUT_ITEMS);
    }
  }, []);

  // Sync to localstorage helper
  const saveItems = (updatedItems: GutItem[]) => {
    setItems(updatedItems);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedItems));
  };

  // Toast notifier
  const triggerToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Add or Edit item submit handler
  const handleSaveItem = (formData: Omit<GutItem, 'id' | 'createdAt' | 'score'> & { id?: string }) => {
    const score = formData.gravity * formData.urgency * formData.tendency;

    if (formData.id) {
      // Edit mode
      const updated = items.map((item) => {
        if (item.id === formData.id) {
          return {
            ...item,
            ...formData,
            score,
          } as GutItem;
        }
        return item;
      });
      saveItems(updated);
      triggerToast('Registro de manutenção atualizado com sucesso!', 'success');
    } else {
      // Create mode
      const newItem: GutItem = {
        ...formData,
        id: Date.now().toString(),
        score,
        createdAt: new Date().toISOString(),
      };
      saveItems([newItem, ...items]);
      triggerToast('Nova ocorrência elétrica cadastrada!', 'success');
    }

    // Close form
    setIsFormOpen(false);
    setEditingItem(null);
  };

  // Duplicate an occurrence
  const handleDuplicate = (item: GutItem) => {
    const duplicated: GutItem = {
      ...item,
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      equipment: `${item.equipment} (Cópia)`,
      createdAt: new Date().toISOString(),
      status: 'pending', // default repeated as pending
    };

    saveItems([duplicated, ...items]);
    triggerToast('Ocorrência duplicada com sucesso!');
  };

  // Handle rapid G, U, or T adjustments directly from the table cards
  const handleUpdateValue = (id: string, field: 'gravity' | 'urgency' | 'tendency', value: number) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const partial = { ...item, [field]: value };
        const score = partial.gravity * partial.urgency * partial.tendency;
        return { ...partial, score } as GutItem;
      }
      return item;
    });
    saveItems(updated);
  };

  // Handle direct status updates
  const handleUpdateStatus = (id: string, status: StatusType) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });
    saveItems(updated);
    triggerToast(`Status alterado para ${status === 'completed' ? 'Resolvido' : status === 'in_progress' ? 'Em Andamento' : 'Pendente'}`, 'info');
  };

  // Delete an occurrence
  const handleDeleteItem = (id: string) => {
    const filtered = items.filter((item) => item.id !== id);
    saveItems(filtered);
    triggerToast('Registro de falha elétrica removido do quadro.', 'info');
    if (editingItem?.id === id) {
      setIsFormOpen(false);
      setEditingItem(null);
    }
  };

  // Restore factory defaults (Templates)
  const handleResetToDefault = () => {
    if (window.confirm('Tem certeza que deseja carregar os dados padrão de simulação da fábrica? Isso irá sobrescrever as alterações atuais.')) {
      saveItems(DEFAULT_GUT_ITEMS);
      triggerToast('Padrões de manutenção elétrica restaurados!', 'success');
    }
  };

  // Clear Database
  const handleClearDatabase = () => {
    if (window.confirm('ATENÇÃO: Deseja apagar TODOS os registros salvos da matriz GUT? Esta ação é irreversível.')) {
      saveItems([]);
      triggerToast('Banco de dados limpo com sucesso.', 'info');
    }
  };

  // Export as client-side JSON download
  const handleExportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `matriz_gut_eletrica_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast('Arquivo da matriz exportado com sucesso!', 'success');
    } catch (err) {
      triggerToast('Falha ao exportar matriz JSON', 'error');
    }
  };

  // Drag and drop events for importing
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file && file.type === "application/json" || file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          
          if (Array.isArray(parsed)) {
            // Basic validation
            const isValid = parsed.every(item => 
              typeof item === 'object' && 
              'equipment' in item && 
              'description' in item && 
              'gravity' in item && 
              'urgency' in item && 
              'tendency' in item
            );

            if (isValid) {
              // Standardize values & assign IDs if missing
              const prepared = parsed.map((item, idx) => ({
                id: item.id || `${Date.now()}-${idx}`,
                equipment: String(item.equipment),
                area: String(item.area || 'Geral'),
                description: String(item.description),
                gravity: Math.min(5, Math.max(1, Number(item.gravity || 3))),
                urgency: Math.min(5, Math.max(1, Number(item.urgency || 3))),
                tendency: Math.min(5, Math.max(1, Number(item.tendency || 3))),
                score: Number(item.gravity || 3) * Number(item.urgency || 3) * Number(item.tendency || 3),
                status: (item.status as StatusType) || 'pending',
                createdAt: item.createdAt || new Date().toISOString(),
                notes: item.notes || undefined,
                assignedTo: item.assignedTo || undefined
              })) as GutItem[];

              saveItems(prepared);
              setIsImporterOpen(false);
              setImportError(null);
              triggerToast(`${prepared.length} registros importados com sucesso!`, 'success');
            } else {
              setImportError('O arquivo JSON não segue a estrutura esperada para registros da matriz GUT.');
            }
          } else {
            setImportError('O JSON deve conter um array estruturado de itens.');
          }
        } catch (err) {
          setImportError('Erro ao decodificar arquivo JSON. Verifique a sintaxe.');
        }
      };
      reader.readAsText(file);
    } else {
      setImportError('Por favor, faça upload de um arquivo válido no formato JSON.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div id="electrical-gut-app" className="min-h-screen bg-[#0a0a0a] text-gray-200 selection:bg-blue-600/30 selection:text-white pb-16">
      
      {/* Subtle high-tech ambient blue indicator at top */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-600 via-indigo-500 to-transparent pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative space-y-8">
        
        {/* TOP COMPACT BAR - System Alerts / Info */}
        <div id="system-diagnostic-bar" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 pb-2 border-b border-white/5 text-[11px] uppercase tracking-wider font-semibold text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
            <span className="font-mono text-gray-400">STATUS: SISTEMA DE MONITORAMENTO ELÉTRICO ATIVO</span>
          </div>
          <div className="font-mono flex items-center gap-1.5 text-gray-400">
            <Wrench className="w-3.5 h-3.5 text-blue-500" />
            <span>RESPONSÁVEL: Siqueira Kaique (Manutenção Elétrica)</span>
          </div>
        </div>

        {/* HEADER SECTION - Elegant Dark Layout */}
        <header id="electrical-gut-header" className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white uppercase">
              MATRIZ <span className="font-black text-blue-500">GUT</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#a3a3a3] font-bold mt-1.5 flex items-center gap-2">
              <span className="inline-block w-4 h-0.5 bg-blue-500"></span>
              Gestão de Manutenção Elétrica Industrial Síncrona
            </p>
          </div>

          <div className="flex flex-col md:items-end text-left md:text-right gap-1.5">
            <div id="current-time" className="text-2xl font-mono text-white tracking-widest bg-white/5 px-3 py-1 rounded border border-white/5 font-extrabold">
              {currentTime || "14:20:05"}
            </div>
            <div className="text-[10px] uppercase text-blue-400 font-bold tracking-wider">
              Status: Alinhado com NR10 & NR12
            </div>
          </div>
        </header>

        {/* CONTROLS BAR: Backups & Simulation Loader (Now integrated elegantly below header) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#141414] border border-white/5 rounded-lg">
          <div className="text-xs text-gray-400 font-sans">
            Use os controles do painel para carregar simulações industriais, exportar backups em JSON ou importar registros.
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-header-add"
              onClick={() => {
                setEditingItem(null);
                setIsFormOpen(!isFormOpen);
              }}
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs uppercase font-bold tracking-wider transition-all active:scale-95 flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Nova Ocorrência
            </button>

            <button
              id="btn-header-defaults"
              onClick={handleResetToDefault}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all border border-white/5 bg-[#1a1a1a] focus:outline-none"
              title="Carregar Dados Padrões / Simulação"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-header-export"
              onClick={handleExportJSON}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded transition-all border border-white/5 bg-[#1a1a1a] focus:outline-none"
              title="Exportar em JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-header-import-indicator"
              onClick={() => setIsImporterOpen(!isImporterOpen)}
              className={`p-2 rounded transition-all border border-white/5 bg-[#1a1a1a] focus:outline-none ${
                isImporterOpen ? 'border-blue-500 text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white'
              }`}
              title="Importar Backup JSON"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button
              id="btn-header-clear"
              onClick={handleClearDatabase}
              className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all border border-white/5 bg-[#1a1a1a] focus:outline-none"
              title="Limpar Todos os Registros"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* METRICS DASHBOARD */}
        <section id="metrias-eletricas-section">
          <GutStats items={items} />
        </section>

        {/* EXPANDABLE CRITERIA REFERENCE GUIDE */}
        <section id="glossario-gut-section">
          <GutGuide />
        </section>

        {/* IMPORTER DRAWER (Drag and Drop JSON) */}
        <AnimatePresence>
          {isImporterOpen && (
            <motion.div
              id="importer-drawer"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#141414] border border-white/10 rounded-lg p-6 shadow-2xl relative"
            >
              <button
                id="btn-close-importer"
                onClick={() => {
                  setIsImporterOpen(false);
                  setImportError(null);
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <FileJson className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-sm text-gray-200 uppercase tracking-tight">Importação de Backup da Matriz GUT</h3>
                  <p className="text-xs text-gray-400">Insira um arquivo .json com a estrutura da matriz para carregar as ocorrências industriais instantaneamente.</p>
                </div>
              </div>

              {/* Drag and Drop Box */}
              <div
                id="drag-drop-zone"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded p-8 text-center cursor-pointer transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-500/5' 
                    : 'border-white/10 hover:border-white/25 bg-[#1e1e1e]'
                }`}
              >
                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-3" />
                <p className="text-xs sm:text-sm text-gray-300 font-medium">
                  Arraste e solte seu arquivo JSON aqui, ou <span className="text-blue-400 hover:underline">clique para selecionar</span>
                </p>
                <p className="text-[10px] text-gray-500 mt-1.5 font-mono">Formato requerido: .json</p>
                <input
                  ref={fileInputRef}
                  id="file-element-importer"
                  type="file"
                  accept=".json"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>

              {importError && (
                <div id="importer-error-alert" className="mt-4 p-3 bg-red-950/20 border border-red-500/20 text-xs text-red-150 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{importError}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* INPUT AND EDIT FORM ACCORDION */}
        <AnimatePresence>
          {(isFormOpen || editingItem) && (
            <motion.section
              id="gut-form-section"
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <GutItemForm
                initialItem={editingItem}
                onSave={handleSaveItem}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingItem(null);
                }}
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* MAIN DATABASE GRID TABLE */}
        <section id="tabela-matriz-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-blue-400" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 font-sans">
                Ocorrências de Manutenção Salvas
              </h2>
            </div>
            
            <div className="text-xs text-gray-500 font-mono">
              Registros salvos no navegador: <span className="text-gray-300 font-bold">{items.length}</span>
            </div>
          </div>

          <GutTable
            items={items}
            onEdit={(item) => {
              setEditingItem(item);
              setIsFormOpen(true);
              // scroll to form
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
            onDelete={handleDeleteItem}
            onDuplicate={handleDuplicate}
            onUpdateValue={handleUpdateValue}
            onUpdateStatus={handleUpdateStatus}
            onAddNewClick={() => {
              setEditingItem(null);
              setIsFormOpen(true);
            }}
          />
        </section>

      </div>

      {/* FIXED FOOTER SYSTEM LOGS */}
      <footer id="gut-footer-diagnostics" className="mt-16 border-t border-[#141520] pt-6 opacity-60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500/80" />
            <span>Engenharia de Confiabilidade & Manutenção Elétrica Industrial</span>
          </div>
          <div>
            <span>Matriz GUT v1.2.0 • Local Storage Ativo</span>
          </div>
        </div>
      </footer>

      {/* FLOAT ACTION TOAST ALERT Representation */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            id="toast-notification-banner"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl border shadow-2xl flex items-center gap-2.5 max-w-sm md:max-w-md ${
              toastMsg.type === 'error'
                ? 'bg-red-950/90 border-red-500/30 text-red-200'
                : toastMsg.type === 'info'
                ? 'bg-indigo-950/90 border-indigo-500/30 text-indigo-200'
                : 'bg-[#12131a]/95 border-emerald-500/30 text-emerald-200'
            }`}
          >
            <Zap className={`w-4 h-4 ${toastMsg.type === 'error' ? 'text-red-400' : 'text-emerald-400'}`} />
            <span className="text-xs font-sans font-medium">{toastMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
