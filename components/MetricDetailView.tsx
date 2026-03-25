'use client';

import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Cpu, 
  Activity, 
  HardDrive, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Info,
  Calendar,
  Filter
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricDetailViewProps {
  type: 'CPU' | 'Memory' | 'Disk' | 'Uptime';
  onClose: () => void;
  history: { time: string; cpu: number; memory: number }[];
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
    uptime: string;
  };
}

// Helper to get display specs based on type and dynamic metrics
const getDynamicSpecs = (type: string, metrics: MetricDetailViewProps['metrics']) => {
  if (!metrics) return {};
  
  if (type === 'CPU') {
    return {
      model: metrics.cpuModel || 'Detecting...',
      cores: `${metrics.cpuCores || 0} Physical`,
      threads: (metrics.cpuThreads || 0).toString(),
      baseClock: metrics.baseClock || 'N/A',
      boostClock: metrics.boostClock || 'N/A',
      cache: metrics.cache || 'N/A',
      tdp: metrics.tdp || 'Auto'
    };
  }
  if (type === 'Memory') {
    return {
      model: "System RAM",
      capacity: `${metrics.totalMemory} GB`,
      used: `${metrics.usedMemory} GB`,
      free: `${metrics.freeMemory} GB`,
      type: "DDR4/DDR5 detected",
      speed: "Auto",
      status: "Optimized"
    };
  }
  if (type === 'Disk') {
     return {
      model: "Primary Storage",
      status: "Healthy",
      type: "NVMe/SSD",
      interface: "PCIe",
      partition: "System (C:)",
      latency: "< 0.1ms"
    };
  }
  return {
    status: "Online",
    uptime: metrics.uptime,
    kernel: "WinNT 10.0",
    architecture: "x64",
    processes: "Active",
    reliability: "99.9%"
  };
};

// Mock historical data for "Last Hour", "Last Last Hour", etc.
const hourlyData = [
  { hour: '14:00', peak: 45, avg: 32 },
  { hour: '15:00', peak: 82, avg: 45 },
  { hour: '16:00', peak: 65, avg: 38 },
  { hour: '17:00', peak: 94, avg: 52 },
  { hour: '18:00', peak: 55, avg: 30 },
];

export default function MetricDetailView({ type, onClose, history, metrics }: MetricDetailViewProps) {
  const currentSpecs = getDynamicSpecs(type, metrics);
  const chartData = history.map(h => ({
    time: h.time,
    value: type === 'CPU' ? h.cpu : type === 'Memory' ? h.memory : 60 // Disk is static in mock
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[100] bg-[#050505] overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Navigation */}
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
        </button>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="p-6 rounded-3xl glass text-emerald-500">
              {type === 'CPU' && <Cpu size={48} />}
              {type === 'Memory' && <Activity size={48} />}
              {type === 'Disk' && <HardDrive size={48} />}
              {type === 'Uptime' && <Clock size={48} />}
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-2">
                {type} <span className="text-white/20 italic font-light">Specifications</span>
              </h1>
              <div className="flex items-center gap-4 text-white/40">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
                  <ShieldCheck size={14} className="text-emerald-500" /> Verified Hardware
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-xs font-bold uppercase tracking-widest">Firmware v2.4.1</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="glass px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors">
              <Calendar size={16} /> Filter by Day
            </button>
            <button className="glass px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-colors">
              <Filter size={16} /> Advanced Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Specs Table */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass rounded-3xl p-8">
              <h3 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
                <Info size={18} className="text-emerald-500" /> Hardware Details
              </h3>
              <div className="space-y-4">
                {Object.entries(currentSpecs).map(([key, value]) => (
                  <div key={key} className="flex flex-col py-3 border-b border-white/5">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-1">{key}</span>
                    <span className="text-sm font-medium text-white/90">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-3xl p-8 bg-emerald-500/5 border-emerald-500/20">
              <h3 className="text-lg font-display font-bold mb-2">Overclocking Potential</h3>
              <p className="text-sm text-white/50 mb-6">Current thermal headroom allows for +200MHz boost.</p>
              <button className="w-full py-4 rounded-2xl bg-emerald-500 text-black font-bold uppercase tracking-widest text-xs hover:bg-emerald-400 transition-colors">
                Optimize Performance
              </button>
            </div>
          </div>

          {/* Right: Detailed Charts */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-3xl p-8 h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-display font-bold tracking-tight">Live Telemetry</h3>
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Sampling at 100ms
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-3xl p-6">
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Peak This Hour</div>
                <div className="text-3xl font-display font-bold text-emerald-500">94%</div>
                <div className="text-[10px] text-white/20 mt-1">at 17:42:10</div>
              </div>
              <div className="glass rounded-3xl p-6">
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Peak Last Hour</div>
                <div className="text-3xl font-display font-bold text-white/70">82%</div>
                <div className="text-[10px] text-white/20 mt-1">at 15:12:05</div>
              </div>
              <div className="glass rounded-3xl p-6">
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-2">Peak 2h Ago</div>
                <div className="text-3xl font-display font-bold text-white/70">65%</div>
                <div className="text-[10px] text-white/20 mt-1">at 14:55:30</div>
              </div>
            </div>

            <div className="glass rounded-3xl p-8">
              <h3 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" /> Hourly Peak History
              </h3>
              <div className="space-y-4">
                {hourlyData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/5">
                    <span className="text-sm font-medium text-white/50">{d.hour}</span>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <div className="text-[8px] uppercase tracking-widest font-bold text-white/20">Average</div>
                        <div className="text-sm font-mono font-bold">{d.avg}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[8px] uppercase tracking-widest font-bold text-emerald-500/50">Peak</div>
                        <div className="text-sm font-mono font-bold text-emerald-500">{d.peak}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
