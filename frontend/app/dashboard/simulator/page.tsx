"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActivitySquare, RefreshCw, Calculator, TrendingUp, Info } from "lucide-react";
import { simulatePolicy } from "@/lib/api";

export default function PolicySimulatorPage() {
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState(false);
  const [simData, setSimData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const safeNumber = (val: any) => Number(val) || 0;

  const simulatePolicyAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const scheme_name = formData.get('scheme_name') as string;
    const income_limit = Number(formData.get('income_limit')) || 0;

    if (!scheme_name || income_limit <= 0) {
      setError("Scheme prototype and income ceiling are mandatory.");
      return;
    }

    setSimulating(true);
    setResults(false);
    setError(null);
    try {
      const res = await simulatePolicy({ scheme_name, income_limit });
      if (res.success && res.data) {
        setSimData(res.data);
        setResults(true);
      } else {
        throw new Error(res.message || "Federal simulation node unreachable.");
      }
    } catch (err: any) {
      console.error("SIM ERROR:", err);
      setError(err.message || "Simulation failed. Please check registry connectivity.");
    } finally {
      setSimulating(false);
    }
  };

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)} Lac`;
    return `₹${val.toLocaleString()}`;
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8">
      
      {/* Left: Input Form */}
      <div className="w-full lg:w-[380px] flex flex-col gap-6">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-white underline decoration-[#D4AF37]/30 underline-offset-8">Policy Simulator</h1>
          <p className="text-sm text-white/50">Forecast resource allocation and inclusion rates before federal rollout via live registry cross-referencing.</p>
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-mono tracking-tight animate-pulse">
               [ALERT] {error}
            </div>
          )}
        </div>

        <form onSubmit={simulatePolicyAction} className="bg-white/[0.01] border border-white/10 p-7 rounded-[2.5rem] flex flex-col gap-6 shadow-2xl backdrop-blur-3xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="flex items-center gap-3 text-[#D4AF37] relative z-10">
            <Calculator size={18} className="animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest">Compute Parameters</span>
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Scheme Prototype</label>
            <input name="scheme_name" type="text" required className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/30 transition-all placeholder-white/10" placeholder="e.g. Agri-Grant 2026" />
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Income Ceiling (INR)</label>
            <input name="income_limit" type="number" required className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/30 transition-all placeholder-white/10" placeholder="300000" />
          </div>

          <div className="flex flex-col gap-2 relative z-10">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Geographic Focus</label>
            <select className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/30 transition-all appearance-none cursor-pointer">
              <option className="bg-black text-white">All Integrated States</option>
              <option className="bg-black text-white">Aspirational Districts</option>
              <option className="bg-black text-white">Urban Marginalized</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={simulating}
            className="mt-4 w-full py-4 rounded-full bg-[#D4AF37]/10 flex justify-center items-center gap-3 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black transition-all duration-500 font-black text-xs uppercase tracking-widest cursor-pointer disabled:opacity-50 relative z-10 group/btn shadow-lg shadow-[#D4AF37]/5"
          >
            {simulating ? <RefreshCw size={16} className="animate-spin" /> : <ActivitySquare size={16} className="group-hover/btn:scale-125 transition-transform" />}
            <span>{simulating ? "Calculating Results..." : "Compute Simulation"}</span>
          </button>
        </form>
      </div>

      {/* Right: Results Display */}
      <div className="flex-1 flex flex-col border border-white/5 rounded-[3rem] bg-black/40 min-h-[500px] p-10 overflow-hidden relative shadow-2xl backdrop-blur-3xl">
        <AnimatePresence mode="wait">
          {!simulating && !results && (
            <motion.div 
              key="empty" 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              className="flex flex-col items-center justify-center h-full gap-8 mt-12"
            >
              <div className="relative">
                <div className="p-10 rounded-full border border-white/5 bg-white/[0.01] text-white/10">
                  <Calculator size={72} strokeWidth={0.5} />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="absolute inset-0 bg-[#D4AF37]/5 blur-3xl rounded-full"
                />
              </div>
              <div className="text-center flex flex-col gap-2">
                <span className="text-white/60 font-black tracking-[0.2em] text-xs uppercase tracking-widest">Compute Layer Standby</span>
                <p className="text-white/20 text-[10px] uppercase font-bold max-w-[200px] mx-auto leading-relaxed">Input scheme parameters to initiate real-time fiscal forecasting</p>
              </div>
            </motion.div>
          )}

          {simulating && (
            <motion.div key="simulating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full gap-8 mt-12">
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-24 h-24 border-t-2 border-b-2 border-[#D4AF37]/40 rounded-full shadow-[0_0_30px_rgba(212,175,55,0.1)]"
                />
                <div className="absolute inset-0 flex items-center justify-center text-[#D4AF37]">
                   <Calculator size={24} className="animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[#D4AF37] font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">Running Simulation</span>
                <span className="text-white/20 text-[9px] font-mono tracking-widest uppercase">Benchmarking eligibility threshold deltas</span>
              </div>
            </motion.div>
          )}

          {results && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "circOut" }} className="flex flex-col h-full w-full gap-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                 <div className="flex flex-col gap-1.5">
                   <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase text-[#D4AF37] tracking-[0.2em]">Simulation Complete</span>
                     <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse shadow-[0_0_10px_rgba(212,175,55,1)]" />
                   </div>
                   <span className="text-2xl font-bold text-white tracking-tight">Policy Diffusion Forecast</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/5 text-[#D4AF37] border border-[#D4AF37]/10 text-[9px] font-black uppercase tracking-widest">
                    <TrendingUp size={12} />
                    Dynamic Model Result
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-500 group">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20 group-hover:text-[#D4AF37]/40 transition-colors">Target Eligible</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-white tabular-nums tracking-tighter">
                      {simData?.eligible_count?.toLocaleString() || 0}
                    </span>
                    <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Estimated Impact Node</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-500 group">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20 group-hover:text-[#D4AF37]/40 transition-colors">Inclusion rate</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-white tabular-nums tracking-tighter">{simData?.inclusion_rate || 0}%</span>
                    <span className="text-[9px] text-yellow-500 font-bold uppercase tracking-widest">Existing penetration</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-500 group">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-black text-white/20 group-hover:text-[#D4AF37]/40 transition-colors">Risk Exposure</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-white tabular-nums tracking-tighter">{simData?.high_risk_count || 0}</span>
                    <span className="text-[9px] text-red-500/60 font-bold uppercase tracking-widest">High risk IDs flagged</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex flex-col gap-4 p-8 rounded-[2.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 shadow-xl">
                    <span className="text-[9px] font-black uppercase text-[#D4AF37] tracking-[0.3em]">Estimated Annual Budget</span>
                    <div className="flex flex-col gap-1">
                        <span className="text-4xl font-black text-white tabular-nums tracking-tight">{formatCurrency(simData?.budget_required || 0)}</span>
                        <p className="text-white/20 text-[10px] leading-relaxed uppercase font-bold mt-2">Fiscal allocation required for 12-month delivery cycle at ₹1,500/beneficiary block.</p>
                    </div>
                 </div>

                 <div className="flex flex-col gap-4">
                    <span className="text-[9px] font-black uppercase text-white/20 tracking-[0.3em] ml-2">Heuristic Insights</span>
                    <div className="flex flex-col gap-3">
                       {simData?.insights?.map((insight: string, idx: number) => (
                         <motion.div 
                           key={idx} 
                           initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (idx * 0.1) }}
                           className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-start gap-4 group/insight"
                         >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/40 mt-1.5 shrink-0 group-hover/insight:bg-[#D4AF37] transition-colors" />
                            <p className="text-[11px] text-white/60 font-medium leading-relaxed italic">{insight}</p>
                         </motion.div>
                       ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
