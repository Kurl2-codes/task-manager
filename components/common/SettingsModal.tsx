'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Bell, AlertCircle, Zap, Shield } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    alertThreshold: number;
    soundEnabled: boolean;
    spikeThemeEnabled: boolean;
  };
  onUpdate: (settings: any) => void;
}

export default function SettingsModal({ isOpen, onClose, settings, onUpdate }: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[301] w-full max-w-md glass rounded-3xl p-8 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold tracking-tight">System <span className="text-white/40 italic font-light">Settings</span></h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Alert Threshold */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold uppercase tracking-widest text-white/50 flex items-center gap-2">
                    <AlertCircle size={16} /> Alert Threshold
                  </label>
                  <span className="text-emerald-500 font-mono font-bold">{settings.alertThreshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="98" 
                  value={settings.alertThreshold}
                  onChange={(e) => onUpdate({ ...settings, alertThreshold: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-[10px] text-white/30 leading-relaxed">
                  Notifications will trigger when any metric exceeds this value.
                </p>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${settings.soundEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/30'}`}>
                    {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Audio Alerts</h4>
                    <p className="text-[10px] text-white/30">Play &quot;Ringtone&quot; on critical spikes</p>
                  </div>
                </div>
                <button 
                  onClick={() => onUpdate({ ...settings, soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-emerald-500' : 'bg-white/10'}`}
                >
                  <motion.div 
                    animate={{ x: settings.soundEnabled ? 26 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>

              {/* Spike Theme Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${settings.spikeThemeEnabled ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-white/30'}`}>
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Spike Dark Mode</h4>
                    <p className="text-[10px] text-white/30">Intense visual feedback during alerts</p>
                  </div>
                </div>
                <button 
                  onClick={() => onUpdate({ ...settings, spikeThemeEnabled: !settings.spikeThemeEnabled })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.spikeThemeEnabled ? 'bg-red-500' : 'bg-white/10'}`}
                >
                  <motion.div 
                    animate={{ x: settings.spikeThemeEnabled ? 26 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  />
                </button>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                  <Shield size={12} /> Security Protocol Active
                </div>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
