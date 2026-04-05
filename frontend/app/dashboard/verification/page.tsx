"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, ShieldCheck, Terminal, Cpu, Link as LinkIcon, RefreshCw, AlertCircle, ActivitySquare } from "lucide-react";

export default function VerificationPage() {
  const [connecting, setConnecting] = useState(false);
  const [nodeActive, setNodeActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const connectNode = () => {
    setConnecting(true);
    setNodeActive(false);
    setLogs([]);
    
    const initialLogs = [
      "Initializing secure handshake...",
      "Requesting node certificate from federal server...",
      "Verifying cryptographic signatures...",
      "Connecting to distributed beneficiary ledger...",
    ];

    initialLogs.forEach((log, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
      }, i * 400);
    });

    setTimeout(() => {
      setConnecting(false);
      setNodeActive(true);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] NODE ONLINE: SECURE_CHANNEL_READY`]);
    }, 2500);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full flex flex-col gap-8">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Verification Node</h1>
        <p className="text-sm text-white/50">Cryptographic audit of beneficiary hashes against distributed ledger protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Node Identity */}
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!nodeActive && !connecting ? (
              <motion.div 
                key="offline"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-8 shadow-xl min-h-[400px]"
              >
                <div className="p-6 rounded-full bg-white/5 text-white/20">
                  <LinkIcon size={48} strokeWidth={1} />
                </div>
                <div className="text-center flex flex-col gap-2">
                  <h3 className="text-white/80 font-bold text-xl tracking-tight">Node Disconnected</h3>
                  <p className="text-white/30 text-sm max-w-xs mx-auto">Authorize connection to establish a secure cryptographic channel with the central intelligence core.</p>
                </div>
                <button 
                  onClick={connectNode}
                  className="px-10 py-3.5 rounded-full bg-white text-black font-bold tracking-widest text-xs uppercase hover:bg-[#D4AF37] transition-all duration-300 cursor-pointer shadow-xl"
                >
                  Connect to Ledger
                </button>
              </motion.div>
            ) : connecting ? (
              <motion.div 
                key="connecting"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-8 shadow-xl min-h-[400px]"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-24 h-24 border-2 border-dashed border-[#D4AF37]/30 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[#D4AF37]">
                    <RefreshCw size={24} className="animate-spin" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[#D4AF37] font-bold tracking-[0.4em] uppercase text-xs">Negotiating Handoff</span>
                  <span className="text-white/20 text-[10px] font-mono tracking-widest uppercase">Protocol: TLS_RSA_BENEFICIARY_ID</span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="active"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0a0a0a] border border-emerald-500/20 rounded-[2rem] p-8 flex flex-col gap-8 shadow-xl min-h-[400px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-base">Node SS-ALPHA-01</span>
                      <span className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest">Connection Active</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded bg-black border border-white/10 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-white/50">21ms Latency</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Core Temp", value: "42°C", icon: Cpu },
                    { label: "Audit Rate", value: "892/s", icon: ActivitySquare },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/5 p-4 rounded-xl flex items-center gap-4">
                      <stat.icon size={16} className="text-white/30" />
                      <div className="flex flex-col">
                        <span className="text-[9px] text-white/20 uppercase font-black tracking-widest">{stat.label}</span>
                        <span className="text-lg font-bold text-white tracking-widest">{stat.value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-start gap-4">
                   <AlertCircle size={14} className="text-white/40 pt-0.5 shrink-0" />
                   <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                     Cryptographic verify integrity of current local cache vs Global Ledger is 100%. Node is fully synchronized and ready for real-time audit.
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Terminal Console */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2 text-white/40">
               <Terminal size={14} />
               <span className="text-[10px] font-bold uppercase tracking-widest">System Monitor</span>
             </div>
             <span className="text-[10px] font-mono text-white/20 uppercase">STDOUT: NODE-01</span>
          </div>

          <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 h-[400px] flex flex-col font-mono shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 scrolls no-scrollbar pb-4">
              <AnimatePresence>
                {logs.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-white/10 text-xs italic tracking-widest uppercase">
                    Awaiting system initialization...
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                      className={`text-[11px] ${log.includes("ONLINE") ? "text-emerald-500 font-bold" : "text-white/60"}`}
                    >
                      <span className="text-white/20 mr-3">{">"}</span>
                      {log}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center gap-2 pt-4 border-t border-white/5 text-[10px] text-white/20">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span>LOGWATCHER V2.4 RUNNING</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
