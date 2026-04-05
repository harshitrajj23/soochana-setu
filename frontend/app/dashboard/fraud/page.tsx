"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, RefreshCw, AlertTriangle, ShieldCheck, Activity } from "lucide-react";
import { detectFraud } from "@/lib/api";

export default function FraudDetectionPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);
  const [frauds, setFrauds] = useState<any[]>([]);

  const triggerDetection = async () => {
    setAnalyzing(true);
    setResults(false);
    try {
      const res = await detectFraud();
      if (res.success && Array.isArray(res.data)) {
        // Map the results using RAW database fields
        const mappedFrauds = res.data.map((f: any) => ({
          id: f.beneficiary_id || f.id || "Not Available",
          issue: f.fraud_reason || "System Anomaly Detected",
          severity: f.risk_level || "LOW",
          location: f.region || "Not Available",
          name: f.full_name || "Not Available"
        }));
        setFrauds(mappedFrauds);
        setResults(true);
      }
    } catch (err: any) {
      console.error("FRAUD ERROR:", err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white underline decoration-red-500/30 underline-offset-8 tracking-wider">Fraud Detection Matrix</h1>
        <p className="text-sm text-white/50">Run AI heuristics to identify systemic abuse, ghost beneficiaries, and multi-state duplications.</p>
      </div>

      <AnimatePresence mode="wait">
        {!analyzing && !results && (
          <motion.div 
            key="init"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-32 border border-red-500/10 bg-red-500/[0.01] rounded-[2rem] gap-8 shadow-[0_0_50px_-12px_rgba(239,68,68,0.05)]"
          >
            <div className="relative">
              <div className="p-6 rounded-full bg-red-500/10 text-red-500/30">
                <ShieldAlert size={56} strokeWidth={1} />
              </div>
              <motion.div 
                animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute inset-0 bg-red-500/10 blur-3xl rounded-full"
              />
            </div>
            
            <div className="text-center flex flex-col gap-2 px-4">
              <h3 className="text-white/80 font-bold text-xl tracking-tight uppercase">Detection Engine Standby</h3>
              <p className="text-white/30 text-sm max-w-sm mx-auto leading-relaxed">Deploy AI heuristics to cross-examine behavioral clusters and identity inconsistencies across federal registries.</p>
            </div>

            <button 
              onClick={triggerDetection}
              className="group relative px-10 py-3.5 rounded-full bg-red-500/10 border border-red-500/50 text-red-500 font-black tracking-widest text-xs uppercase hover:bg-red-500 hover:text-white transition-all duration-500 cursor-pointer shadow-lg shadow-red-500/5 active:scale-95"
            >
              <div className="flex items-center gap-3">
                 <Activity size={16} className="group-hover:animate-pulse" />
                 <span className="pt-0.5">Run Global Heuristics</span>
              </div>
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
                className="w-24 h-24 border-t-2 border-red-500 rounded-full opacity-40 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity size={24} className="text-red-500 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-red-500 font-bold tracking-[0.4em] uppercase text-xs animate-pulse">Analyzing Anomalies</span>
              <span className="text-white/20 text-[10px] font-mono tracking-widest uppercase">Scanning multi-scheme profile deltas</span>
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
                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                 <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">High-Risk Heuristic Audit Complete</div>
               </div>
               <button onClick={triggerDetection} className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline group cursor-pointer transition-all">
                 <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                 Re-run Scan
               </button>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
               {frauds.length > 0 ? (
                 frauds.map((fraud, i) => (
                   <motion.div 
                     key={`fraud-${fraud.id}-${i}`}
                     initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }}
                     className="bg-white/[0.015] border border-white/5 p-6 rounded-2xl flex items-start gap-6 shadow-sm hover:border-red-500/20 transition-all duration-500 group"
                   >
                     <div className="pt-1">
                       <div className={`p-2.5 rounded-xl border transition-colors ${fraud.severity === 'HIGH' ? 'bg-red-500/5 text-red-500 border-red-500/10' : fraud.severity === 'MEDIUM' ? 'bg-orange-500/5 text-orange-500 border-orange-500/10' : 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10'}`}>
                          <AlertTriangle size={20} strokeWidth={2.5} />
                       </div>
                     </div>
                     <div className="flex flex-col gap-2 w-full flex-1">
                       <div className="flex items-center justify-between">
                         <div className="flex flex-col gap-0.5">
                            <span className="text-white font-bold text-lg tracking-tight group-hover:text-red-500 transition-colors duration-300">{fraud.name || "Unknown"}</span>
                            <span className="text-[11px] font-medium text-white/40 max-w-lg leading-relaxed">{fraud.issue || "Heuristic anomaly detected"}</span>
                         </div>
                         <div className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-current opacity-60 ${fraud.severity === 'HIGH' ? 'text-red-500' : fraud.severity === 'MEDIUM' ? 'text-orange-500' : 'text-emerald-500'}`}>
                           {fraud.severity || "UNKNOWN"}
                         </div>
                       </div>
                       <div className="flex items-center gap-8 mt-3 pt-4 border-t border-white/5">
                         <div className="flex flex-col gap-1">
                           <span className="text-white/20 text-[9px] uppercase font-black tracking-widest">Beneficiary ID</span>
                           <span className="text-white/50 text-[10px] font-mono tracking-widest">{fraud.id || "Not Available"}</span>
                         </div>
                         <div className="flex flex-col gap-1">
                           <span className="text-white/20 text-[9px] uppercase font-black tracking-widest">Region Anchor</span>
                           <span className="text-white/50 text-[10px] font-mono tracking-widest">{fraud.location || "Not Available"}</span>
                         </div>
                       </div>
                     </div>
                   </motion.div>
                 ))
               ) : (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
                   className="mt-4 p-8 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-3xl flex flex-col items-center gap-4 text-center shadow-lg shadow-emerald-500/5"
                 >
                   <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-500">
                     <ShieldCheck size={40} strokeWidth={1} />
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-white font-bold text-lg uppercase tracking-tight">No fraud detected</span>
                     <span className="text-white/30 text-[10px] uppercase font-black tracking-[0.2em]">Heuristic engine cross-registry integrity audit: stable</span>
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
