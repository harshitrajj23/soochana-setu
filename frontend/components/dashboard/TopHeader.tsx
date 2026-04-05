"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Hexagon, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function TopHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard": return "Overview";
      case "/dashboard/upload": return "Upload Data";
      case "/dashboard/unify": return "Data Unification intelligence";
      case "/dashboard/insights": return "Beneficiary Insights";
      case "/dashboard/fraud": return "Fraud Detection Matrix";
      case "/dashboard/inclusion": return "Inclusion Gap Analysis";
      case "/dashboard/simulator": return "Policy Simulator Engine";
      case "/dashboard/verification": return "Verification Node";
      default: return "Dashboard";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#050505] border-b border-[#D4AF37]/20 z-50 flex items-center px-6 justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)] font-sans">
      
      {/* Left: Logo & Back Button */}
      <div className="flex items-center gap-6 w-[320px]">
        <div className="flex items-center gap-3">
          <div className="text-[#D4AF37]">
            <Hexagon size={24} strokeWidth={2.5} fill="#D4AF37" fillOpacity={0.1} />
          </div>
          <span className="text-white font-bold tracking-tight text-lg">Soochana Setu</span>
        </div>

        {/* Back Button */}
        {pathname !== "/dashboard" && (
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#D4AF37]/60 hover:text-[#D4AF37] transition-all duration-300 group cursor-pointer"
          >
            <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-[#D4AF37]/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider">Back</span>
          </button>
        )}
      </div>

      {/* Center: Dynamic Title */}
      <div className="flex-1 flex justify-center">
        <h2 className="text-white/90 font-semibold tracking-wide text-sm md:text-[15px] uppercase">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-5 w-[240px] justify-end">
        <button className="text-white/40 hover:text-white transition-colors duration-300">
          <Search size={18} />
        </button>
        <button className="text-white/40 hover:text-white transition-colors duration-300 relative">
          <Bell size={18} />
          {/* Unread indicator */}
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#050505]" />
        </button>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#D4AF37]/40 to-black border border-[#D4AF37]/20 ml-2" />
      </div>

    </header>
  );
}
