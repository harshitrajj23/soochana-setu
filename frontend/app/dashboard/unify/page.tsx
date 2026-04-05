"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dna, RefreshCw, Database } from "lucide-react";
import { unifyData } from "@/lib/api";

export default function UnifyDataPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);
  const [unifiedProfiles, setUnifiedProfiles] = useState<any[]>([]);

  const startAnalysis = async () => {
    setAnalyzing(true);
    setResults(false);
    try {
      const res = await unifyData();
      if (res.success && Array.isArray(res.data)) {
        // Map backend profiles to UI structure using RAW database fields
        const mapped = res.data
          .map((item: any) => ({
            id: item.id || `profile-${Math.random()}`,
            full_name: item.full_name || "Not Available",
            confidence_score: Number(item.confidence_score || 0),
            address: item.address || "Not Available",
            verification_status: item.verification_status || "pending"
          }))
          .sort((a: any, b: any) => b.confidence_score - a.confidence_score); // SORT: Highest confidence first

        setUnifiedProfiles(mapped);
        setResults(true);
      }
    } catch (err: any) {
      console.error("UNIFY ERROR:", err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white underline decoration-[#D4AF37]/30 underline-offset-8">Unified Intelligence Engine</h1>
        <p className="text-sm text-white/50">Cross-reference fragmented records to build singular, high-confidence beneficiary profiles.</p>
      </div>

      <AnimatePresence mode="wait">
        {!analyzing && !results && (
          <motion.div 
            key="init"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-24 border border-white/5 bg-white/[0.02] rounded-3xl gap-6 shadow-[0_0_50px_-12px_rgba(212,175,55,0.05)]"
          >
            <div className="p-4 rounded-full bg-white/5 text-[#D4AF37]/40 shadow-inner">
              <Database size={40} strokeWidth={1} />
            </div>
            <div className="text-center flex flex-col gap-1">
              <h3 className="text-white/60 font-medium tracking-wide">Awaiting Data Correlation</h3>
              <p className="text-white/30 text-[10px] uppercase tracking-widest leading-relaxed">Connect ingestion nodes or<br/>trigger manual AI unification</p>
            </div>
            <button 
              onClick={startAnalysis}
              className="group relative flex items-center gap-3 px-10 py-3.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 transform active:scale-95 cursor-pointer shadow-lg shadow-[#D4AF37]/5"
            >
              <Dna size={20} className="group-hover:rotate-180 transition-transform duration-700" />
              <span className="text-xs font-black tracking-[0.2em] uppercase pt-0.5">Start Analysis</span>
            </button>
          </motion.div>
        )}

        {analyzing && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-8"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="text-[#D4AF37]/20"
              >
                <RefreshCw size={80} strokeWidth={0.5} />
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center text-[#D4AF37] animate-pulse">
                <Dna size={32} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="text-[#D4AF37] text-xs font-black tracking-[0.4em] uppercase animate-pulse">
                Running AI Unification...
              </span>
              <div className="flex gap-1.5 mt-2">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                  />
                ))}
              </div>
              <span className="text-white/20 text-[10px] uppercase font-bold tracking-widest mt-4">Cross-referencing global data registries</span>
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
                 <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                 <div className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Unification Confidence Map</div>
               </div>
               <button 
                 onClick={startAnalysis} 
                 className="flex items-center gap-2 text-[#D4AF37]/60 text-[10px] font-black uppercase tracking-widest hover:text-[#D4AF37] transition-colors group cursor-pointer"
               >
                 <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
                 Re-run Analysis
               </button>
             </div>
             
             {unifiedProfiles.length > 0 ? (
               unifiedProfiles.map((profile, i) => (
                 <motion.div 
                   key={profile.id}
                   initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05, duration: 0.4 }}
                   className="bg-white/[0.015] border border-white/5 hover:border-[#D4AF37]/40 p-6 rounded-2xl flex items-center justify-between shadow-sm transition-all duration-500 group cursor-default"
                 >
                   <div className="flex flex-col gap-1.5 w-1/3">
                     <span className="text-white font-bold tracking-tight text-lg group-hover:text-[#D4AF37] transition-colors duration-300">{profile.full_name}</span>
                     <div className="flex items-center gap-2">
                       <span className="text-[10px] font-mono tracking-widest text-white/30">{profile.verification_status}</span>
                     </div>
                   </div>
                   
                   <div className="flex flex-col gap-3 w-1/2">
                     <div className="flex justify-between items-end">
                       <div className="flex flex-col gap-0.5">
                         <span className="text-white/60 text-[10px] font-medium tracking-wide">{profile.address}</span>
                       </div>
                       <div className="flex flex-col items-end gap-0.5">
                         <span className={`text-[14px] font-black tabular-nums transition-colors duration-300 ${profile.confidence_score > 90 ? 'text-[#D4AF37]' : 'text-white/60'}`}>{profile.confidence_score}%</span>
                       </div>
                     </div>
                     <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden shadow-inner">
                       <motion.div 
                         className="h-full bg-gradient-to-r from-[#D4AF37]/50 to-[#D4AF37]"
                         initial={{ width: 0 }}
                         animate={{ width: `${profile.confidence_score}%` }}
                         transition={{ duration: 1, delay: 0.2 + i * 0.05, ease: "circOut" }}
                       />
                     </div>
                   </div>
                 </motion.div>
               ))
             ) : (
               <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 bg-white/[0.01] rounded-3xl gap-4">
                 <span className="text-white/20 text-xs font-black uppercase tracking-[0.3em]">No unified profiles found</span>
                 <span className="text-white/10 text-[9px] uppercase font-bold tracking-widest text-center">Execute entity resolution to aggregate ingested beneficiary nodes</span>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
