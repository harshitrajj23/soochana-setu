"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, FileStack, ShieldAlert, UserX, Cpu, RefreshCw, BarChart3, PieChart } from "lucide-react";

export default function DashboardHome() {
  const [scanning, setScanning] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  const runScan = () => {
    setScanning(true);
    setDataReady(false);
    setTimeout(() => {
      setScanning(false);
      setDataReady(true);
    }, 2000);
  };

  const STATS = [
    { label: "Total Beneficiaries", value: dataReady ? "48.2M" : "---", icon: Users },
    { label: "Unified Profiles", value: dataReady ? "39.5M" : "---", icon: FileStack },
    { label: "Fraud Cases Detected", value: dataReady ? "24,892" : "---", icon: ShieldAlert },
    { label: "Excluded Citizens", value: dataReady ? "2.1M" : "---", icon: UserX },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Action Header */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-6 rounded-2xl">
        <div className="flex flex-col gap-1">
          <h3 className="text-white font-bold text-lg">System Intelligence Overview</h3>
          <p className="text-white/40 text-xs uppercase tracking-widest">Global metrics across all integrated state departments</p>
        </div>
        
        <button 
          onClick={runScan}
          disabled={scanning}
          className="px-6 py-2.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {scanning ? <RefreshCw size={18} className="animate-spin" /> : <Cpu size={18} />}
          <span>{scanning ? "Scanning System..." : (dataReady ? "Refresh Scan" : "Run System Scan")}</span>
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
            className={`bg-[#0a0a0a] border ${dataReady ? 'border-[#D4AF37]/20 outline-1 outline-[#D4AF37]/5' : 'border-white/5'} rounded-xl p-5 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)] h-[130px] transition-all duration-500`}
          >
            <div className="flex items-start justify-between w-full">
              <span className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">{stat.label}</span>
              <stat.icon size={16} className={dataReady ? "text-[#D4AF37]" : "text-white/20"} />
            </div>
            <div className={`text-3xl font-bold tracking-tight mt-auto ${dataReady ? 'text-white' : 'text-white/10'}`}>
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[340px]">
        {/* Bar Chart Container */}
        <motion.div 
          className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 flex flex-col h-full shadow-inner relative overflow-hidden"
        >
          <div className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-8 flex items-center gap-2">
            <BarChart3 size={14} />
            Unification Rate (Monthly)
          </div>
          
          <AnimatePresence mode="wait">
            {dataReady ? (
              <motion.div 
                key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 flex items-end gap-4 px-2"
              >
                {[40, 55, 45, 75, 60, 85, 95].map((h, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ height: 0 }} animate={{ height: `${h}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.05, ease: "circOut" }}
                    className="flex-1 bg-gradient-to-t from-[#D4AF37]/5 to-[#D4AF37]/50 rounded-t-sm" 
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                className="flex-1 flex items-center justify-center flex-col gap-3"
              >
                <div className="text-white/20">No data records computed</div>
                <div className="w-full flex items-end gap-4 h-32 px-4">
                   {[10, 15, 12, 18, 14, 20, 25].map((h, i) => (
                     <div key={i} className="flex-1 bg-white/5 rounded-t-sm" style={{ height: `${h}%` }} />
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Composition Chart Container */}
        <motion.div 
          className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 flex flex-col h-full shadow-inner relative"
        >
          <div className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase mb-8 flex items-center gap-2">
            <PieChart size={14} />
            System Traffic Composition
          </div>
          
          <AnimatePresence mode="wait">
            {dataReady ? (
              <motion.div 
                key="data" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 flex flex-col justify-center gap-7 px-4"
              >
                {[
                  { l: "Citizen Portal", p: 65, o: 1 },
                  { l: "Internal Govt", p: 25, o: 0.7 },
                  { l: "API Partners", p: 10, o: 0.4 },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-bold text-white/80 mb-2 tracking-wide uppercase">
                      <span>{item.l}</span>
                      <span className="text-[#D4AF37]">{item.p}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${item.p}%` }}
                        transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                        className="h-full bg-[#D4AF37]"
                        style={{ opacity: item.o }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty" initial={{ opacity: 0 }} animate={{ opacity: 0.3 }}
                className="flex-1 flex items-center justify-center flex-col gap-6"
              >
                <div className="text-white/20">Awaiting system statistics...</div>
                <div className="w-full h-1 bg-white/5 rounded-full" />
                <div className="w-full h-1 bg-white/5 rounded-full" />
                <div className="w-full h-1 bg-white/5 rounded-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
}
