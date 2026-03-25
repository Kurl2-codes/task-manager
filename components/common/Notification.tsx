'use client';

import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, BellRing, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface NotificationProps {
  message: string;
  type: 'CPU' | 'Memory' | 'Disk';
  value: number;
  onClose: () => void;
  soundEnabled: boolean;
}

export default function Notification({ message, type, value, onClose, soundEnabled }: NotificationProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!soundEnabled) return;

    // Distinct "Ringtone" style alarm
    const playAlarm = async () => {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const playTone = (freq: number, time: number, duration: number) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime + time);
          gain.gain.setValueAtTime(0.05, audioCtx.currentTime + time);
          gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + time + duration);
          osc.start(audioCtx.currentTime + time);
          osc.stop(audioCtx.currentTime + time + duration);
        };

        // Play a sequence (ringtone-like)
        playTone(880, 0, 0.2);
        playTone(880, 0.3, 0.2);
        playTone(1100, 0.6, 0.4);
      } catch (e) {
        console.warn('Audio context failed', e);
      }
    };

    playAlarm();
    
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose, soundEnabled]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className="fixed top-8 right-8 z-[200] w-80 glass rounded-2xl p-4 border-red-500/50 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-red-500 text-white animate-pulse">
          <BellRing size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold uppercase tracking-widest text-red-500 flex items-center gap-1.5">
              <AlertTriangle size={14} /> Critical Spike
            </h4>
            <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-white/70 leading-relaxed">
            {type} usage reached <span className="text-white font-bold">{value}%</span>. {message}
          </p>
        </div>
      </div>
      
      <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: 5, ease: "linear" }}
          className="h-full bg-red-500"
        />
      </div>
    </motion.div>
  );
}
