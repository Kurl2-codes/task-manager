'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, HardDrive, Activity, Clock, LayoutDashboard, Bell, Settings, Search } from 'lucide-react';
import MetricCard from './MetricCard';
import SystemChart from './SystemChart';
import MetricDetails from './MetricDetails';
import MetricDetailView from './MetricDetailView';
import Notification from './Notification';
import SettingsModal from './SettingsModal';

export default function Dashboard() {
  const [selectedMetric, setSelectedMetric] = useState<'CPU' | 'Memory' | 'Disk' | 'Uptime'>('CPU');
  const [deepView, setDeepView] = useState<'CPU' | 'Memory' | 'Disk' | 'Uptime' | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'CPU' | 'Memory' | 'Disk'; value: number } | null>(null);
  
  const [settings, setSettings] = useState({
    alertThreshold: 90,
    soundEnabled: true,
    spikeThemeEnabled: true
  });
  
  const [metrics, setMetrics] = useState({
    cpu: 0,
    cpuModel: '',
    cpuCores: 0,
    cpuThreads: 0,
    baseClock: '',
    boostClock: '',
    cache: '',
    tdp: '',
    memory: 0,
    totalMemory: 0,
    usedMemory: 0,
    freeMemory: 0,
    disk: 0,
    uptime: "0h 0m 0s"
  });
  
  const [history, setHistory] = useState<{ time: string; cpu: number; memory: number }[]>([]);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('http://localhost:3001/stats');
        if (!response.ok) throw new Error('Backend unavailable');
        
        const data = await response.json();
        const newCpu = Math.round(data.cpu * 10) / 10;
        const newMemory = Math.round(data.memory * 10) / 10;
        const newDisk = Math.round(data.disk * 10) / 10;
        const newUptime = data.uptime;

        if (newCpu >= settings.alertThreshold) {
          setAlert({ type: 'CPU', value: newCpu });
        }
        
        setMetrics({
          cpu: newCpu,
          cpuModel: data.cpuModel || 'Detecting...',
          cpuCores: data.cpuCores || 0,
          cpuThreads: data.cpuThreads || 0,
          baseClock: data.baseClock || 'N/A',
          boostClock: data.boostClock || 'N/A',
          cache: data.cache || 'N/A',
          tdp: data.tdp || 'Auto',
          memory: newMemory,
          totalMemory: data.totalMemory || 0,
          usedMemory: data.usedMemory || 0,
          freeMemory: data.freeMemory || 0,
          disk: newDisk,
          uptime: newUptime
        });

        setHistory(prev => {
          const newHistory = [...prev, { 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
            cpu: newCpu, 
            memory: newMemory 
          }];
          return newHistory.slice(-20);
        });
      } catch (error) {
        console.error('Metrics fetch error:', error);
      }
    };

    const interval = setInterval(fetchMetrics, 3000);
    fetchMetrics();
    return () => clearInterval(interval);
  }, [settings.alertThreshold]);

  const isSpiking = alert && settings.spikeThemeEnabled;

  return (
    <div className={`transition-colors duration-1000 ${isSpiking ? 'bg-red-950/20' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 min-h-screen">
        <AnimatePresence>
          {alert && (
            <Notification 
              type={alert.type} 
              value={alert.value} 
              message="System load is exceeding safe thresholds." 
              soundEnabled={settings.soundEnabled}
              onClose={() => setAlert(null)} 
            />
          )}
          
          {deepView && (
            <MetricDetailView 
              type={deepView} 
              history={history} 
              onClose={() => setDeepView(null)} 
              metrics={metrics}
            />
          )}
        </AnimatePresence>

        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdate={setSettings}
        />

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-2 mb-2 transition-colors ${isSpiking ? 'text-red-500' : 'text-emerald-500'}`}
            >
              <Activity size={18} className={isSpiking ? 'animate-bounce' : 'animate-pulse'} />
              <span className="text-xs font-bold uppercase tracking-widest">{isSpiking ? 'Critical Alert' : 'System Live'}</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold tracking-tight"
            >
              System Monitor <span className="text-white/40 italic font-light">Dashboard</span>
            </motion.h1>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-emerald-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search metrics..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-48 md:w-64 transition-all"
              />
            </div>
            <button className="p-2 rounded-full glass hover:bg-white/10 transition-colors">
              <Bell size={20} className="text-white/70" />
            </button>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-full glass hover:bg-white/10 transition-colors"
            >
              <Settings size={20} className="text-white/70" />
            </button>
          </motion.div>
        </header>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            title="CPU Usage" 
            value={metrics.cpu} 
            unit="%" 
            icon={<Cpu size={24} />} 
            color={isSpiking ? 'orange' : 'emerald'}
            delay={0.3}
            isSelected={selectedMetric === 'CPU'}
            onClick={() => {
              if (selectedMetric === 'CPU') setDeepView('CPU');
              setSelectedMetric('CPU');
            }}
            metrics={metrics}
          />
          <MetricCard 
            title="Memory" 
            value={metrics.memory} 
            unit="%" 
            icon={<Activity size={24} />} 
            color="blue"
            delay={0.4}
            isSelected={selectedMetric === 'Memory'}
            onClick={() => {
              if (selectedMetric === 'Memory') setDeepView('Memory');
              setSelectedMetric('Memory');
            }}
            metrics={metrics}
          />
          <MetricCard 
            title="Disk Space" 
            value={metrics.disk} 
            unit="%" 
            icon={<HardDrive size={24} />} 
            color="purple"
            delay={0.5}
            isSelected={selectedMetric === 'Disk'}
            onClick={() => {
              if (selectedMetric === 'Disk') setDeepView('Disk');
              setSelectedMetric('Disk');
            }}
            metrics={metrics}
          />
          <MetricCard 
            title="System Uptime" 
            value={metrics.uptime} 
            unit="" 
            icon={<Clock size={24} />} 
            color="orange"
            delay={0.6}
            isText
            isSelected={selectedMetric === 'Uptime'}
            onClick={() => {
              if (selectedMetric === 'Uptime') setDeepView('Uptime');
              setSelectedMetric('Uptime');
            }}
            metrics={metrics}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SystemChart data={history} selectedMetric={selectedMetric} />
          </div>
          <div className="lg:col-span-1">
            <MetricDetails 
              type={selectedMetric} 
              data={history} 
              metrics={metrics}
              color={selectedMetric === 'CPU' ? 'emerald' : selectedMetric === 'Memory' ? 'blue' : selectedMetric === 'Disk' ? 'purple' : 'orange'} 
            />
          </div>
        </div>
        
        {/* Background Ambient Glows - Change to red on spike */}
        <div className={`fixed top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 ${isSpiking ? 'bg-red-500/20' : 'bg-emerald-500/10'}`} />
        <div className={`fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000 ${isSpiking ? 'bg-red-500/20' : 'bg-blue-500/10'}`} />

        {/* Hint */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          className="mt-8 text-center text-[10px] uppercase tracking-[0.3em] font-bold"
        >
          Double-click any card for full hardware specifications
        </motion.p>
      </div>
    </div>
  );
}
