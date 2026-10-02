import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  FileText, 
  Printer, 
  TrendingUp, 
  Layers, 
  SlidersHorizontal, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Compass, 
  Layout, 
  Server, 
  Puzzle, 
  Rocket, 
  Eye, 
  Check, 
  Sparkles,
  ArrowRight,
  Briefcase
} from 'lucide-react';
import { 
  DEFAULT_AGENCY, 
  DEFAULT_CLIENT, 
  PROJECT_PHASES, 
  PROJECT_PRESETS 
} from '../../data/webappData';
import { 
  FiscalRegime, 
  PaymentSchedule, 
  AgencyInfo, 
  ClientInfo 
} from '../../types';

interface CustomPhaseItem {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  hours: number;
}

export const WebAppDemo: React.FC = () => {
  // Navigation tabs: 'config' (preventivatore WBS), 'document' (anteprima A4 cliente), 'profitability' (cruscotto interno)
  const [activeTab, setActiveTab] = useState<'config' | 'document' | 'profitability'>('config');

  // Agency & Client info state
  const [agencyInfo] = useState<AgencyInfo>(DEFAULT_AGENCY);
  const [clientInfo, setClientInfo] = useState<ClientInfo>(DEFAULT_CLIENT);

  // Selected Preset
  const [selectedPresetId, setSelectedPresetId] = useState<string>('preset-realestate');

  // Selected items from default phases: map of itemId -> hours
  const [itemHoursMap, setItemHoursMap] = useState<Record<string, number>>(() => {
    const initialPreset = PROJECT_PRESETS.find(p => p.id === 'preset-realestate') || PROJECT_PRESETS[0];
    const initialMap: Record<string, number> = {};
    PROJECT_PHASES.forEach(phase => {
      phase.items.forEach(item => {
        if (initialPreset.selectedItemIds.includes(item.id)) {
          initialMap[item.id] = item.defaultHours;
        }
      });
    });
    return initialMap;
  });

  // Custom items added by the agency
  const [customItems, setCustomItems] = useState<CustomPhaseItem[]>([]);

  // Rates & Financial parameters
  const [hourlyRate, setHourlyRate] = useState<number>(70); // €/ora di vendita
  const [internalCostPerHour, setInternalCostPerHour] = useState<number>(30); // €/ora costo interno medio
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [fiscalRegime, setFiscalRegime] = useState<FiscalRegime>('ordinario_22');
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule>('40_30_30');
  const [teamCapacityWeeklyHours, setTeamCapacityWeeklyHours] = useState<number>(35); // ore a settimana allocate

  // UI state for adding a custom item
  const [activeAddPhaseId, setActiveAddPhaseId] = useState<string | null>(null);
  const [newCustomTitle, setNewCustomTitle] = useState('');
  const [newCustomDesc, setNewCustomDesc] = useState('');
  const [newCustomHours, setNewCustomHours] = useState<number>(10);

  // Notification feedback
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Switch preset
  const handleSelectPreset = (presetId: string) => {
    const preset = PROJECT_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedPresetId(presetId);
    setHourlyRate(preset.recommendedHourlyRate);
    setClientInfo(prev => ({
      ...prev,
      projectTitle: preset.clientTitle,
      projectDescription: preset.description
    }));

    const newMap: Record<string, number> = {};
    PROJECT_PHASES.forEach(phase => {
      phase.items.forEach(item => {
        if (preset.selectedItemIds.includes(item.id)) {
          newMap[item.id] = item.defaultHours;
        }
      });
    });
    setItemHoursMap(newMap);
  };

  // Toggle item inclusion
  const toggleItem = (itemId: string, defaultHours: number) => {
    setItemHoursMap(prev => {
      const copy = { ...prev };
      if (copy[itemId] !== undefined) {
        delete copy[itemId];
      } else {
        copy[itemId] = defaultHours;
      }
      return copy;
    });
  };

  // Adjust item hours
  const updateItemHours = (itemId: string, newHours: number) => {
    const sanitized = Math.max(1, Math.round(newHours));
    setItemHoursMap(prev => ({
      ...prev,
      [itemId]: sanitized
    }));
  };

  // Add custom item to a phase
  const handleAddCustomItem = (phaseId: string) => {
    if (!newCustomTitle.trim()) return;
    const newItem: CustomPhaseItem = {
      id: `custom-${Date.now()}`,
      phaseId,
      title: newCustomTitle.trim(),
      description: newCustomDesc.trim() || 'Attività personalizzata concordata per le specifiche del progetto.',
      hours: Math.max(1, newCustomHours)
    };
    setCustomItems(prev => [...prev, newItem]);
    setNewCustomTitle('');
    setNewCustomDesc('');
    setNewCustomHours(10);
    setActiveAddPhaseId(null);
  };

  // Remove custom item
  const handleRemoveCustomItem = (customItemId: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== customItemId));
  };

  // Compute total hours & breakdowns per phase
  const phaseBreakdowns = useMemo(() => {
    return PROJECT_PHASES.map(phase => {
      const includedStandardItems = phase.items
        .filter(item => itemHoursMap[item.id] !== undefined)
        .map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: item.category,
          hours: itemHoursMap[item.id],
          isCustom: false
        }));

      const includedCustomItems = customItems
        .filter(item => item.phaseId === phase.id)
        .map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          category: 'Personalizzato',
          hours: item.hours,
          isCustom: true
        }));

      const allItems = [...includedStandardItems, ...includedCustomItems];
      const phaseHours = allItems.reduce((acc, item) => acc + item.hours, 0);
      const phaseSubtotal = phaseHours * hourlyRate;

      return {
        phase,
        items: allItems,
        totalHours: phaseHours,
        subtotalPrice: phaseSubtotal
      };
    });
  }, [itemHoursMap, customItems, hourlyRate]);

  // Overall Computations
  const totalHours = useMemo(() => {
    return phaseBreakdowns.reduce((acc, p) => acc + p.totalHours, 0);
  }, [phaseBreakdowns]);

  const daysEstimated = Math.ceil(totalHours / 8);
  const weeksEstimated = Math.ceil(totalHours / Math.max(1, teamCapacityWeeklyHours));

  const grossTotalPrice = totalHours * hourlyRate;
  const discountAmount = (grossTotalPrice * discountPercent) / 100;
  const netSubtotalPrice = Math.max(0, grossTotalPrice - discountAmount);

  // VAT / Fiscal Computations
  const vatRate = fiscalRegime === 'ordinario_22' ? 0.22 : 0;
  const vatAmount = netSubtotalPrice * vatRate;
  const documentTotalPrice = netSubtotalPrice + vatAmount;

  // Internal Cost & Profitability Computations
  const totalInternalCost = totalHours * internalCostPerHour;
  const netMarginEuro = Math.max(0, netSubtotalPrice - totalInternalCost);
  const marginPercentage = netSubtotalPrice > 0 ? ((netMarginEuro / netSubtotalPrice) * 100).toFixed(1) : '0';
  const breakEvenHourlyRate = totalHours > 0 ? (totalInternalCost / totalHours).toFixed(1) : '0';

  // Payment Schedule Breakdown
  const paymentBreakdown = useMemo(() => {
    if (paymentSchedule === '40_30_30') {
      return [
        { label: '40% - Acconto all’accettazione preventivo / avvio lavori', amount: documentTotalPrice * 0.4 },
        { label: '30% - Rilascio versione Beta & collaudo intermedio', amount: documentTotalPrice * 0.3 },
        { label: '30% - Collaudo finale, messa online & consegna credenziali', amount: documentTotalPrice * 0.3 }
      ];
    } else if (paymentSchedule === '50_50') {
      return [
        { label: '50% - Acconto alla firma contrattuale', amount: documentTotalPrice * 0.5 },
        { label: '50% - Saldo a collaudo e pubblicazione online', amount: documentTotalPrice * 0.5 }
      ];
    } else if (paymentSchedule === '30_40_30') {
      return [
        { label: '30% - Acconto all’approvazione del progetto', amount: documentTotalPrice * 0.3 },
        { label: '40% - Consegna milestone di sviluppo frontend e backend', amount: documentTotalPrice * 0.4 },
        { label: '30% - Rilascio in produzione e handover', amount: documentTotalPrice * 0.3 }
      ];
    } else {
      return [
        { label: '100% - Saldo anticipato con sconto cassa', amount: documentTotalPrice }
      ];
    }
  }, [paymentSchedule, documentTotalPrice]);

  // Copy formal email draft to clipboard
  const handleCopyFormalEmail = () => {
    const vatDescription = fiscalRegime === 'ordinario_22' 
      ? `+ IVA 22% (€${vatAmount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
      : '(Operazione non soggetta ad IVA ai sensi di legge)';

    const emailText = `Gentile ${clientInfo.contactPerson || clientInfo.companyName},

facendo seguito alla nostra recente analisi e agli obiettivi concordati, le trasmetto la proposta tecnica ed economica per il progetto:
"${clientInfo.projectTitle}".

RIEPILOGO DELLA PROPOSTA:
- Numero Preventivo: ${clientInfo.quoteNumber}
- Ore stimate di sviluppo: ${totalHours} ore (${daysEstimated} giornate lavorative)
- Tempi di consegna stimati: circa ${weeksEstimated} settimane dall'avvio lavori
- Tariffa oraria applicata: €${hourlyRate},00/h
- Imponibile Lavori: €${netSubtotalPrice.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${vatDescription}
- TOTALE DOCUMENTO: €${documentTotalPrice.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

FASI DI SVILUPPO PREVISTE:
${phaseBreakdowns.filter(p => p.items.length > 0).map(p => `• Fase ${p.phase.phaseNumber}: ${p.phase.name} (${p.totalHours}h)`).join('\n')}

CONDIZIONI DI PAGAMENTO:
${paymentBreakdown.map(p => `- ${p.label}: €${p.amount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`).join('\n')}

L'offerta è valida per ${clientInfo.validityDays} giorni dalla data di emissione. Restiamo a sua completa disposizione per qualsiasi chiarimento o per concordare la data di avvio delle attività.

Cordiali saluti,
${agencyInfo.name}
${agencyInfo.website} | Tel: ${agencyInfo.phone}`;

    navigator.clipboard.writeText(emailText);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  const getPhaseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="w-5 h-5 text-indigo-600" />;
      case 'Layout': return <Layout className="w-5 h-5 text-blue-600" />;
      case 'Server': return <Server className="w-5 h-5 text-emerald-600" />;
      case 'Puzzle': return <Puzzle className="w-5 h-5 text-amber-600" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-purple-600" />;
      case 'Rocket': return <Rocket className="w-5 h-5 text-rose-600" />;
      default: return <Layers className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-20">
      
      {/* Top Header & Studio Identity (Corporate Clean White) */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Agency Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">QuickQuote</span>
                <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Studio Edition
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Preventivatore Analitico & Controllo di Gestione Commesse
              </p>
            </div>
          </div>

          {/* Navigation View Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('config')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
              <span>1. Configura Commessa (WBS)</span>
            </button>

            <button
              onClick={() => setActiveTab('document')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'document'
                  ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Preventivo Ufficiale Cliente</span>
            </button>

            <button
              onClick={() => setActiveTab('profitability')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profitability'
                  ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>3. Redditività & Margini</span>
            </button>
          </div>

          {/* Right quick actions */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 transition-colors cursor-pointer shadow-xs"
              title="Stampa o Salva in PDF il documento formale per il cliente"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Stampa / Salva PDF</span>
            </button>

            <button
              onClick={handleCopyFormalEmail}
              className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
              title="Copia negli appunti il testo formale di accompagnamento per email"
            >
              {copiedEmail ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Email Copiata!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Copia Bozza Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: CONFIGURATION & WBS (WORK BREAKDOWN STRUCTURE) */}
        {/* ========================================================================= */}
        {activeTab === 'config' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Bar: Template Switcher & Project Quick Setup */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Modelli di Commessa Aziendale (Preset Rapidi)</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Carica un'architettura di progetto standard con ore stimate e fasi raccomandate.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Modello in uso:</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {PROJECT_PRESETS.find(p => p.id === selectedPresetId)?.name}
                  </span>
                </div>
              </div>

              {/* Preset Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {PROJECT_PRESETS.map(preset => {
                  const isCurrent = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-indigo-50/50 border-indigo-400 shadow-xs ring-1 ring-indigo-400/30'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-xs font-bold ${isCurrent ? 'text-indigo-900' : 'text-slate-800'}`}>
                            {preset.name}
                          </span>
                          {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {preset.subtitle}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-mono-num font-medium">
                        <span>€{preset.recommendedHourlyRate}/h</span>
                        <span>~{preset.estimatedWeeks} settimane</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Client and Project Header Data */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Anagrafica Commessa & Dati Cliente</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Cliente / Ragione Sociale
                  </label>
                  <input
                    type="text"
                    value={clientInfo.companyName}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Referente Aziendale
                  </label>
                  <input
                    type="text"
                    value={clientInfo.contactPerson}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, contactPerson: e.target.value }))}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Numero Preventivo & Data
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={clientInfo.quoteNumber}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, quoteNumber: e.target.value }))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono-num font-semibold shadow-xs"
                    />
                    <input
                      type="date"
                      value={clientInfo.quoteDate}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, quoteDate: e.target.value }))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono-num shadow-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Titolo & Oggetto dell'Incarico
                </label>
                <input
                  type="text"
                  value={clientInfo.projectTitle}
                  onChange={(e) => setClientInfo(prev => ({ ...prev, projectTitle: e.target.value }))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-medium shadow-xs"
                />
              </div>
            </div>

            {/* 2-Column: Phase Breakdown (WBS) & Sticky Financial Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: 6 Structured Project Phases (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <span>Scomposizione Fasi di Lavoro (WBS)</span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Seleziona le attività previste e regola la stima ore per ciascuna voce.
                    </p>
                  </div>

                  <span className="text-xs font-mono-num text-indigo-800 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full font-bold">
                    {totalHours} ore complessive
                  </span>
                </div>

                {/* Iterate Phases */}
                <div className="space-y-4">
                  {phaseBreakdowns.map(({ phase, items, totalHours: phaseHours, subtotalPrice: phasePrice }) => {
                    const isAddingCustom = activeAddPhaseId === phase.id;

                    return (
                      <div 
                        key={phase.id}
                        className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4"
                      >
                        {/* Phase Header */}
                        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                              {getPhaseIcon(phase.iconName)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-mono-num">
                                  Fase {phase.phaseNumber}
                                </span>
                                <h4 className="text-sm font-bold text-slate-900">
                                  {phase.name}
                                </h4>
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {phase.description}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold font-mono-num text-slate-900">
                              €{phasePrice.toLocaleString('it-IT')}
                            </div>
                            <div className="text-[11px] font-mono-num text-slate-500">
                              {phaseHours} ore
                            </div>
                          </div>
                        </div>

                        {/* Items List in Phase */}
                        <div className="space-y-2.5">
                          {phase.items.map(item => {
                            const isSelected = itemHoursMap[item.id] !== undefined;
                            const currentHours = itemHoursMap[item.id] ?? item.defaultHours;
                            const itemPrice = currentHours * hourlyRate;

                            return (
                              <div
                                key={item.id}
                                className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                                  isSelected
                                    ? 'bg-slate-50/70 border-slate-300 shadow-xs'
                                    : 'bg-white border-slate-200/80 opacity-60 hover:opacity-100'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() => toggleItem(item.id, item.defaultHours)}
                                    className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center cursor-pointer transition-colors ${
                                      isSelected
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'border border-slate-300 bg-white text-transparent hover:border-slate-400'
                                    }`}
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>

                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                        {item.category}
                                      </span>
                                      {item.recommended && (
                                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                          Raccomandato
                                        </span>
                                      )}
                                    </div>
                                    <h5 className="text-xs font-bold text-slate-900 mt-1">
                                      {item.title}
                                    </h5>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Hours adjustment & subtotal */}
                                <div className="text-right shrink-0 flex flex-col items-end justify-between self-stretch">
                                  <div className="text-xs font-mono-num font-bold text-slate-900">
                                    €{itemPrice.toLocaleString('it-IT')}
                                  </div>

                                  {isSelected ? (
                                    <div className="flex items-center gap-1.5 mt-2 bg-white border border-slate-300 px-1.5 py-0.5 rounded-lg shadow-xs">
                                      <button
                                        onClick={() => updateItemHours(item.id, currentHours - 2)}
                                        className="w-4 h-4 flex items-center justify-center text-slate-500 hover:text-slate-900 text-xs font-bold cursor-pointer"
                                        title="Riduci di 2 ore"
                                      >
                                        -
                                      </button>
                                      <input
                                        type="number"
                                        min="1"
                                        max="200"
                                        value={currentHours}
                                        onChange={(e) => updateItemHours(item.id, Number(e.target.value))}
                                        className="w-8 text-center bg-transparent text-xs font-mono-num font-bold text-indigo-700 focus:outline-none"
                                      />
                                      <span className="text-[10px] text-slate-400 font-mono-num">h</span>
                                      <button
                                        onClick={() => updateItemHours(item.id, currentHours + 2)}
                                        className="w-4 h-4 flex items-center justify-center text-slate-500 hover:text-slate-900 text-xs font-bold cursor-pointer"
                                        title="Aumenta di 2 ore"
                                      >
                                        +
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] font-mono-num text-slate-400 mt-2">
                                      {item.defaultHours}h stimate
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Custom added items in this phase */}
                          {customItems
                            .filter(ci => ci.phaseId === phase.id)
                            .map(customItem => (
                              <div
                                key={customItem.id}
                                className="p-3.5 rounded-xl border bg-indigo-50/40 border-indigo-200 shadow-xs flex items-start justify-between gap-3"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded mt-0.5 bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                                    +
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                                      Voce Personalizzata
                                    </span>
                                    <h5 className="text-xs font-bold text-slate-900 mt-1">
                                      {customItem.title}
                                    </h5>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                      {customItem.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right shrink-0 flex flex-col items-end justify-between self-stretch">
                                  <div className="text-xs font-mono-num font-bold text-slate-900">
                                    €{(customItem.hours * hourlyRate).toLocaleString('it-IT')}
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs font-mono-num font-bold text-slate-700">
                                      {customItem.hours}h
                                    </span>
                                    <button
                                      onClick={() => handleRemoveCustomItem(customItem.id)}
                                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                                      title="Rimuovi voce personalizzata"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Add custom item form or toggle button */}
                        {isAddingCustom ? (
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-3">
                            <div className="text-xs font-bold text-slate-900">
                              Aggiungi nuova attività a Fase {phase.phaseNumber}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                              <input
                                type="text"
                                placeholder="Titolo attività (es. Integrazione corriere o import dati)"
                                value={newCustomTitle}
                                onChange={(e) => setNewCustomTitle(e.target.value)}
                                className="sm:col-span-3 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                              />
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  placeholder="Ore"
                                  value={newCustomHours}
                                  onChange={(e) => setNewCustomHours(Number(e.target.value))}
                                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-mono-num font-bold"
                                />
                                <span className="text-xs text-slate-500 font-mono-num">ore</span>
                              </div>
                            </div>
                            <textarea
                              rows={2}
                              placeholder="Descrizione dettagliata dell'attività concordata..."
                              value={newCustomDesc}
                              onChange={(e) => setNewCustomDesc(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setActiveAddPhaseId(null)}
                                className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
                              >
                                Annulla
                              </button>
                              <button
                                onClick={() => handleAddCustomItem(phase.id)}
                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-xs"
                              >
                                Inserisci nel Computo
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveAddPhaseId(phase.id);
                              setNewCustomTitle('');
                              setNewCustomDesc('');
                              setNewCustomHours(10);
                            }}
                            className="w-full py-2 border border-dashed border-slate-300 hover:border-slate-400 rounded-xl text-xs text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-slate-50/50"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Aggiungi Attività Personalizzata a questa Fase</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Sticky Financial Controller & Commercial Terms (5 Cols) */}
              <div className="lg:col-span-5 space-y-6 sticky top-20">
                
                {/* Rates & Parameters Box */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                    <span>Parametri Economici & Tariffari</span>
                  </h3>

                  {/* Hourly Rate Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-slate-700 font-semibold">Tariffa Oraria di Vendita:</span>
                      <span className="font-mono-num font-bold text-indigo-700 text-sm">€{hourlyRate} / ora</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="140"
                      step="5"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono-num mt-0.5">
                      <span>€40/h (Junior)</span>
                      <span>€70/h (Senior)</span>
                      <span>€140/h (Tech Lead)</span>
                    </div>
                  </div>

                  {/* Commercial Discount */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="text-slate-700 font-semibold">Sconto Commerciale Concordato:</span>
                      <span className="font-mono-num font-bold text-emerald-700">{discountPercent}%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0, 5, 10, 15].map(disc => (
                        <button
                          key={disc}
                          onClick={() => setDiscountPercent(disc)}
                          className={`py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            discountPercent === disc
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold shadow-xs'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {disc === 0 ? 'Nessuno' : `${disc}%`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fiscal Regime (VAT) */}
                  <div className="border-t border-slate-100 pt-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Inquadramento Fiscale & Aliquota IVA:
                    </label>
                    <select
                      value={fiscalRegime}
                      onChange={(e) => setFiscalRegime(e.target.value as FiscalRegime)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium cursor-pointer shadow-xs"
                    >
                      <option value="ordinario_22">Regime Ordinario (IVA 22% a norma di legge)</option>
                      <option value="forfettario_0">Regime Forfettario (Esente IVA ex L. 190/2014)</option>
                      <option value="reverse_charge">Reverse Charge / Extra-UE (IVA non imponibile)</option>
                    </select>
                  </div>

                  {/* Payment Schedule Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Piano Pagamenti (Stato Avanzamento Lavori):
                    </label>
                    <select
                      value={paymentSchedule}
                      onChange={(e) => setPaymentSchedule(e.target.value as PaymentSchedule)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-medium cursor-pointer shadow-xs"
                    >
                      <option value="40_30_30">40% Acconto / 30% Beta / 30% Saldo a Consegna</option>
                      <option value="50_50">50% Acconto Avvio / 50% Saldo Pubblicazione</option>
                      <option value="30_40_30">30% Acconto / 40% Tranche Sviluppo / 30% Saldo</option>
                      <option value="100_anticipato">100% Saldo Anticipato</option>
                    </select>
                  </div>
                </div>

                {/* Formal Financial Summary Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Quadro Economico Commessa
                    </span>
                    <span className="text-xs font-mono-num font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                      {totalHours}h ({daysEstimated} gg)
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Totale Servizi Professionali:</span>
                      <span className="font-mono-num font-semibold text-slate-900">€{grossTotalPrice.toLocaleString('it-IT')}</span>
                    </div>

                    {discountPercent > 0 && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Sconto Commerciale ({discountPercent}%):</span>
                        <span className="font-mono-num font-semibold">-€{discountAmount.toLocaleString('it-IT')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-800 border-t border-slate-100 pt-1.5 font-semibold">
                      <span>Imponibile Netto:</span>
                      <span className="font-mono-num">€{netSubtotalPrice.toLocaleString('it-IT')}</span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>
                        {fiscalRegime === 'ordinario_22' ? 'IVA Ordinaria (22%):' : 'IVA (Esente / 0%):'}
                      </span>
                      <span className="font-mono-num">€{vatAmount.toLocaleString('it-IT')}</span>
                    </div>

                    <div className="flex justify-between items-baseline text-base font-extrabold text-slate-900 border-t-2 border-slate-900 pt-2.5">
                      <span>Totale Documento:</span>
                      <span className="text-2xl text-indigo-700 font-mono-num">
                        €{documentTotalPrice.toLocaleString('it-IT')}
                      </span>
                    </div>
                  </div>

                  {/* Delivery Timeline Pill */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <span className="font-medium">Stima Tempi Consegna:</span>
                    </div>
                    <span className="font-mono-num font-bold text-slate-900">
                      ~{weeksEstimated} Settimane ({daysEstimated} gg)
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 space-y-2">
                    <button
                      onClick={() => setActiveTab('document')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Visualizza Preventivo Ufficiale Cliente</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('profitability')}
                      className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-300 transition-colors cursor-pointer"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verifica Margine & Redditività Interna ({marginPercentage}%)</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CLIENT FORMAL DOCUMENT (A4 PRINTABLE PREVENTIVO) */}
        {/* ========================================================================= */}
        {activeTab === 'document' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            
            {/* Top Bar for Action in Document View */}
            <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-xs text-slate-600 font-medium">
                  Questo documento corrisponde al foglio ufficiale stampabile da sottoporre per accettazione al cliente.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveTab('config')}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  Modifica Voci
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Stampa / Salva in PDF</span>
                </button>
              </div>
            </div>

            {/* Official A4 Sheet Simulation */}
            <div className="print-page bg-white text-slate-900 rounded-2xl shadow-sm p-8 sm:p-12 border border-slate-200 text-xs leading-relaxed">
              
              {/* Document Header: Agency & Client Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
                <div>
                  <div className="font-extrabold text-xl tracking-tight text-slate-950 uppercase">
                    {agencyInfo.name}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                    <p className="font-semibold text-slate-700">{agencyInfo.businessName}</p>
                    <p>{agencyInfo.address} - {agencyInfo.city}</p>
                    <p>P.IVA / C.F.: <span className="font-mono-num text-slate-700">{agencyInfo.vatNumber}</span></p>
                    <p>{agencyInfo.email} | {agencyInfo.phone}</p>
                  </div>
                </div>

                <div className="sm:text-right bg-slate-50 p-4 rounded-xl border border-slate-200 min-w-[260px]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-700 block mb-1">
                    Destinatario Committente
                  </span>
                  <div className="font-bold text-sm text-slate-950">
                    {clientInfo.companyName}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 space-y-0.5">
                    <p>C.a.: <span className="font-semibold text-slate-800">{clientInfo.contactPerson}</span></p>
                    <p>{clientInfo.address} - {clientInfo.city}</p>
                    <p>P.IVA: <span className="font-mono-num">{clientInfo.vatNumber}</span></p>
                    <p>{clientInfo.email}</p>
                  </div>
                </div>
              </div>

              {/* Document Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 bg-slate-50/70 my-6 px-4 rounded-xl">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Documento
                  </span>
                  <span className="font-mono-num font-bold text-slate-900 text-xs">
                    {clientInfo.quoteNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Data Emissione
                  </span>
                  <span className="font-mono-num font-bold text-slate-900 text-xs">
                    {clientInfo.quoteDate}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Validità Offerta
                  </span>
                  <span className="font-semibold text-slate-900 text-xs">
                    {clientInfo.validityDays} Giorni Solari
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Tempi di Esecuzione
                  </span>
                  <span className="font-semibold text-slate-900 text-xs">
                    ~{weeksEstimated} Settimane Stimate
                  </span>
                </div>
              </div>

              {/* Project Title and Scope */}
              <div className="space-y-2 mb-8">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-950">
                  Oggetto: {clientInfo.projectTitle}
                </h1>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {clientInfo.projectDescription}
                </p>
              </div>

              {/* Table of Deliverables per Phase */}
              <div className="space-y-6 mb-8">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1">
                  Piano Operativo dei Lavori & Specifiche di Sviluppo (WBS)
                </div>

                <div className="space-y-4">
                  {phaseBreakdowns
                    .filter(p => p.items.length > 0)
                    .map(({ phase, items, totalHours: pHours, subtotalPrice: pPrice }) => (
                      <div key={phase.id} className="border border-slate-200 rounded-xl overflow-hidden">
                        {/* Phase Header */}
                        <div className="bg-slate-100/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-200">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 mr-2 font-mono-num">
                              FASE {phase.phaseNumber}
                            </span>
                            <span className="font-bold text-slate-900 text-xs">
                              {phase.name}
                            </span>
                          </div>
                          <div className="font-mono-num text-xs font-bold text-slate-900">
                            €{pPrice.toLocaleString('it-IT')} ({pHours}h)
                          </div>
                        </div>

                        {/* Phase Items Table */}
                        <div className="divide-y divide-slate-100">
                          {items.map(item => (
                            <div key={item.id} className="px-4 py-2.5 flex items-start justify-between gap-4 bg-white">
                              <div>
                                <div className="font-semibold text-slate-900 text-xs">
                                  {item.title}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {item.description}
                                </div>
                              </div>
                              <div className="text-right shrink-0 font-mono-num text-[11px] text-slate-800">
                                <span className="font-bold">€{(item.hours * hourlyRate).toLocaleString('it-IT')}</span>
                                <span className="text-slate-400 ml-1.5">({item.hours}h)</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Financial Summary Box */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-8 pt-4 border-t border-slate-200">
                
                {/* Payment Schedule */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Condizioni e Ripartizione Pagamenti (SAL)
                  </span>
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                    {paymentBreakdown.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-700">{p.label}</span>
                        <span className="font-mono-num font-bold text-slate-900">
                          €{p.amount.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                      Coordinate bancarie: <span className="font-mono-num font-bold text-slate-800">{agencyInfo.iban}</span>
                    </div>
                  </div>
                </div>

                {/* Final Cost Breakdown */}
                <div className="space-y-2 bg-slate-50 rounded-xl p-4 border border-slate-200 self-start">
                  <div className="flex justify-between text-slate-600 text-xs">
                    <span>Subtotale Servizi Professionali:</span>
                    <span className="font-mono-num font-semibold text-slate-900">€{grossTotalPrice.toLocaleString('it-IT')}</span>
                  </div>

                  {discountPercent > 0 && (
                    <div className="flex justify-between text-emerald-700 text-xs">
                      <span>Sconto Applicato ({discountPercent}%):</span>
                      <span className="font-mono-num font-semibold">-€{discountAmount.toLocaleString('it-IT')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-900 text-xs font-semibold border-t border-slate-200 pt-2">
                    <span>Imponibile Netto:</span>
                    <span className="font-mono-num">€{netSubtotalPrice.toLocaleString('it-IT')}</span>
                  </div>

                  <div className="flex justify-between text-slate-600 text-xs">
                    <span>
                      {fiscalRegime === 'ordinario_22' ? 'IVA di Legge (22%):' : 'Imposta IVA:'}
                    </span>
                    <span className="font-mono-num">€{vatAmount.toLocaleString('it-IT')}</span>
                  </div>

                  <div className="flex justify-between items-baseline text-sm font-extrabold text-slate-950 border-t-2 border-slate-900 pt-2">
                    <span>TOTALE COMPLESSIVO:</span>
                    <span className="text-xl text-indigo-700 font-mono-num">
                      €{documentTotalPrice.toLocaleString('it-IT')}
                    </span>
                  </div>
                </div>

              </div>

              {/* General Conditions and Acceptance */}
              <div className="border-t border-slate-200 pt-6 space-y-6">
                <div className="text-[10px] text-slate-500 space-y-1 leading-normal">
                  <p className="font-bold text-slate-700 uppercase tracking-wider">Note e Condizioni di Fornitura:</p>
                  <p>1. <strong>Decorrenza:</strong> I tempi di sviluppo stimati decorrono dalla ricezione dell'acconto e dalla consegna da parte del committente di tutti i contenuti necessari (testi, media, credenziali).</p>
                  <p>2. <strong>Garanzia e Assistenza:</strong> Sono inclusi 60 giorni solari di garanzia post-lancio per la risoluzione prioritaria di eventuali anomalie non rilevate in sede di collaudo.</p>
                  <p>3. <strong>Proprietà Intellettuale:</strong> Il codice sorgente sviluppato e le grafiche approvate diverranno di piena proprietà del committente a saldo integrale della fornitura.</p>
                </div>

                {/* Signature Box */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-8">
                      Per il Fornitore ({agencyInfo.name})
                    </span>
                    <div className="border-b border-slate-300 w-48 mb-1"></div>
                    <span className="text-[10px] text-slate-500 font-mono-num">Firma digitale o legale rappresentante</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-8">
                      Per Accettazione del Committente ({clientInfo.companyName})
                    </span>
                    <div className="border-b border-slate-300 w-48 mb-1"></div>
                    <span className="text-[10px] text-slate-500">Data, Timbro e Firma</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INTERNAL AGENCY PROFITABILITY & MARGIN CONTROL (RISERVATO) */}
        {/* ========================================================================= */}
        {activeTab === 'profitability' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Cruscotto Riservato di Redditività & Controllo di Gestione
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Questa sezione è ad esclusivo uso interno dell'agenzia per valutare la sostenibilità economica della commessa, i costi del personale e il punto di pareggio (break-even).
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Ricavo Netto (Imponibile)
                </span>
                <div className="text-xl font-extrabold font-mono-num text-slate-900">
                  €{netSubtotalPrice.toLocaleString('it-IT')}
                </div>
                <span className="text-[10px] text-slate-400 font-mono-num mt-1 block">
                  {totalHours} ore × €{hourlyRate}/h (netto sconto)
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Costo Vivo Interno
                </span>
                <div className="text-xl font-extrabold font-mono-num text-slate-700">
                  €{totalInternalCost.toLocaleString('it-IT')}
                </div>
                <span className="text-[10px] text-slate-400 font-mono-num mt-1 block">
                  {totalHours} ore × €{internalCostPerHour}/h (costo orario dev)
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Margine di Contribuzione
                </span>
                <div className="text-xl font-extrabold font-mono-num text-emerald-700">
                  €{netMarginEuro.toLocaleString('it-IT')}
                </div>
                <span className="text-[10px] text-emerald-700 font-mono-num font-semibold mt-1 block">
                  Marginalità: {marginPercentage}%
                </span>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Break-Even Rate
                </span>
                <div className="text-xl font-extrabold font-mono-num text-indigo-700">
                  €{breakEvenHourlyRate} / h
                </div>
                <span className="text-[10px] text-slate-400 font-mono-num mt-1 block">
                  Tariffa minima per coprire i costi
                </span>
              </div>

            </div>

            {/* In-depth Analysis & Simulation Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Sliders for Sensitivity Simulation */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <span>Simulazione Sensibilità Costi del Personale</span>
                </h3>

                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-slate-700 font-semibold">Costo Orario Interno Medio Team:</span>
                    <span className="font-mono-num font-bold text-slate-900">€{internalCostPerHour} / h</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    step="1"
                    value={internalCostPerHour}
                    onChange={(e) => setInternalCostPerHour(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono-num mt-1">
                    <span>€18/h (Junior)</span>
                    <span>€30/h (Media Studio)</span>
                    <span>€60/h (Senior / Consulente)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 text-xs">
                    <span className="text-slate-700 font-semibold">Allocazione Settimanale Team:</span>
                    <span className="font-mono-num font-bold text-slate-900">{teamCapacityWeeklyHours} h / sett.</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="80"
                    step="5"
                    value={teamCapacityWeeklyHours}
                    onChange={(e) => setTeamCapacityWeeklyHours(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono-num mt-1">
                    <span>15h (Part-time)</span>
                    <span>35h (1 Full Dev)</span>
                    <span>70h (Team di 2 Dev)</span>
                  </div>
                </div>

                {/* Health Meter */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-700">Stato di Salute Economico Commessa:</span>
                    <span className={Number(marginPercentage) >= 50 ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                      {Number(marginPercentage) >= 50 ? 'Ottima Redditività' : 'Margine Standard'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        Number(marginPercentage) >= 50
                          ? 'bg-emerald-600'
                          : Number(marginPercentage) >= 30
                          ? 'bg-amber-500'
                          : 'bg-rose-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, Number(marginPercentage)))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Breakdown of Hours per Competency */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Distribuzione Ore per Area di Competenza</span>
                </h3>

                <div className="space-y-3 text-xs">
                  {phaseBreakdowns.map(({ phase, totalHours: pHours }) => {
                    const pct = totalHours > 0 ? ((pHours / totalHours) * 100).toFixed(0) : '0';
                    return (
                      <div key={phase.id} className="space-y-1">
                        <div className="flex justify-between text-slate-700">
                          <span className="truncate pr-2 font-medium">{phase.name}</span>
                          <span className="font-mono-num font-bold text-slate-900 shrink-0">
                            {pHours}h ({pct}%)
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                          <div 
                            className="h-full bg-indigo-600/80"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};
