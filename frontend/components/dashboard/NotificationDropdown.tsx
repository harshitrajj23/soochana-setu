"use client";

import { motion } from "framer-motion";
import { Bell, CheckCircle2, AlertTriangle, Info, Clock } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "New beneficiary verified",
    time: "2 min ago",
    status: "success",
    description: "Identity audit for UID-88AC successful."
  },
  {
    id: 2,
    title: "Fraud anomaly detected",
    time: "15 min ago",
    status: "error",
    description: "High-risk behavior in Sector 12, Urban Cluster."
  },
  {
    id: 3,
    title: "Policy simulation complete",
    time: "45 min ago",
    status: "warning",
    description: "Simulation SS-991 ready for analysis."
  },
  {
    id: 4,
    title: "New raw data batch",
    time: "2 hours ago",
    status: "info",
    description: "Regional Node Alpha has uploaded 1.2k records."
  }
];

export function NotificationDropdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full right-0 mt-4 w-80 bg-[#0A0A0A]/90 backdrop-blur-2xl border border-[#D4AF37]/20 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[100]"
    >
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Communications Target</span>
        <span className="px-2 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-black uppercase">4 New</span>
      </div>

      <div className="max-h-[350px] overflow-y-auto scrolls no-scrollbar">
        {notifications.map((notif) => (
          <div 
            key={notif.id}
            className="p-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer group"
          >
            <div className="flex gap-4">
              <div className={`mt-1 shrink-0 ${
                notif.status === 'success' ? 'text-emerald-500' : 
                notif.status === 'error' ? 'text-red-500' : 
                notif.status === 'warning' ? 'text-amber-500' : 'text-blue-500'
              }`}>
                {notif.status === 'success' && <CheckCircle2 size={16} />}
                {notif.status === 'error' && <AlertTriangle size={16} />}
                {notif.status === 'warning' && <Info size={16} />}
                {notif.status === 'info' && <Bell size={16} />}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-white text-xs font-bold transition-colors group-hover:text-[#D4AF37]">{notif.title}</span>
                <span className="text-[10px] text-white/40 leading-relaxed font-medium">{notif.description}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock size={10} className="text-white/20" />
                  <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{notif.time}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors border-t border-white/5">
        Clear All Protocols
      </button>
    </motion.div>
  );
}
