"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../components/providers/AuthContext";
import { Sidebar } from "../../components/dashboard/Sidebar";
import { TopHeader } from "../../components/dashboard/TopHeader";
import { InteractiveGrid } from "../../components/dashboard/InteractiveGrid";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading: authContextLoading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll Lock: Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // 1. Safety Timeout: Force resolution after 2 seconds to prevent infinite lock
    const safetyTimeout = setTimeout(() => {
      setCheckingAuth(false);
    }, 2000);

    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    if (!token) {
      console.log("No token found, redirecting to /select-role");
      router.push("/select-role");
      clearTimeout(safetyTimeout);
      setCheckingAuth(false);
    } else {
      // 2. ONLY attempt authorization once AuthContext hydration is complete
      if (!authContextLoading) {
        if (user) {
          setIsAuthorized(true);
          setCheckingAuth(false);
          clearTimeout(safetyTimeout);
        } else {
          // If token exists but user is not in context after hydration, it's an invalid session
          console.log("Token invalid or user data missing, redirecting to /select-role");
          setCheckingAuth(false);
          clearTimeout(safetyTimeout);
        }
      }
    }

    return () => clearTimeout(safetyTimeout);
  }, [user, authContextLoading, router]);

  // 2. Redirect Side-Effect: Consistently handle unauthorized redirection
  useEffect(() => {
    if (!checkingAuth && !isAuthorized) {
      router.push("/select-role");
    }
  }, [checkingAuth, isAuthorized, router]);

  // Loading state while checking authentication
  if (checkingAuth || authContextLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="text-[#D4AF37] animate-pulse font-bold tracking-widest uppercase text-sm">
          Securing Session...
        </div>
        <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
           <motion.div 
             initial={{ x: "-100%" }}
             animate={{ x: "100%" }}
             transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
             className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
           />
        </div>
      </div>
    );
  }

  // Not authorized state fallback
  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white relative flex font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden">
      <InteractiveGrid />
      
      {/* Subtle Depth Layer Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(212,175,55,0.02)_100%)]" />
      
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <TopHeader onOpenMenu={() => setIsMobileMenuOpen(true)} />
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      <main className="flex-1 md:ml-[280px] pt-16 min-h-screen relative z-10 p-4 md:p-8 overflow-y-auto w-full overflow-x-hidden">
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
