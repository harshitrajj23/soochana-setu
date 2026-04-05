"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { User, Shield, ArrowUpRight } from "lucide-react";

export default function SelectRolePage() {
  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-x-hidden p-6 font-sans">
      
      {/* Top Brushed Branding Nav */}
      <motion.nav 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 h-20 px-8 flex items-center justify-between border-b border-[#D4AF37]/10 bg-black/60 backdrop-blur-xl z-50 overflow-hidden"
      >
        <div className="flex items-center gap-4 group cursor-default">
          <motion.div
            whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
            className="transition-all duration-300"
          >
            <Image src="/logo.png" alt="Soochana Setu" width={40} height={40} className="rounded-lg object-cover" />
          </motion.div>
          <span className="text-white font-bold tracking-tight text-xl uppercase">Soochana Setu</span>
        </div>

        <Link 
          href="/"
          className="relative text-white/60 hover:text-[#D4AF37] transition-all duration-300 flex items-center gap-2 group text-xs font-bold uppercase tracking-widest"
        >
          <span>Back to Home</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#D4AF37] group-hover:w-full transition-all duration-500 ease-out" />
        </Link>
      </motion.nav>

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
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8, delay: 0.3, ease: "circOut" }}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl mt-12"
      >
        <div className="flex flex-col gap-2 mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-[#D4AF37] leading-[1.2]">
            Inter-Ministry Intelligence
          </h1>
          <p className="text-[#D4AF37]/50 text-sm font-bold tracking-[0.4em] uppercase">Select your access portal</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full justify-center">
          <Link href="/auth/citizen" className="w-full max-w-sm group">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full py-16 bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 group-hover:border-[#D4AF37]/60 group-hover:shadow-[0_20px_60px_rgba(212,175,55,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 rounded-full bg-white/5 text-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-colors duration-300 relative z-10">
                <User size={52} strokeWidth={1} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#D4AF37] transition-colors duration-300 relative z-10">Citizen</span>
            </motion.div>
          </Link>

          <Link href="/auth/government" className="w-full max-w-sm group">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full py-16 bg-[#0a0a0a] border border-[#D4AF37]/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 group-hover:border-[#D4AF37]/60 group-hover:shadow-[0_20px_60px_rgba(212,175,55,0.1)] transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 rounded-full bg-white/5 text-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-colors duration-300 relative z-10">
                <Shield size={52} strokeWidth={1} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white group-hover:text-[#D4AF37] transition-colors duration-300 relative z-10">Government</span>
            </motion.div>
          </Link>
        </div>
      </motion.div>

    </div>
  );
}
