"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

export default function InsightsPage() {
  const [scanning, setScanning] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  const startScan = () => {
    setScanning(true);
    setDataReady(false);
    setTimeout(() => {
      setScanning(false);
      setDataReady(true);
    }, 2500);
  };

  const PROFILES = [
    { name: "Rajesh Kumar", address: "Sector 4, Rohini, Delhi", confidence: 98, status: "Verified" },
    { name: "Anita Devi", address: "Kankarbagh, Patna, BR", confidence: 92, status: "Verified" },
    { name: "Priya Patel", address: "Navrangpura, AMD", confidence: 96, status: "Verified" },
    { name: "Amit Sharma", address: "Phase 1, Electronic City, BLR", confidence: 64, status: "Duplicate", badge: "yellow" },
    { name: "Suresh Babu", address: "Main Road, Gandhi Nagar, CNH", confidence: 42, status: "Missing Data", badge: "red" },
    { name: "Ramesh Singh", address: "Indira Nagar, LKO", confidence: 61, status: "Duplicate", badge: "yellow" },
  ];

  return (
    <div className="w-full flex flex-col gap-8">
      
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">Beneficiary Insights</h1>
          <p className="text-sm text-white/50">Detailed repository of unified profiles and their integrity markers.</p>
        </div>
        
        {dataReady && (
          <div className="relative w-full max-w-xs mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input 
              type="text" 
              placeholder="Search UID or Name..." 
              className="w-full bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/60 transition-colors"
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!scanning && !dataReady && (
          <motion.div 
            key="init"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center justify-center py-32 border border-white/5 bg-white/[0.01] rounded-[2rem] gap-8 shadow-2xl"
          >
            <div className="relative">
              <div className="p-6 rounded-full bg-white/5 text-white/10">
                <Users size={56} strokeWidth={1} />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute inset-0 bg-[#D4AF37]/5 blur-2xl rounded-full"
              />
            </div>
            
            <div className="text-center flex flex-col gap-2">
              <h3 className="text-white/80 font-bold text-xl tracking-tight">Intelligence Repository Offline</h3>
              <p className="text-white/30 text-sm max-w-md mx-auto">Trigger a deep system scan to cross-reference beneficiary hashes and populate visual insight markers.</p>
            </div>

            <button 
              onClick={startScan}
              className="px-10 py-3.5 rounded-full bg-[#D4AF37] text-black font-bold tracking-widest text-xs uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
            >
              Initiate System Scan
            </button>
          </motion.div>
        )}

        {scanning && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-40 gap-8"
          >
            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute w-20 h-20 border-t-2 border-r-2 border-[#D4AF37] rounded-full"
              />
              <RefreshCw size={24} className="text-[#D4AF37] animate-pulse" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-white font-bold tracking-[0.4em] uppercase text-xs animate-pulse">Scanning Data Nodes</span>
              <span className="text-white/20 text-[10px] font-mono tracking-widest">Accessing secure federal protocols...</span>
            </div>
          </motion.div>
        )}

        {dataReady && (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {PROFILES.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-sm hover:border-[#D4AF37]/30 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">{p.name}</span>
                    <div className="flex items-center gap-2 text-white/30 truncate">
                      <Search size={10} />
                      <span className="text-[10px] uppercase font-bold tracking-widest">{p.address}</span>
                    </div>
                  </div>
                  
                  {p.badge === 'yellow' ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-500/5 text-yellow-500 border border-yellow-500/20">
                      <AlertCircle size={10} />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Duplicate</span>
                    </div>
                  ) : p.badge === 'red' ? (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/5 text-red-500 border border-red-500/20">
                      <AlertCircle size={10} />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Missing Data</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/5 text-emerald-500 border border-emerald-500/20">
                      <CheckCircle2 size={10} />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Verified</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
                  <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Confidence Index</span>
                  <span className={`text-sm font-black tracking-tight ${p.badge ? 'text-white/60' : 'text-[#D4AF37]'}`}>{p.confidence}%</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
