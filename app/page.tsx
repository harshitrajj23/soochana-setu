"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Helper component to preserve word breaks while typing letter by letter
const TypewriterText = ({ text, startDelay = 0, speed = 0.05, className, as: Component = "p" }: any) => {
  const words = text.split(" ");
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        visible: { transition: { staggerChildren: speed, delayChildren: startDelay } },
        hidden: {}
      }}
      className={className}
    >
      {words.map((word: string, wordIdx: number) => (
        <span key={wordIdx} className="inline-block mr-[0.25em]">
          {word.split("").map((char: string, charIdx: number) => (
            <motion.span
              key={charIdx}
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Overall scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Fade out the video completely around 40% scroll to reveal true black
  const videoOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <main ref={containerRef} className="relative bg-black text-white selection:bg-[#D4AF37] selection:text-black">
      
      {/* FIXED HERO BACKGROUND */}
      <motion.div 
        className="fixed inset-0 z-0 pointer-events-none bg-black"
        style={{ opacity: videoOpacity, willChange: "transform, opacity" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* SPACER FOR SCROLL TO FADE VIDEO (NO TEXT HERE) */}
      <div className="h-[100vh]" />

      {/* SECOND SECTION: TEXT STORYTELLING - SEPARATE */}
      <div className="relative z-20 min-h-[100vh] flex flex-col items-center justify-center bg-black px-6 py-32">
        <div className="max-w-5xl mx-auto w-full text-center flex flex-col items-center justify-center space-y-12">
          
          {/* Line 1 - Fast type */}
          <TypewriterText 
            text="Fragmented systems create invisible citizens." 
            startDelay={0.2} 
            speed={0.03}
            className="text-sm md:text-base text-neutral-500 font-medium tracking-[0.2em] uppercase"
          />

          {/* Line 2 - Slower type */}
          <TypewriterText 
            text="One unified intelligence can change that." 
            startDelay={2.0} 
            speed={0.06}
            className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] text-white"
          />

          {/* Line 3 - Glow type */}
          <TypewriterText 
            text="Soochana Setu brings clarity to chaos." 
            startDelay={5.0} 
            speed={0.04}
            className="text-2xl md:text-3xl font-light text-[#D4AF37] leading-relaxed drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          />

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.2, delay: 7.0, ease: [0.16, 1, 0.3, 1] }}
            className="pt-12 flex justify-center w-full"
          >
            <button className="group relative overflow-hidden rounded-full inline-flex items-center justify-center px-12 py-4 border border-[#D4AF37] text-[#D4AF37] bg-transparent transition-all duration-400 ease-out hover:bg-[#D4AF37] hover:text-black hover:scale-[1.05] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] cursor-pointer">
              <span className="relative z-10 text-lg font-medium tracking-wide">
                Get Started
              </span>
            </button>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
