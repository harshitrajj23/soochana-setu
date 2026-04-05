"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { User, Shield } from "lucide-react";

export default function SelectRolePage() {
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-x-hidden pt-12 pb-12 px-6">
      
      {/* Background - Diagonal Golden Stripes */}
      <div 
        className="absolute inset-y-0 left-0 w-[40vw] max-w-lg z-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, #D4AF37 40px, #D4AF37 41px)' }}
      />
      <div 
        className="absolute inset-y-0 right-0 w-[40vw] max-w-lg z-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, #D4AF37 40px, #D4AF37 41px)' }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-br from-white to-[#c0a242] pb-1.5">
          Soochana Setu
        </h1>
        <p className="text-white/50 text-[17px] mb-12">Select your access type</p>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full justify-center">
          <Link href="/auth/citizen" className="w-full max-w-sm group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full py-16 bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[1.5rem] flex flex-col items-center justify-center gap-6 group-hover:border-[#c0a242] group-hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)] transition-colors duration-300"
            >
              <div className="p-5 rounded-full bg-white/5 text-[#D4AF37] group-hover:bg-[#c0a242]/20 transition-colors duration-300">
                <User size={48} strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold tracking-wide text-white group-hover:text-[#c0a242] transition-colors duration-300">Citizen</span>
            </motion.div>
          </Link>

          <Link href="/auth/government" className="w-full max-w-sm group">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-full py-16 bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-[1.5rem] flex flex-col items-center justify-center gap-6 group-hover:border-[#c0a242] group-hover:shadow-[0_10px_40px_rgba(212,175,55,0.15)] transition-colors duration-300"
            >
              <div className="p-5 rounded-full bg-white/5 text-[#D4AF37] group-hover:bg-[#c0a242]/20 transition-colors duration-300">
                <Shield size={48} strokeWidth={1.5} />
              </div>
              <span className="text-2xl font-bold tracking-wide text-white group-hover:text-[#c0a242] transition-colors duration-300">Government</span>
            </motion.div>
          </Link>
        </div>
      </motion.div>

    </div>
  );
}
