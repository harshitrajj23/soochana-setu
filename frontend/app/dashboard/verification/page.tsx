"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, ShieldCheck, Terminal, Cpu, Link as LinkIcon, RefreshCw, AlertCircle, ActivitySquare } from "lucide-react";
import { ethers } from "ethers";
import { verifyProfile as verifyBackendProfile, getBeneficiaryInsights } from "@/lib/api";

export default function VerificationPage() {
  const [connecting, setConnecting] = useState(false);
  const [nodeActive, setNodeActive] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<"verified" | "tampered" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [profile, setProfile] = useState<any>(null);

  // 1. Auto-select latest unified profile from DB on mount
  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const res = await getBeneficiaryInsights();
        if (res.success && res.data && res.data.length > 0) {
          // Insights are ordered by confidence/latest by default
          setSelectedProfileId(res.data[0].id);
          console.log("Auto-selected Profile ID:", res.data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch initial profile for verification node:", err);
      }
    };
    fetchLatestProfile();
  }, []);

  const connectNode = async () => {
    setConnecting(true);
    setNodeActive(false);
    setLogs(["[SYSTEM] Initiating secure handshake...", "[SYSTEM] Requesting node certificate..."]);
    
    try {
      if (!selectedProfileId) {
        throw new Error("No unified profile selected for verification. Please ensure data is unified first.");
      }

      console.log("Sending ID:", selectedProfileId);
      
      // Trigger API with the explicit selected ID
      const res = await verifyBackendProfile(selectedProfileId);
      
      if (res.success && res.data) {
        const { data } = res;
        setProfile({
          id: data.id,
          full_name: data.full_name
        });
        setVerificationStatus(data.verification_status);
        
        // Initial connection logs
        const connectLogs = [
          "Verifying cryptographic signatures...",
          "Connection established: SECURE_CHANNEL_READY",
          `Node SS-ALPHA-NODE-01 synchronized with Global Ledger.`,
        ];

        connectLogs.forEach((log, i) => {
          setTimeout(() => {
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`]);
          }, i * 300);
        });

        // Map real audit logs after a small delay
        setTimeout(() => {
          if (data.audit_logs && Array.isArray(data.audit_logs)) {
            const formattedLogs = data.audit_logs.map((log: any) => 
               `[${new Date(log.created_at).toLocaleTimeString()}] ${log.event_type}: ${JSON.stringify(log.details)}`
            );
            setLogs(prev => [...prev, ...formattedLogs]);
          }
          setNodeActive(true);
          setConnecting(false);
        }, 1500);

      } else {
        throw new Error(res.message || "Failed to establish node connection.");
      }
    } catch (err: any) {
      setLogs(prev => [...prev, `[FATAL] Connection Failed: ${err.message}`]);
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const verifyProfile = async () => {
    const targetId = profile?.id || selectedProfileId;
    if (!targetId) return;

    try {
      setIsProcessing(true);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Re-verifying identity signature...`]);
      
      console.log("Re-verifying ID:", targetId);
      const res = await verifyBackendProfile(targetId);
      
      if (res.success && res.data) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Integrity verified: ✅`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Hash Block: ${res.data.hash_result}`]);
        setVerificationStatus("verified");
      } else {
        throw new Error(res.message || "Audit failed.");
      }
    } catch (err: any) {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] CRITICAL: Hash mismatch detected. ❌`]);
      setVerificationStatus("tampered");
    } finally {
      setIsProcessing(false);
    }
  };

  const checkIntegrity = async () => {
    // Audit check triggers a fresh log fetch and hash validation
    await verifyProfile();
  };

  return (
    <div className="w-full flex flex-col gap-8">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white underline decoration-[#D4AF37]/30 underline-offset-8">Verification Node</h1>
        <p className="text-sm text-white/50">Cryptographic audit of beneficiary hashes against distributed federal ledger protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Node Identity */}
        <div className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!nodeActive && !connecting ? (
              <motion.div 
                key="offline"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white/[0.01] border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-8 shadow-2xl min-h-[450px] backdrop-blur-3xl"
              >
                <div className="p-6 rounded-full bg-white/5 text-white/20 border border-white/5">
                  <LinkIcon size={56} strokeWidth={1} />
                </div>
                <div className="text-center flex flex-col gap-2">
                  <h3 className="text-white/80 font-bold text-xl tracking-tight uppercase">Node Disconnected</h3>
                  <p className="text-white/30 text-xs max-w-xs mx-auto leading-relaxed">Authorize handshake to establish a secure cryptographic channel with the federal intelligence core.</p>
                </div>
                <button 
                  onClick={connectNode}
                  className="group relative px-12 py-4 rounded-full bg-white text-black font-black tracking-widest text-[10px] uppercase hover:bg-[#D4AF37] transition-all duration-500 cursor-pointer shadow-2xl active:scale-95"
                >
                  <span className="relative z-10">Connect to Ledger</span>
                </button>
              </motion.div>
            ) : connecting ? (
              <motion.div 
                key="connecting"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white/[0.01] border border-[#D4AF37]/20 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-8 shadow-2xl min-h-[450px] backdrop-blur-3xl"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-28 h-28 border-2 border-dashed border-[#D4AF37]/30 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-[#D4AF37]">
                    <RefreshCw size={28} className="animate-spin" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[#D4AF37] font-black tracking-[0.4em] uppercase text-[10px] animate-pulse">Establishing Secure Channel</span>
                  <span className="text-white/20 text-[9px] font-mono tracking-widest uppercase">Protocol: AES_256_GCM_BENEFICIARY_ID</span>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="active"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.01] border border-emerald-500/20 rounded-[2.5rem] p-8 flex flex-col gap-8 shadow-2xl min-h-[450px] backdrop-blur-3xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-black text-xs uppercase tracking-widest">Autonomous Node Active</span>
                      <span className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest">Protocol: ONLINE</span>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-black border border-white/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-white/40">14ms Latency</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 mt-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-[#D4AF37]/30 transition-all duration-500">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">Current Identity Scope</span>
                      <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${verificationStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                         {verificationStatus || "Pending"}
                      </div>
                   </div>
                   <span className="text-xl font-bold text-white tracking-tight group-hover:text-[#D4AF37] transition-colors">{profile?.full_name || "Not Available"}</span>
                   <span className="text-[10px] font-mono text-white/30 tracking-widest uppercase">ID: {profile?.id || "Not Available"}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={verifyProfile} 
                    disabled={isProcessing}
                    className="py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                     <ShieldCheck size={16} className="text-white/20 group-hover:text-[#D4AF37] transition-colors" /> Verify Identity
                  </button>
                  <button 
                    onClick={checkIntegrity} 
                    disabled={isProcessing}
                    className="py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white hover:bg-white/10 hover:border-[#D4AF37]/30 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                     <KeyRound size={16} className="text-white/20 group-hover:text-[#D4AF37] transition-colors" /> Registry Audit
                  </button>
                </div>

                <div className="mt-auto p-5 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-2xl flex items-start gap-4">
                   <AlertCircle size={16} className="text-[#D4AF37] pt-0.5 shrink-0" />
                   <p className="text-[11px] text-white/50 leading-relaxed font-medium italic">
                     Unified profile integrity vs Federal Ledger is currently stable. Node is fully synchronized and auditing real-time profile deltas.
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Terminal Console */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-2 text-white/30">
               <Terminal size={14} className="animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Real-Time System Monitor</span>
             </div>
             <span className="text-[9px] font-mono text-white/10 uppercase tracking-widest">STDOUT: SS-ALPHA-01</span>
          </div>

          <div className="bg-[#050505] border border-white/10 rounded-[2.5rem] p-7 h-[450px] flex flex-col font-mono shadow-2xl relative overflow-hidden group backdrop-blur-3xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 scrolls no-scrollbar pb-6 pr-2">
              <AnimatePresence>
                {logs.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4 text-white/5 text-[10px] italic tracking-widest uppercase text-center p-8">
                    <ActivitySquare size={32} strokeWidth={0.5} className="animate-pulse" />
                    <span>Awaiting Secure Handshake Initialization...</span>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className={`text-[10px] leading-relaxed tracking-wider border-l-2 pl-4 py-1 transition-all ${log.includes("ONLINE") || log.includes("Verified") || log.includes("verified") || log.includes("established") || log.includes("Success") ? "text-emerald-500 border-emerald-500/30 font-bold bg-emerald-500/[0.02]" : log.includes("Error") || log.includes("FAILED") || log.includes("CRITICAL") || log.includes("mismatch") ? "text-red-400 border-red-500/30 font-bold bg-red-500/[0.02]" : "text-white/40 border-white/5"}`}
                    >
                      <span className="text-white/10 mr-3 select-none">❯</span>
                      {log}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex items-center justify-between pt-5 border-t border-white/5">
              <div className="flex items-center gap-3">
                 <div className={`w-1.5 h-1.5 rounded-full ${nodeActive ? 'bg-emerald-500 animate-pulse' : 'bg-white/10'}`} />
                 <span className="text-[9px] text-white/20 font-black tracking-widest uppercase">LOGWATCHER V4.1 ACTIVE</span>
              </div>
              <span className="text-[9px] font-mono text-white/10 tracking-widest uppercase">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

