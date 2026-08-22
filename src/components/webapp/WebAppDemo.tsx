import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Check, 
  Plus, 
  Minus, 
  Download, 
  Share2, 
  Copy, 
  CheckCircle2, 
  RotateCcw, 
  Layers, 
  DollarSign, 
  Clock, 
  TrendingUp,
  FileText,
  Percent,
  SlidersHorizontal,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRESET_MODULES, PresetModule } from '../../data/webappData';
import { QuoteItem } from '../../types';

export const WebAppDemo: React.FC = () => {
  // Agency Config State
  const [hourlyRate, setHourlyRate] = useState<number>(65); // €/ora
  const [internalCostPerHour, setInternalCostPerHour] = useState<number>(28); // €/ora costo interno
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [clientName, setClientName] = useState<string>('Tornesi Immobiliare & Partners');
  const [projectTitle, setProjectTitle] = useState<string>('Piattaforma Web Immobiliare con Filtri Avanzati & Stima Mutui');
  
  // Selected Modules
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([
    'ui-design',
    'frontend-core',
    'realestate-filter',
    'calculator-tool',
    'lead-multi-step',
    'seo-analytics'
  ]);

  // Custom added items
  const [customHoursMultiplier, setCustomHoursMultiplier] = useState<number>(1.0);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const toggleModule = (id: string) => {
    setSelectedModuleIds(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const selectedModules = PRESET_MODULES.filter(m => selectedModuleIds.includes(m.id));

  // Computations
  const totalBaseHours = selectedModules.reduce((sum, m) => sum + m.baseHours, 0);
  const adjustedHours = Math.round(totalBaseHours * customHoursMultiplier);
  
  const rawTotalPrice = adjustedHours * hourlyRate;
  const discountValue = (rawTotalPrice * discountPercent) / 100;
  const finalPrice = Math.max(0, rawTotalPrice - discountValue);

  const totalInternalCost = adjustedHours * internalCostPerHour;
  const netMarginEuro = Math.max(0, finalPrice - totalInternalCost);
  const marginPercentage = finalPrice > 0 ? ((netMarginEuro / finalPrice) * 100).toFixed(1) : '0';

  const handleCopyEstimate = () => {
    const summaryText = `PREVENTIVO E PIANO DI SVILUPPO SOFTWARE
Cliente: ${clientName}
Progetto: ${projectTitle}
Ore stimate: ${adjustedHours} ore
Tariffa: €${hourlyRate}/ora
Totale Lavori: €${finalPrice.toLocaleString('it-IT')}

MODULI INCLUSI:
${selectedModules.map(m => `- ${m.name} (${Math.round(m.baseHours * customHoursMultiplier)}h)`).join('\n')}

Margine operativo stimato: ${marginPercentage}%
Generato con QuickQuote Pro (Marco Cerilli Dev Studio)`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-emerald-900/40 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shadow-emerald-500/20">
              <Calculator className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white block">
                QUICKQUOTE <span className="text-emerald-400">PRO</span>
              </span>
              <span className="text-[10px] text-emerald-400/80 uppercase tracking-widest block font-mono font-semibold">
                Agency Estimator & Financial Margin Analyzer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedModuleIds(PRESET_MODULES.map(m => m.id));
              }}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors"
            >
              Seleziona Tutti
            </button>
            <button
              onClick={() => setSelectedModuleIds([])}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors"
            >
              Deseleziona
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Project Header Info Box */}
        <div className="bg-slate-900/90 rounded-2xl border border-emerald-900/30 p-5 sm:p-6 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" /> Nome Cliente / Azienda
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-semibold focus:outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> Oggetto del Preventivo / Titolo Progetto
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-semibold focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* 2-Column Grid: Configurator Modules & Dynamic Real-time Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Modules Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>Moduli Software & Funzionalità Selezionabili</span>
              </h2>
              <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full font-bold">
                {selectedModules.length} di {PRESET_MODULES.length} attivi
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {PRESET_MODULES.map(module => {
                const isSelected = selectedModuleIds.includes(module.id);
                const estimatedHours = Math.round(module.baseHours * customHoursMultiplier);
                const itemPrice = estimatedHours * hourlyRate;

                return (
                  <div
                    key={module.id}
                    onClick={() => toggleModule(module.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/80 shadow-md shadow-emerald-500/5'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-75'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          {module.category}
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                          {module.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {module.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-extrabold font-mono text-emerald-400">
                        €{itemPrice.toLocaleString('it-IT')}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        {estimatedHours} ore
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rate Parameters & Computed Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            
            {/* Rates & Modifiers Box */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
              <h3 className="text-sm font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <span>Parametri di Calcolo Tariffario</span>
              </h3>

              {/* Hourly Rate Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-slate-300 font-bold">Tariffa Oraria Vendita:</span>
                  <span className="font-mono font-extrabold text-emerald-400">€{hourlyRate}/h</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="150"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Internal Cost Slider */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-slate-300 font-bold">Costo Orario Interno (Dev/PM):</span>
                  <span className="font-mono font-extrabold text-slate-300">€{internalCostPerHour}/h</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="80"
                  step="1"
                  value={internalCostPerHour}
                  onChange={(e) => setInternalCostPerHour(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
                />
              </div>

              {/* Multiplier / Complexity */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-slate-300 font-bold">Moltiplicatore Complessità:</span>
                  <span className="font-mono font-extrabold text-amber-400">{customHoursMultiplier}x</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Standard (1.0x)', val: 1.0 },
                    { label: 'Avanzato (1.25x)', val: 1.25 },
                    { label: 'Enterprise (1.5x)', val: 1.5 }
                  ].map(lvl => (
                    <button
                      key={lvl.val}
                      onClick={() => setCustomHoursMultiplier(lvl.val)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        customHoursMultiplier === lvl.val
                          ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discount Selector */}
              <div>
                <div className="flex justify-between items-center mb-1.5 text-xs">
                  <span className="text-slate-300 font-bold">Sconto Commerciale:</span>
                  <span className="font-mono font-extrabold text-teal-400">{discountPercent}%</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 5, 10, 15].map(disc => (
                    <button
                      key={disc}
                      onClick={() => setDiscountPercent(disc)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        discountPercent === disc
                          ? 'bg-teal-500/20 border-teal-500 text-teal-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {disc}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Summary Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl border border-emerald-500/40 p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Riepilogo Preventivo</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                  {adjustedHours} Ore Totali
                </span>
              </div>

              {/* Numbers */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Totale Lordo Lavori:</span>
                  <span className="font-mono">€{rawTotalPrice.toLocaleString('it-IT')}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-teal-400">
                    <span>Sconto Applicato ({discountPercent}%):</span>
                    <span className="font-mono">-€{discountValue.toLocaleString('it-IT')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-white border-t border-slate-800 pt-2">
                  <span>Prezzo Finale al Cliente:</span>
                  <span className="text-2xl text-emerald-400 font-mono">
                    €{finalPrice.toLocaleString('it-IT')}
                  </span>
                </div>
              </div>

              {/* Profitability Meter */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Margine Netto di Progetto:</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    €{netMarginEuro.toLocaleString('it-IT')} ({marginPercentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                    style={{ width: `${Math.min(100, Number(marginPercentage))}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  Costo interno stimato: €{totalInternalCost.toLocaleString('it-IT')}
                </p>
              </div>

              {/* Actions */}
              <button
                onClick={handleCopyEstimate}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-98 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />
                    <span>Preventivo Copiato negli Appunti!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                    <span>Copia Riepilogo Formattato per Cliente</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};
