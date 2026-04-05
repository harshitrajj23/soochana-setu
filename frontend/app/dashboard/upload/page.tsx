"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, CheckCircle2 } from "lucide-react";
import { uploadFile } from "@/lib/api";

export default function UploadDataPage() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setComplete(false);
    setError(null);
    
    try {
      // Sample beneficiary ID for demo purposes, 
      // in a real scenario this might come from a selected citizen
      const beneficiaryId = "demo-beneficiary-id";
      
      const res = await uploadFile(file, beneficiaryId);
      
      if (res.success) {
        setComplete(true);
        setUploading(false);
      } else {
        throw new Error(res.message || "Ingestion failed.");
      }
    } catch (err: any) {
      console.error("API ERROR:", err);
      setError(err.message || "Failed to ingest records. Check backend node.");
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Data Ingestion</h1>
        <p className="text-sm text-white/50">Securely upload compartmentalized state or federal records for unified intelligence processing.</p>
      </div>

      {/* Drag & Drop Area */}
      <div className="relative w-full h-[320px] rounded-2xl border-2 border-dashed border-[#D4AF37]/30 bg-[#0a0a0a] flex flex-col items-center justify-center p-8 transition-colors duration-300 hover:border-[#D4AF37]/60 hover:bg-[#111]">
        
        <AnimatePresence mode="wait">
          {!uploading && !complete ? (
            <motion.div 
              key="standby"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="w-20 h-20 rounded-full bg-[#D4AF37]/10 flex items-center justify-center border border-[#D4AF37]/20">
                <UploadCloud size={32} className="text-[#D4AF37]" strokeWidth={1.5} />
              </div>
              <div className="text-center flex flex-col gap-1">
                <span className="text-white font-medium text-lg">Click to upload or drag & drop</span>
                <span className="text-white/40 text-sm">CSV, XML, JSON or encrypted SEC files (max. 5GB)</span>
              </div>
              <label className="mt-4 px-8 py-2.5 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors font-medium text-sm cursor-pointer disabled:opacity-50">
                {uploading ? "Ingesting..." : "Select File for Ingestion"}
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={onFileChange}
                  disabled={uploading}
                />
              </label>
              {error && <p className="mt-4 text-red-500 text-xs font-bold uppercase">{error}</p>}
            </motion.div>
          ) : uploading ? (
            <motion.div 
              key="uploading"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col w-full max-w-md gap-6 items-center"
            >
              <File size={32} className="text-white/50" />
              <div className="text-center w-full">
                <div className="flex justify-between text-xs font-semibold text-white/80 mb-3 uppercase tracking-wider">
                  <span>Uploading records...</span>
                  <span>{Math.floor(progress)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#D4AF37]"
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.2 }}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 text-center"
            >
               <div className="text-emerald-500 mb-2">
                 <CheckCircle2 size={48} strokeWidth={1.5} />
               </div>
               <span className="text-white font-medium text-xl">Ingestion Complete</span>
               <span className="text-white/50 text-sm max-w-[280px]">Records successfully staged for unification. Integrity hash verified.</span>
               <button 
                onClick={() => setComplete(false)}
                className="mt-6 px-6 py-2 border border-white/20 rounded-full text-white/70 hover:bg-white/10 text-sm"
               >
                 Upload another batch
               </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
