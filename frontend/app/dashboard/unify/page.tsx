"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dna, RefreshCw, Database } from "lucide-react";

export default function UnifyDataPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(false);

  const startAnalysis = () => {
    setAnalyzing(true);
    setResults(false);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(true);
    }, 2500);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Unified Intelligence Engine</h1>
        <p className="text-sm text-white/50">Cross-reference fragmented records to build singular, high-confidence beneficiary profiles.</p>
      </div>

      <AnimatePresence mode="wait">
        {!analyzing && !results && (
          <motion.div 
            key="init"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-24 border border-white/5 bg-white/[0.02] rounded-3xl gap-6"
          >
            <div className="p-4 rounded-full bg-white/5 text-white/20">
              <Database size={40} strokeWidth={1} />
            </div>
            <div className="text-center flex flex-col gap-1">
              <h3 className="text-white/60 font-medium tracking-wide">Awaiting Data Correlation</h3>
              <p className="text-white/30 text-xs uppercase tracking-widest">Connect ingestion nodes or trigger manual unification</p>
            </div>
            <button 
              onClick={startAnalysis}
              className="group relative flex items-center gap-3 px-10 py-3.5 bg-[#D4AF37]/10 border border-[#D4AF37]/50 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 transform active:scale-95 cursor-pointer"
            >
              <Dna size={20} />
              <span className="text-sm font-bold tracking-widest uppercase">Start Analysis</span>
            </button>
          </motion.div>
        )}

        {analyzing && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-6"
          >
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
              <RefreshCw size={32} className="text-[#D4AF37]" strokeWidth={1.5} />
            </motion.div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-white/70 text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
                Analyzing data nodes...
              </span>
              <span className="text-white/20 text-[10px] uppercase font-medium tracking-widest">Cross-referencing 1.2M records</span>
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
               <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Unification Confidence Map</div>
               <button onClick={startAnalysis} className="text-[#D4AF37] text-[10px] font-bold uppercase hover:underline">Re-run Analysis</button>
             </div>
             
             {[
               { name: "Rajesh Kumar", id: "UID-8942-X", score: 98, meta: "Primary record verified" },
               { name: "Anita Devi", id: "UID-1124-A", score: 92, meta: "High confidence match" },
               { name: "Sunil Verma", id: "UID-4491-M", score: 85, meta: "Biometric correlation pending" },
               { name: "Meena Singh", id: "UID-7732-K", score: 79, meta: "Partial metadata overlap" },
             ].map((profile, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                 className="bg-[#0a0a0a] border border-white/10 p-5 rounded-xl flex items-center justify-between shadow-sm hover:border-[#D4AF37]/30 transition-colors group"
               >
                 <div className="flex flex-col gap-1 w-1/3">
                   <span className="text-white font-bold tracking-tight text-base group-hover:text-[#D4AF37] transition-colors">{profile.name}</span>
                   <span className="text-white/30 text-[10px] font-mono tracking-widest">{profile.id}</span>
                 </div>
                 
                 <div className="flex flex-col gap-2 w-1/2">
                   <div className="flex justify-between text-[10px] text-white/50 uppercase font-bold tracking-wider">
                     <span>{profile.meta}</span>
                     <span className={profile.score > 90 ? 'text-[#D4AF37]' : ''}>{profile.score}%</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                       className="h-full bg-[#D4AF37]"
                       initial={{ width: 0 }}
                       animate={{ width: `${profile.score}%` }}
                       transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "circOut" }}
                     />
                   </div>
                 </div>
               </motion.div>
             ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
