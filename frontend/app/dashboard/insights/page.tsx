"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Users, RefreshCw, AlertCircle, CheckCircle2, UserCircle2 } from "lucide-react";
import { getBeneficiaryInsights } from "@/lib/api";

export default function InsightsPage() {
  const [scanning, setScanning] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const startScan = async () => {
    setScanning(true);
    setDataReady(false);
    try {
      const res = await getBeneficiaryInsights();
      if (res.success && Array.isArray(res.data)) {
        // Data is already sorted by confidence descending from the backend
        setProfiles(res.data);
        setDataReady(true);
      }
    } catch (err: any) {
      console.error("INSIGHTS ERROR:", err.message);
    } finally {
      setScanning(false);
    }
  };

  // Filter profiles based on search query
  const filteredProfiles = profiles.filter(p => 
    (p.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (p.id?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-8">
      
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-white underline decoration-[#D4AF37]/30 underline-offset-8">Beneficiary Insights</h1>
          <p className="text-sm text-white/50">Real-time repository of unified beneficiary profiles and integrity markers.</p>
        </div>
        
        {dataReady && (
          <div className="relative w-full max-w-xs mt-4 md:mt-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            
            <div className="text-center flex flex-col gap-2 px-4">
              <h3 className="text-white/80 font-bold text-xl tracking-tight">Intelligence Repository Offline</h3>
              <p className="text-white/30 text-sm max-w-md mx-auto small text-balance">Access federal data nodes and aggregate unified beneficiary profiles into visual insight markers.</p>
            </div>

            <button 
              onClick={startScan}
              className="px-10 py-3.5 rounded-full bg-[#D4AF37] text-black font-black tracking-widest text-xs uppercase hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] cursor-pointer"
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
            className="flex flex-col gap-6"
          >
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProfiles.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col gap-6 shadow-sm hover:border-[#D4AF37]/30 transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1.5 w-full">
                        <div className="flex items-center gap-2">
                          <UserCircle2 size={16} className="text-[#D4AF37]/40" />
                          <span className="text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">{p.full_name || "Not Available"}</span>
                        </div>
                        <div className="flex flex-col gap-0.5 ml-6">
                           <span className="text-[10px] uppercase font-black text-white/20 tracking-widest">Location</span>
                           <span className="text-white/40 text-[11px] font-medium truncate">{p.address || "Not Available"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 px-1">
                       <div className="flex justify-between items-end">
                         <span className="text-[9px] font-black tracking-widest text-white/20 uppercase">Internal Status</span>
                         <span className={`text-[10px] font-bold tracking-widest uppercase ${p.verification_status === 'verified' ? 'text-emerald-500' : p.verification_status === 'rejected' ? 'text-red-500' : 'text-[#D4AF37]/60'}`}>
                           {p.verification_status || "pending"}
                         </span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 pt-5 border-t border-white/5 mt-auto">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">Confidence Score</span>
                        <span className="text-sm font-black tabular-nums text-[#D4AF37]">{p.confidence_score || 0}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${p.confidence_score || 0}%` }}
                           transition={{ duration: 1.2, delay: 0.3 + i * 0.05 }}
                           className="h-full bg-gradient-to-r from-[#D4AF37]/50 to-[#D4AF37]"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/10 rounded-[2rem] gap-4">
                <AlertCircle size={40} className="text-white/10" />
                <div className="text-center">
                  <h3 className="text-white/40 font-bold text-lg">No Results Found</h3>
                  <p className="text-white/20 text-xs">Try adjusting your search criteria or running a new scan.</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
