import React from "react";
import { motion } from "framer-motion";

const letters = "LOADING...".split("");

// Parent container: handles repeat + stagger
const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.12,
      repeat: Infinity,
      repeatDelay: 1.2,
    },
  },
};

// Individual letter animation
const letterVariants = {
  initial: { opacity: 0, y: 20, scale: 0.9 },
  animate: {
    opacity: 1,
    y: [20, -12, 0],
    scale: [0.9, 1.4, 1],
    textShadow: [
      "0 0 0px #0ea5e9",
      "0 0 6px #0ea5e9",
      "0 0 12px #0284c7",
      "0 0 0px #0ea5e9",
    ],
    transition: {
      duration: 0.8,
      ease: [0.42, 0, 0.58, 1.0],
    },
  },
};

export default function LoadingSpinner() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-blue-100 via-white to-sky-200 flex items-center justify-center font-poppins overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[600px] h-[600px] bg-sky-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Animated text */}
        <motion.div
          className="flex gap-1 text-2xl md:text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-500 to-blue-700 drop-shadow-lg"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {letters.map((char, i) => (
            <motion.span key={i} variants={letterVariants} className="inline-block">
              {char}
            </motion.span>
          ))}
        </motion.div>

        {/* Loading bar just below text */}
        <motion.div
          className="h-1 w-40 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full"
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
