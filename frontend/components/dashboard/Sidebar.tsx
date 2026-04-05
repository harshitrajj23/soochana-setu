"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  UploadCloud, 
  Dna, 
  Users, 
  ShieldAlert, 
  UserX, 
  ActivitySquare, 
  KeyRound 
} from "lucide-react";
import { motion } from "framer-motion";

const MENU_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload Data", href: "/dashboard/upload", icon: UploadCloud },
  { name: "Unify Data", href: "/dashboard/unify", icon: Dna },
  { name: "Beneficiary Insights", href: "/dashboard/insights", icon: Users },
  { name: "Fraud Detection", href: "/dashboard/fraud", icon: ShieldAlert },
  { name: "Inclusion Gap", href: "/dashboard/inclusion", icon: UserX },
  { name: "Policy Simulator", href: "/dashboard/simulator", icon: ActivitySquare },
  { name: "Verification", href: "/dashboard/verification", icon: KeyRound },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[280px] h-screen fixed left-0 top-0 border-r border-[#D4AF37]/10 bg-black/80 backdrop-blur-md z-40 flex flex-col pt-24 pb-8 px-4 font-sans">
      <nav className="flex-1 overflow-y-auto w-full flex flex-col gap-2 no-scrollbar">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="relative flex items-center w-full group py-3 px-4 rounded-lg transition-all duration-300 flex-shrink-0"
            >
              {/* Highlight background text */}
              <motion.div 
                whileHover={{ x: 6 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex items-center gap-4 relative z-10 transition-colors duration-300 w-full ${isActive ? "text-[#D4AF37]" : "text-[#D4AF37]/60 group-hover:text-[#D4AF37]"}`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="transition-all duration-300" />
                <div className="flex flex-col relative overflow-hidden">
                  <span className={`text-[15px] tracking-wide transition-all duration-300 ${isActive ? "font-bold text-white" : "font-medium"}`}>
                    {item.name}
                  </span>
                  {/* Subtle Underline on Hover */}
                  {!isActive && (
                    <div className="absolute bottom-0 left-0 h-[1px] bg-[#D4AF37]/50 w-0 group-hover:w-full transition-all duration-500 ease-out" />
                  )}
                </div>
              </motion.div>
              
              {/* Gold Side Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="sidebarActive" 
                  className="absolute left-0 top-[20%] bottom-[20%] w-1 bg-[#D4AF37] rounded-r-full shadow-[0_0_15px_rgba(212,175,55,0.4)] z-0" 
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              {/* Hover background */}
              {!isActive && (
                <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto px-4">
        <div className="pt-6 border-t border-white/5 w-full flex flex-col gap-2">
           <div className="text-[11px] font-semibold tracking-wider text-white/30 uppercase">System Status</div>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
             <span className="text-sm font-medium text-white/70">Engine Secure</span>
           </div>
        </div>
      </div>
    </aside>
  );
}
