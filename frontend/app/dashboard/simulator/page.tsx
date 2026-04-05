"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActivitySquare, RefreshCw, Calculator, TrendingUp, Info } from "lucide-react";

export default function PolicySimulatorPage() {
  const [simulating, setSimulating] = useState(false);
  const [results, setResults] = useState(false);

  const simulatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    setSimulating(true);
    setResults(false);
    setTimeout(() => {
      setSimulating(false);
      setResults(true);
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8">
      
      {/* Left: Input Form */}
      <div className="w-full lg:w-[380px] flex flex-col gap-6">
        <div className="flex flex-col gap-2 mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Policy Simulator</h1>
          <p className="text-sm text-white/50">Forecast resource allocation and inclusion rates before rollout.</p>
        </div>

        <form onSubmit={simulatePolicy} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-[2rem] flex flex-col gap-6 shadow-xl">
          <div className="flex items-center gap-3 text-[#D4AF37] mb-2">
            <Calculator size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Parameter Entry</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Scheme Prototype</label>
            <input type="text" required className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/40 transition-all placeholder-white/10" placeholder="e.g. Agri-Grant 2026" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Income Ceiling (INR)</label>
            <input type="number" required className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/40 transition-all placeholder-white/10" placeholder="300000" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Geographic Focus</label>
            <select className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]/40 transition-all appearance-none cursor-pointer">
              <option className="bg-black">All Integrated States</option>
              <option className="bg-black">Aspirational Districts Only</option>
              <option className="bg-black">Urban Marginalized Sets</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={simulating}
            className="mt-4 w-full py-4 rounded-full bg-[#D4AF37]/10 flex justify-center items-center gap-3 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-black transition-all duration-300 font-black text-xs uppercase tracking-widest cursor-pointer disabled:opacity-50"
          >
            {simulating ? <RefreshCw size={16} className="animate-spin" /> : <ActivitySquare size={16} />}
            <span>{simulating ? "Calculating..." : "Compute Simulation"}</span>
          </button>
        </form>
      </div>

      {/* Right: Results Display */}
      <div className="flex-1 flex flex-col border border-white/5 rounded-[2.5rem] bg-black/40 min-h-[500px] p-10 overflow-hidden relative shadow-2xl">
        <AnimatePresence mode="wait">
          {!simulating && !results && (
            <motion.div 
              key="empty" 
              initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} 
              className="flex flex-col items-center justify-center h-full gap-6 mt-12"
            >
              <div className="p-8 rounded-full border border-white/5 bg-white/[0.01]">
                <Calculator size={64} strokeWidth={0.5} />
              </div>
              <div className="text-center flex flex-col gap-1">
                <span className="text-white font-bold tracking-tight text-lg uppercase opacity-60">Engine Standby</span>
                <p className="text-white/40 text-xs tracking-widest uppercase">Input scheme parameters to initiate compute layer</p>
              </div>
            </motion.div>
          )}

          {simulating && (
            <motion.div key="simulating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full gap-8 mt-12">
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-20 h-20 border-t border-b border-[#D4AF37] rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Calculator size={20} className="text-[#D4AF37] animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-white font-bold tracking-[0.4em] uppercase text-xs">Simulating Diffusion</span>
                <span className="text-white/20 text-[10px] font-mono tracking-widest">Allocating resources across 48M nodes...</span>
              </div>
            </motion.div>
          )}

          {results && (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="flex flex-col h-full w-full gap-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-6">
                 <div className="flex flex-col gap-1">
                   <span className="text-xs font-black uppercase text-[#D4AF37] tracking-widest">Forecast Output</span>
                   <span className="text-2xl font-bold text-white tracking-tight">Agri-Grant 2026 Prototype</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 text-[9px] font-black uppercase tracking-tighter">
                    <TrendingUp size={12} />
                    High Feasibility
                 </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Target Eligible</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-white">14.2M</span>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">+412k from baseline</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Coverage Gap</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-white">3.8%</span>
                    <span className="text-[10px] text-yellow-500 font-bold uppercase">Systemic boundary overlap</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30">Residual Excl.</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-3xl font-black text-white">890K</span>
                    <span className="text-[10px] text-red-500/60 font-bold uppercase">-12% vs current state</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto bg-[#D4AF37]/5 border border-[#D4AF37]/10 p-6 rounded-2xl flex items-start gap-4">
                <Info size={18} className="text-[#D4AF37] pt-0.5 shrink-0" />
                <p className="text-sm text-white/60 leading-relaxed italic">
                  "Adjusting the income ceiling by ±INR 15,000 across District 4 and Sector 12 will likely resolve the 890K exclusion pocket. Recommend unified re-indexing before final rollout."
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
