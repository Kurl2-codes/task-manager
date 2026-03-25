'use client';

import { motion, useMotionValue, useSpring } from 'motion/react';
import { ReactNode, MouseEvent } from 'react';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit: string;
  icon: ReactNode;
  color: 'emerald' | 'blue' | 'purple' | 'orange';
  delay: number;
  isText?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  metrics: {
    cpuModel: string;
    totalMemory: number | string;
    uptime: string;
  };
}

const colorMap = {
  emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
};

const progressColorMap = {
  emerald: 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]',
  blue: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
  purple: 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]',
  orange: 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]',
};

export default function MetricCard({ title, value, unit, icon, color, delay, isText, isSelected, onClick, metrics }: MetricCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    x.set(mouseX);
    y.set(mouseY);
    
    // Set CSS variables for the liquid effect in globals.css
    e.currentTarget.style.setProperty('--x', `${mouseX}px`);
    e.currentTarget.style.setProperty('--y', `${mouseY}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        borderColor: isSelected ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255, 255, 255, 0.1)',
        backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.05)'
      }}
      transition={{ delay, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`glass liquid-hover rounded-3xl p-6 group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${isSelected ? 'ring-2 ring-emerald-500/50' : ''}`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={`p-3 rounded-2xl ${colorMap[color]} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
            {icon}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Live</span>
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-medium text-white/50 uppercase tracking-wider">{title}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-display font-bold tracking-tight">
              {value}
            </span>
            <span className="text-sm font-medium text-white/30">{unit}</span>
          </div>
        </div>

        {!isText && typeof value === 'number' && (
          <div className="mt-6">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full ${progressColorMap[color]}`}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-white/20 font-bold">0%</span>
              <span className="text-[10px] text-white/20 font-bold">100%</span>
            </div>
          </div>
        )}

        {isText && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest">Host Active</span>
            </div>
            <span className="text-[10px] text-white/20 font-mono">{value === metrics.uptime ? 'System Live' : ''}</span>
          </div>
        )}

        {/* Dynamic Spec Summary */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <span className="text-[9px] text-white/20 font-bold uppercase tracking-tighter">Specification</span>
           <span className="text-[9px] font-mono font-bold text-white/40 truncate max-w-[120px]">
             {title === 'CPU Usage' ? metrics.cpuModel : title === 'Memory' ? `${metrics.totalMemory}GB RAM` : title === 'Disk Space' ? 'NVMe SSD' : 'Uptime'}
           </span>
        </div>
      </div>
    </motion.div>
  );
}
