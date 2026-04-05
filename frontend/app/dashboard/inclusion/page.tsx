"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserX, RefreshCw, AlertCircle, Map, Target } from "lucide-react";

export default function InclusionGapPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);

  const triggerDetection = () => {
    setAnalyzing(true);
    setResults(false);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(true);
    }, 2500);
  };

  const EXCLUSIONS = [
    { region: "District 4, UP", issue: "Aadhar linkage failure for BPL families", count: "12,400", trend: "+2.1%" },
    { region: "Tribal Zone B, MP", issue: "Missing biometric references", count: "8,950", trend: "-0.5%" },
    { region: "Sector 12, BR", issue: "Income threshold document mismatch", count: "4,200", trend: "+1.2%" },
  ];

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Inclusion Gap Analysis</h1>
        <p className="text-sm text-white/50">Identify marginalized groups who are legitimately eligible but systematically excluded from delivery.</p>
      </div>

      <AnimatePresence mode="wait">
        {!analyzing && !results && (
          <motion.div 
            key="init"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-32 border border-yellow-500/10 bg-yellow-500/[0.01] rounded-[2rem] gap-8"
          >
            <div className="relative">
              <div className="p-6 rounded-full bg-yellow-500/10 text-yellow-500/30">
                <Map size={56} strokeWidth={1} />
              </div>
              <motion.div 
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute inset-0 bg-yellow-500/5 blur-3xl rounded-full"
              />
            </div>
            
            <div className="text-center flex flex-col gap-2">
              <h3 className="text-white/80 font-bold text-xl tracking-tight">Geo-Spatial Analysis Standby</h3>
              <p className="text-white/30 text-sm max-w-sm mx-auto">Analyze demographic distributions to locate systemic delivery failures and reach-out gaps.</p>
            </div>

            <button 
              onClick={triggerDetection}
              className="px-10 py-3.5 rounded-full bg-yellow-500/10 border border-yellow-500/40 text-yellow-500 font-bold tracking-widest text-xs uppercase hover:bg-yellow-500 hover:text-black transition-all duration-300 cursor-pointer shadow-[0_0_30px_rgba(234,179,8,0.1)]"
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
              <span className="text-yellow-500 font-bold tracking-[0.4em] uppercase text-xs">Mapping Gaps</span>
              <span className="text-white/20 text-[10px] font-mono tracking-widest">Cross-referencing census vs scheme data</span>
            </div>
          </motion.div>
        )}

        {results && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
             <div className="flex items-center justify-between mb-2">
               <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Inclusion Vulnerability Clusters</div>
               <button onClick={triggerDetection} className="text-yellow-500 text-[10px] font-bold uppercase hover:underline">Refresh Analysis</button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {EXCLUSIONS.map((ex, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                   className="bg-[#0a0a0a] border border-yellow-500/20 p-6 rounded-2xl flex flex-col gap-5 shadow-sm hover:border-yellow-500/40 transition-all group"
                 >
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-3 text-yellow-500">
                       <AlertCircle size={18} />
                       <span className="font-bold uppercase tracking-[0.1em] text-xs transition-colors group-hover:text-white">{ex.region}</span>
                     </div>
                     <span className={`text-[10px] font-black uppercase ${ex.trend.startsWith('+') ? 'text-red-500/60' : 'text-emerald-500/60'}`}>
                       {ex.trend} Trend
                     </span>
                   </div>
                   
                   <p className="text-white/70 text-[15px] font-medium leading-relaxed">{ex.issue}</p>
                   
                   <div className="mt-2 flex items-center justify-between pt-5 border-t border-white/5">
                     <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">Affected Citizens</span>
                     <div className="flex items-baseline gap-1">
                       <span className="text-2xl font-black text-white">{ex.count}</span>
                       <span className="text-[10px] text-white/30 font-bold uppercase">Estimated</span>
                     </div>
                   </div>
                 </motion.div>
               ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
