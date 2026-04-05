"use client";

import { useEffect } from "react";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";

export function InteractiveGrid() {
  const mouseX = useMotionValue(-1000); // Off-screen initially
  const mouseY = useMotionValue(-1000);

  useEffect(() => {
    const handleMouseMove = (e: globalThis.MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] bg-black">
      
      {/* Base Faint Grid */}
      <div 
        className="absolute inset-0 opacity-[0.18]"
        style={{ 
          backgroundImage: 'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)', 
          backgroundSize: '60px 60px' 
        }}
      />

      {/* Reactive Localized Brightened Grid Line Effect */}
      <motion.div
        className="absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage: 'linear-gradient(#D4AF37 1px, transparent 1px), linear-gradient(90deg, #D4AF37 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      />

    </div>
  );
}
