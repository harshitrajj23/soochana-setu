"use client";

import { motion } from "framer-motion";
import { User, ShieldCheck } from "lucide-react";

export default function CitizenDashboardPlaceholder() {
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center p-8 font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* Background - Diagonal Golden Stripes */}
      <div 
        className="absolute inset-y-0 left-0 w-[40vw] max-w-lg z-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, #D4AF37 40px, #D4AF37 41px)' }}
      />
      <div 
        className="absolute inset-y-0 right-0 w-[40vw] max-w-lg z-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, #D4AF37 40px, #D4AF37 41px)' }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-3xl p-10 max-w-2xl w-full flex flex-col items-center text-center gap-6 shadow-[0_15px_50px_rgba(0,0,0,0.8)]"
      >
        <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
           <User size={40} />
        </div>
        
        <div className="flex flex-col gap-2">
           <h1 className="text-3xl font-bold tracking-tight text-white">Citizen Portal Access Granted</h1>
           <p className="text-white/50 text-[15px]">Welcome to your unified beneficiary intelligence dashboard.</p>
        </div>

        <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-500 text-sm font-medium tracking-wide">
          <ShieldCheck size={18} />
          <span>Identity Verified</span>
        </div>

      </motion.div>
    </div>
  );
}
