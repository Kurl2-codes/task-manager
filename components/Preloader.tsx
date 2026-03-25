'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GREETINGS = [
  "Hello",
  "Hola",
  "Bonjour",
  "Ciao",
  "Olá",
  "नमस्ते",
  "こんにちは",
  "안녕하세요",
  "Привет",
  "你好"
];

export default function Preloader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % GREETINGS.length);
    }, 250);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]"
    >
      <div className="relative flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.h1
            key={GREETINGS[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-white"
          >
            {GREETINGS[index]}
          </motion.h1>
        </AnimatePresence>
        
        <motion.div 
          className="mt-8 w-48 h-[2px] bg-white/10 overflow-hidden rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 192 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        >
          <motion.div 
            className="h-full bg-emerald-500"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-xs uppercase tracking-[0.3em] font-medium text-white/50"
        >
          Initializing System
        </motion.p>
      </div>
    </motion.div>
  );
}
