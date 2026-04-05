"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, RefreshCw, AlertTriangle, ShieldCheck, Activity } from "lucide-react";

export default function FraudDetectionPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);

  const triggerDetection = () => {
    setAnalyzing(true);
    setResults(false);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(true);
    }, 3000);
  };

  const FRAUDS = [
    { id: "UID-8821-M", issue: "Multiple active profiles across states", severity: "High", location: "Uttar Pradesh / Bihar" },
    { id: "UID-2091-B", issue: "Ghost beneficiary detection (DOB conflict)", severity: "Critical", location: "Madhya Pradesh" },
    { id: "UID-9912-K", issue: "Benefits claimed under invalid Aadhar", severity: "High", location: "Haryana" },
  ];

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Fraud Detection Matrix</h1>
        <p className="text-sm text-white/50">Run AI heuristics to identify systemic abuse, ghost beneficiaries, and multi-state duplications.</p>
      </div>

      <AnimatePresence mode="wait">
        {!analyzing && !results && (
          <motion.div 
            key="init"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-32 border border-red-500/10 bg-red-500/[0.01] rounded-[2rem] gap-8"
          >
            <div className="relative">
              <div className="p-6 rounded-full bg-red-500/10 text-red-500/30">
                <ShieldAlert size={56} strokeWidth={1} />
              </div>
              <motion.div 
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full"
              />
            </div>
            
            <div className="text-center flex flex-col gap-2">
              <h3 className="text-white/80 font-bold text-xl tracking-tight">Detection Engine Standby</h3>
              <p className="text-white/30 text-sm max-w-sm mx-auto">Deploy AI heuristics to cross-examine behavioral clusters and identity inconsistencies.</p>
            </div>

            <button 
              onClick={triggerDetection}
              className="px-10 py-3.5 rounded-full bg-red-500/10 border border-red-500/50 text-red-500 font-bold tracking-widest text-xs uppercase hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer shadow-[0_0_30px_rgba(239,68,68,0.1)]"
            >
              Run Global Heuristics
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
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="w-24 h-24 border-t-2 border-red-500 rounded-full opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity size={24} className="text-red-500 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-red-500 font-bold tracking-[0.4em] uppercase text-xs">Analyzing Anomalies</span>
              <span className="text-white/20 text-[10px] font-mono tracking-widest">Scanning 500k profile deltas/sec</span>
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
               <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">High-Risk Detections Flagged</div>
               <button onClick={triggerDetection} className="text-red-500 text-[10px] font-bold uppercase hover:underline">Re-run Scan</button>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
               {FRAUDS.map((fraud, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                   className="bg-[#0a0a0a] border border-red-500/20 p-6 rounded-xl flex items-start gap-6 shadow-sm hover:border-red-500/40 transition-colors group"
                 >
                   <div className="pt-1">
                     <div className="p-2 rounded-lg bg-red-500/5 text-red-500 group-hover:bg-red-500/10 transition-colors">
                        <AlertTriangle size={20} />
                     </div>
                   </div>
                   <div className="flex flex-col gap-1 w-full flex-1">
                     <div className="flex items-center justify-between">
                       <span className="text-white font-bold text-lg tracking-tight">{fraud.issue}</span>
                       <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-[9px] font-black uppercase tracking-tighter">
                         {fraud.severity}
                       </span>
                     </div>
                     <div className="flex items-center gap-6 mt-1">
                       <div className="flex items-center gap-2">
                         <span className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Identifier:</span>
                         <span className="text-white/50 text-[10px] font-mono">{fraud.id}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="text-white/20 text-[10px] uppercase font-bold tracking-widest">Region:</span>
                         <span className="text-white/50 text-[10px] font-mono">{fraud.location}</span>
                       </div>
                     </div>
                   </div>
                   <button className="px-5 py-2 border border-red-500/20 text-red-500 text-[10px] rounded-lg hover:bg-red-500 hover:text-white transition-all uppercase font-bold tracking-widest cursor-pointer">
                     Isolate Node
                   </button>
                 </motion.div>
               ))}
               
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                 className="mt-4 p-6 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-xl flex items-center gap-4"
               >
                 <div className="p-2 rounded-full bg-emerald-500/10 text-emerald-500">
                   <ShieldCheck size={20} />
                 </div>
                 <div className="flex flex-col">
                   <span className="text-white font-bold text-sm">System Integrity Stable</span>
                   <span className="text-white/30 text-xs uppercase tracking-widest">No additional behavioral anomalies detected in last 24h</span>
                 </div>
               </motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
