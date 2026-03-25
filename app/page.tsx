'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Preloader from '@/components/Preloader';
import Dashboard from '@/components/Dashboard';

export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading for the preloader
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden">
      <AnimatePresence mode="wait">
        {loading ? (
          <Preloader key="preloader" />
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Dashboard />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
    </main>
  );
}
