import React from "react";
import { motion } from "framer-motion";

const letters = "LOADING...".split("");

// Parent animation: stagger each character infinitely
const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      repeat: Infinity,
      repeatDelay: 1.5,
    },
  },
};

// Individual letter animation style
const letterVariants = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: {
    opacity: 1,
    y: [20, -12, 0],
    scale: [0.9, 1.3, 1],
    textShadow: [
      "0 0 2px #0ea5e9",
      "0 0 8px #38bdf8",
      "0 0 12px #0284c7",
      "0 0 0px #0ea5e9",
    ],
    transition: {
      duration: 0.8,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

export default function LoadingSpinner() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-sky-200 font-sans overflow-hidden">
      {/* Glowing background effect */}
      <div className="absolute w-[650px] h-[650px] bg-sky-300/30 rounded-full blur-[120px] animate-pulse -z-10" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] -z-10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        {/* Animated LOADING letters */}
        <motion.div
          className="flex gap-1 text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-sky-500 to-blue-800 drop-shadow-xl"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {letters.map((char, idx) => (
            <motion.span
              key={idx}
              variants={letterVariants}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Animated loading bar */}
        <motion.div
          className="h-1.5 w-48 sm:w-56 bg-gradient-to-r from-sky-400 to-blue-600 rounded-full shadow-md"
          animate={{
            scaleX: [0.2, 1, 0.2],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
          style={{ originX: 0.5 }}
        />
      </div>
    </div>
  );
}
