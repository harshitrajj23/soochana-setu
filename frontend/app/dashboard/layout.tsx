"use client";

import { Sidebar } from "../../components/dashboard/Sidebar";
import { TopHeader } from "../../components/dashboard/TopHeader";
import { InteractiveGrid } from "../../components/dashboard/InteractiveGrid";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black text-white relative flex font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden">
      <InteractiveGrid />
      
      {/* Subtle Depth Layer Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(212,175,55,0.02)_100%)]" />
      
      <TopHeader />
      <Sidebar />
      
      <main className="flex-1 ml-[280px] pt-16 min-h-screen relative z-10 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-7xl mx-auto h-full flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
