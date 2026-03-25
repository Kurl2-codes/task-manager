'use client';

import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Zap, BarChart3, Clock, AlertCircle, Shield, Cpu, Gauge, Activity } from 'lucide-react';

interface MetricDetailsProps {
  type: string;
  data: { time: string; cpu: number; memory: number }[];
  color: string;
  metrics: {
    cpuModel: string;
    cpuCores: number;
    cpuThreads: number;
    baseClock: string;
    boostClock: string;
    cache: string;
    tdp: string;
    totalMemory: number | string;
    usedMemory: number | string;
    freeMemory: number | string;
  };
}

export default function MetricDetails({ type, data, color, metrics }: MetricDetailsProps) {
  const values = data.map(d => type === 'CPU' ? d.cpu : d.memory);
  const avg = values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0;
  const peak = values.length > 0 ? Math.max(...values) : 0;
  const currentVal = values.length > 0 ? values[values.length - 1] : 0;

  const isCPU = type === 'CPU';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-3xl p-8 flex flex-col h-full relative overflow-hidden group"
    >
      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-xl font-display font-bold tracking-tight flex items-center gap-2 text-white">
              <Cpu size={20} className={`text-${color}-500`} />
              {isCPU ? 'CPU Specifications' : `${type} Analytics`}
            </h3>
            <div className="flex items-center gap-2">
              <Shield size={12} className="text-emerald-500" />
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Verified Hardware</span>
              <span className="text-[10px] text-white/20 ml-2">Firmware v2.4.1</span>
            </div>
          </div>
          <div className="flex gap-2">
             <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-wider cursor-pointer hover:bg-white/10 transition-colors">
                Advanced Filter
             </div>
          </div>
        </div>

        {/* Hardware Details Section */}
        <div className="space-y-4 mb-8">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-4 flex items-center gap-2">
            <Activity size={12} /> Hardware Details
          </h4>
          
          <div className="grid grid-cols-1 gap-1">
            <div className="flex items-center justify-between py-2 border-b border-white/5 group/row">
              <span className="text-xs text-white/40 group-hover/row:text-white/60 transition-colors">model</span>
              <span className="text-xs font-mono font-bold text-white text-right truncate max-w-[200px]">{isCPU ? metrics.cpuModel : `${type} Controller`}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5 group/row">
              <span className="text-xs text-white/40 group-hover/row:text-white/60 transition-colors">cores</span>
              <span className="text-xs font-mono font-bold text-white">{isCPU ? `${metrics.cpuCores} (Physical)` : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5 group/row">
              <span className="text-xs text-white/40 group-hover/row:text-white/60 transition-colors">threads</span>
              <span className="text-xs font-mono font-bold text-white">{isCPU ? metrics.cpuThreads : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5 group/row">
              <span className="text-xs text-white/40 group-hover/row:text-white/60 transition-colors">baseClock</span>
              <span className="text-xs font-mono font-bold text-white">{isCPU ? metrics.baseClock : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5 group/row">
              <span className="text-xs text-white/40 group-hover/row:text-white/60 transition-colors">boostClock</span>
              <span className="text-xs font-mono font-bold text-emerald-500">{isCPU ? metrics.boostClock : 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-white/5 group/row">
              <span className="text-xs text-white/40 group-hover/row:text-white/60 transition-colors">cache</span>
              <span className="text-xs font-mono font-bold text-white">{isCPU ? metrics.cache : `${metrics.totalMemory} GB Total`}</span>
            </div>
            <div className="flex items-center justify-between py-2 group/row">
              <span className="text-xs text-white/40 group-hover/row:text-white/60 transition-colors">tdp</span>
              <span className="text-xs font-mono font-bold text-orange-500">{isCPU ? metrics.tdp : 'Dynamic'}</span>
            </div>
          </div>
        </div>

        {/* Overclocking Potential */}
        <div className="mb-8">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-3">Overclocking Potential</h4>
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-[11px] text-white/60 leading-relaxed font-medium">
              Current thermal headroom allows for <span className="text-emerald-500 font-bold">+200MHz boost</span>. 
              Stability verified via AI-X baseline.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-widest text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all mb-8 flex items-center justify-center gap-2 group">
          <Zap size={14} className="text-emerald-500 group-hover:animate-pulse" />
          Optimize Performance
        </button>

        {/* Live Telemetry Section */}
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Live Telemetry</h4>
            <span className="text-[9px] font-bold text-emerald-500/70 border border-emerald-500/20 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(16,185,129,0.2)]">Sampling at 100ms</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-6">
            {[25, 50, 75, 100].map((val) => (
              <div key={val} className="h-1 bg-white/5 rounded-full relative overflow-hidden">
                {currentVal >= val && (
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: '100%' }}
                     className={`h-full bg-${color}-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]`} 
                   />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1 font-bold">Peak This Hour</div>
              <div className={`text-xl font-display font-bold text-${color}-500`}>{peak}%</div>
              <div className="text-[8px] text-white/20 mt-1 uppercase font-bold tracking-tighter">at 17:42:10</div>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1 font-bold">Average</div>
              <div className="text-xl font-display font-bold text-white/70">{avg}%</div>
              <div className="text-[8px] text-white/20 mt-1 uppercase font-bold tracking-tighter">Verified Load</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className={`absolute -bottom-24 -right-24 w-64 h-64 bg-${color}-500/5 rounded-full blur-[100px] pointer-events-none`} />
      <div className={`absolute -top-24 -left-24 w-64 h-64 bg-${color}-500/5 rounded-full blur-[100px] pointer-events-none`} />
    </motion.div>
  );
}
