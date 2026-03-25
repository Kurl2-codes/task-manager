'use client';

import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaProps } from 'recharts';

interface SystemChartProps {
  data: { time: string; cpu: number; memory: number }[];
  selectedMetric: string;
}

export default function SystemChart({ data, selectedMetric }: SystemChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="glass rounded-3xl p-8 h-[400px] relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h3 className="text-xl font-display font-bold tracking-tight">Performance History</h3>
          <p className="text-sm text-white/40">Real-time telemetry for {selectedMetric}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 transition-opacity duration-300 ${selectedMetric === 'CPU' || selectedMetric === 'Disk' || selectedMetric === 'Uptime' ? 'opacity-100' : 'opacity-30'}`}>
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">CPU</span>
          </div>
          <div className={`flex items-center gap-2 transition-opacity duration-300 ${selectedMetric === 'Memory' ? 'opacity-100' : 'opacity-30'}`}>
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Memory</span>
          </div>
        </div>
      </div>

      <div className="h-[280px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.2)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.2)" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(5, 5, 5, 0.8)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#fff' }}
            />
            <Area 
              type="monotone" 
              dataKey="cpu" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCpu)" 
              animationDuration={1500}
            />
            <Area 
              type="monotone" 
              dataKey="memory" 
              stroke="#3b82f6" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorMem)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    </motion.div>
  );
}
