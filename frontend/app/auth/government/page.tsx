"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function GovernmentAuthPage() {
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen bg-black flex flex-col items-center justify-center overflow-x-hidden selection:bg-[#D4AF37] selection:text-black font-sans pt-12 pb-12">
      
      {/* Background - Diagonal Golden Stripes */}
      <div 
        className="absolute inset-y-0 left-0 w-[40vw] max-w-lg z-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, #D4AF37 40px, #D4AF37 41px)' }}
      />
      <div 
        className="absolute inset-y-0 right-0 w-[40vw] max-w-lg z-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, #D4AF37 40px, #D4AF37 41px)' }}
      />

      <div className="relative z-10 w-full max-w-[420px] px-6 flex flex-col items-center">
        
        {/* Refined Premium Title */}
        <h1 
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-1 bg-clip-text text-transparent bg-gradient-to-br from-white to-[#c0a242] pb-1.5 text-center"
        >
          Gov Node
        </h1>
        <p className="text-white/40 text-sm mb-6 uppercase tracking-wider font-semibold">Soochana Setu</p>

        {/* Sign In / Sign Up Switch Below Title */}
        <div className="flex gap-8 mb-6 mt-2">
          <button 
            onClick={() => setAuthType("signin")}
            className={`relative pb-1.5 text-[15px] tracking-wide transition-colors duration-300 font-medium ${authType === "signin" ? "text-[#D4AF37]" : "text-white/40 hover:text-white/70"}`}
          >
            Sign In
            {authType === "signin" && (
              <motion.div layoutId="authTabUnderlineGov" className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#D4AF37] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => setAuthType("signup")}
            className={`relative pb-1.5 text-[15px] tracking-wide transition-colors duration-300 font-medium ${authType === "signup" ? "text-[#D4AF37]" : "text-white/40 hover:text-white/70"}`}
          >
            Sign Up
            {authType === "signup" && (
              <motion.div layoutId="authTabUnderlineGov" className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#D4AF37] rounded-full" />
            )}
          </button>
        </div>

        {/* Solid Dark Debit Card Layout */}
        <motion.div 
          layout
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-full bg-gradient-to-br from-[#111] to-[#1a170a] border border-[#D4AF37]/30 rounded-[1.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Horizontal Slider Track */}
          <motion.div 
            className="flex w-[200%] items-start"
            animate={{ x: authType === "signin" ? "0%" : "-50%" }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          >
            
            {/* PANEL 1: SIGN IN */}
            <div className="w-1/2 p-7 flex flex-col gap-6">
              <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
                
                <div className="flex flex-col gap-1.5 w-full relative">
                  <label className="text-[10px] md:text-[11px] font-semibold text-white/40 tracking-wider uppercase ml-1">Email</label>
                  <input type="email" className="w-full bg-transparent border-0 border-b border-white/20 px-1 py-1.5 text-[15px] text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-[#c0a242] transition-colors duration-300" placeholder="admin@gov.in" />
                </div>
                
                <div className="flex flex-col gap-1.5 w-full relative">
                  <label className="text-[10px] md:text-[11px] font-semibold text-white/40 tracking-wider uppercase ml-1">Password</label>
                  <input type="password" className="w-full bg-transparent border-0 border-b border-white/20 px-1 py-1.5 text-[15px] text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-[#c0a242] transition-colors duration-300" placeholder="••••••••" />
                </div>

                <button 
                  type="submit" 
                  className="mt-4 rounded-full flex items-center justify-center w-full py-3 border border-[#c0a242] text-[#c0a242] bg-transparent transition-colors duration-300 ease-out hover:bg-[#c0a242] hover:text-black"
                >
                  <span className="text-[15px] font-medium tracking-wide">
                    Login
                  </span>
                </button>
              </form>
            </div>

            {/* PANEL 2: SIGN UP */}
            <div className="w-1/2 p-7 flex flex-col gap-5">
              <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
                
                <div className="flex flex-col gap-1 w-full relative">
                  <label className="text-[10px] md:text-[11px] font-semibold text-white/40 tracking-wider uppercase ml-1">Name</label>
                  <input type="text" className="w-full bg-transparent border-0 border-b border-white/20 px-1 py-1 text-[14px] md:text-[15px] text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-[#c0a242] transition-colors duration-300" placeholder="Officer Name" />
                </div>
                
                <div className="flex flex-col gap-1 w-full relative">
                  <label className="text-[10px] md:text-[11px] font-semibold text-white/40 tracking-wider uppercase ml-1">Email</label>
                  <input type="email" className="w-full bg-transparent border-0 border-b border-white/20 px-1 py-1 text-[14px] md:text-[15px] text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-[#c0a242] transition-colors duration-300" placeholder="email@gov.in" />
                </div>
                
                <div className="flex flex-col gap-1 w-full relative">
                  <label className="text-[10px] md:text-[11px] font-semibold text-white/40 tracking-wider uppercase ml-1">
                    Government ID
                  </label>
                  <input type="text" className="w-full bg-transparent border-0 border-b border-white/20 px-1 py-1 text-[14px] md:text-[15px] text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-[#c0a242] transition-colors duration-300" placeholder="Enter ID" />
                </div>
                
                <div className="flex flex-col gap-1 w-full relative">
                  <label className="text-[10px] md:text-[11px] font-semibold text-white/40 tracking-wider uppercase ml-1">Password</label>
                  <input type="password" className="w-full bg-transparent border-0 border-b border-white/20 px-1 py-1 text-[14px] md:text-[15px] text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-[#c0a242] transition-colors duration-300" placeholder="••••••••" />
                </div>

                <div className="flex flex-col gap-1 w-full relative">
                  <label className="text-[10px] md:text-[11px] font-semibold text-white/40 tracking-wider uppercase ml-1">Confirm Password</label>
                  <input type="password" className="w-full bg-transparent border-0 border-b border-white/20 px-1 py-1 text-[14px] md:text-[15px] text-white placeholder-white/20 focus:outline-none focus:ring-0 focus:border-[#c0a242] transition-colors duration-300" placeholder="••••••••" />
                </div>

                <button 
                  type="submit" 
                  className="mt-4 rounded-full flex items-center justify-center w-full py-3 border border-[#c0a242] text-[#c0a242] bg-transparent transition-colors duration-300 ease-out hover:bg-[#c0a242] hover:text-black"
                >
                  <span className="text-[15px] font-medium tracking-wide">
                    Create Account
                  </span>
                </button>

              </form>
            </div>
            
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
