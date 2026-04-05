"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserX, RefreshCw, AlertCircle, Map, Target } from "lucide-react";
import { findExclusion } from "@/lib/api";

export default function InclusionGapPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);
  const [exclusions, setExclusions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const triggerDetection = async () => {
    setAnalyzing(true);
    setResults(false);
    setError(null);
    try {
      const res = await findExclusion();
      if (res.success && Array.isArray(res.data)) {
        // Map backend exclusions to UI cards as requested using RAW database fields
        const mapped = res.data.map((item: any) => ({
          id: item.id,
          full_name: item.full_name || "Unknown",
          address: item.address || "Not Available",
          income: Number(item.income || 0),
          reason: item.exclusion_reason || "Eligible but excluded from scheme enrollment.",
          risk_level: item.risk_level || "LOW"
        }));
        setExclusions(mapped);
        setResults(true);
      } else {
        throw new Error(res.message || "No data received from federal registries.");
      }
    } catch (err: any) {
      console.error("API ERROR:", err);
      setError(err.message || "Unable to connect to exclusion analytics node.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white underline decoration-yellow-500/30 underline-offset-8">Inclusion Gap Analysis</h1>
        <p className="text-sm text-white/50">Identify marginalized groups who are legitimately eligible but systematically excluded from delivery.</p>
        
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-mono tracking-tight">
             [ERROR] {error}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!analyzing && !results && (
          <motion.div 
            key="init"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-32 border border-yellow-500/10 bg-yellow-500/[0.01] rounded-[2rem] gap-8 shadow-[0_0_50px_-12px_rgba(234,179,8,0.05)]"
          >
            <div className="relative">
              <div className="p-6 rounded-full bg-yellow-500/10 text-yellow-500/30">
                <Map size={56} strokeWidth={1} />
              </div>
              <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full"
              />
            </div>
            
            <div className="text-center flex flex-col gap-2 px-4">
              <h3 className="text-white/80 font-bold text-xl tracking-tight uppercase">Geo-Spatial Analysis Standby</h3>
              <p className="text-white/30 text-sm max-w-sm mx-auto">Analyze demographic distributions to locate systemic delivery failures and reach-out gaps across regional clusters.</p>
            </div>

            <button 
              onClick={triggerDetection}
              className="px-10 py-3.5 rounded-full bg-yellow-500/10 border border-yellow-500/40 text-yellow-500 font-black tracking-widest text-xs uppercase hover:bg-yellow-500 hover:text-black transition-all duration-300 cursor-pointer shadow-lg shadow-yellow-500/5 active:scale-95"
            >
               Start Inclusion Audit
            </button>
          </motion.div>
        )}

        {analyzing && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-40 gap-8"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-24 h-24 bg-yellow-500/10 rounded-full blur-xl"
              />
              <motion.div 
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute inset-0 border-t-2 border-yellow-500/50 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Target size={24} className="text-yellow-500 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-yellow-500 font-bold tracking-[0.4em] uppercase text-xs animate-pulse">Mapping Gaps</span>
              <span className="text-white/20 text-[10px] font-mono tracking-widest uppercase">Cross-referencing poverty indices</span>
            </div>
          </motion.div>
        )}

        {results && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "circOut" }}
            className="flex flex-col gap-4"
          >
             <div className="flex items-center justify-between mb-4 px-2">
               <div className="flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                 <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Inclusion Vulnerability Map</div>
               </div>
               <button onClick={triggerDetection} className="flex items-center gap-2 text-yellow-500 text-[10px] font-black uppercase tracking-widest hover:underline group">
                 <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                 Refresh Analysis
               </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {exclusions.length > 0 ? (
                 exclusions.map((ex, i) => (
                   <motion.div 
                     key={ex.id}
                     initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05, duration: 0.4 }}
                     className="bg-white/[0.015] border border-white/5 p-6 rounded-2xl flex flex-col gap-5 shadow-sm hover:border-yellow-500/20 transition-all duration-500 group"
                   >
                     <div className="flex items-start justify-between">
                       <div className="flex flex-col gap-1.5">
                         <span className="font-bold text-white group-hover:text-yellow-500 transition-colors duration-300 text-lg tracking-tight">{ex.full_name}</span>
                         <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-current w-fit opacity-70 ${ex.risk_level === 'HIGH' ? 'text-red-500' : ex.risk_level === 'MEDIUM' ? 'text-orange-500' : 'text-emerald-500'}`}>
                           {ex.risk_level} Risk
                         </div>
                       </div>
                       <AlertCircle size={18} className="text-yellow-500/30 group-hover:text-yellow-500 transition-colors" />
                     </div>
                     
                     <p className="text-white/40 text-[11px] font-medium leading-relaxed uppercase tracking-wider">{ex.reason}</p>
                     
                     <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Self-Declared Income</span>
                          <span className="text-lg font-black text-white tabular-nums tracking-tighter">
                            {typeof ex.income === 'number' ? `₹${ex.income.toLocaleString()}` : "Not Available"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Regional Cluster</span>
                          <span className="text-white/40 text-[11px] font-medium truncate">{ex.address || "Not Available"}</span>
                        </div>
                      </div>
                   </motion.div>
                 ))
               ) : (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
                   className="mt-4 p-12 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-3xl flex flex-col items-center gap-4 text-center md:col-span-2 shadow-lg shadow-emerald-500/5"
                 >
                    <Target size={40} className="text-emerald-500/40" />
                    <div className="flex flex-col gap-1">
                      <span className="text-white font-bold text-lg uppercase tracking-tight">No inclusion gaps detected</span>
                      <span className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em]">Poverty indices vs scheme distribution audit: parity maintained</span>
                    </div>
                 </motion.div>
               )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
