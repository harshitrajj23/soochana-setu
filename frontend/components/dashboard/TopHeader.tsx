"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Hexagon, ArrowLeft, Home, UserCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard": return "Overview";
      case "/dashboard/upload": return "Upload Data";
      case "/dashboard/unify": return "Data Unification Intelligence";
      case "/dashboard/insights": return "Beneficiary Insights";
      case "/dashboard/fraud": return "Fraud Detection Matrix";
      case "/dashboard/inclusion": return "Inclusion Gap Analysis";
      case "/dashboard/simulator": return "Policy Simulator Engine";
      case "/dashboard/verification": return "Verification Node";
      default: return "Dashboard";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#050505]/80 backdrop-blur-md border-b border-[#D4AF37]/20 z-50 flex items-center px-6 justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)] font-sans">
      
      {/* Left: Branding & Back Button */}
      <div className="flex items-center gap-8 min-w-[320px]">
        <div className="flex items-center gap-3 group cursor-default">
          <motion.div
            whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
            className="transition-all duration-300"
          >
            <Image src="/logo.png" alt="Soochana Setu" width={32} height={32} className="rounded-md object-cover" />
          </motion.div>
          <span className="text-white font-bold tracking-tight text-base uppercase">Soochana Setu</span>
        </div>

        {/* Local Page Back Button */}
        {pathname !== "/dashboard" && (
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#D4AF37]/60 hover:text-[#D4AF37] transition-all duration-300 group cursor-pointer border-l border-white/10 pl-6"
          >
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-[#D4AF37]/10 transition-colors">
              <ArrowLeft size={14} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Back</span>
          </button>
        )}
      </div>

      {/* Center: Dynamic Title */}
      <div className="flex-1 text-center hidden md:block">
        <motion.h2 
          key={pathname}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/80 font-bold text-xs uppercase tracking-[0.3em]"
        >
          {getPageTitle()}
        </motion.h2>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 min-w-[320px] justify-end">
        <Link 
          href="/"
          className="flex items-center gap-2 text-white/40 hover:text-[#D4AF37] transition-all duration-300 group mr-4 relative px-2 py-1"
        >
          <Home size={16} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Exit to Landing</span>
          <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </Link>

        <div className="flex items-center gap-3 border-l border-white/10 pl-6">
          <button className="p-2 text-white/50 hover:text-[#D4AF37] transition-colors relative cursor-pointer group">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
            <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
          </button>
          
          <div className="flex items-center gap-3 ml-2 group cursor-pointer">
            <div className="text-right flex flex-col">
              <span className="text-white font-bold text-xs">Admin Node</span>
              <span className="text-emerald-500 text-[9px] font-bold tracking-tighter uppercase">Authorized Access</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:border-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-all duration-300">
               <UserCircle size={22} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
