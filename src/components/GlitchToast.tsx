import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGamification, ToastMessage } from '../context/GamificationContext';
import { AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export default function GlitchToastContainer() {
  const { toasts, removeToast } = useGamification();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

const ToastItem: React.FC<{ toast: ToastMessage, onRemove: () => void }> = ({ toast, onRemove }) => {
  useEffect(() => {
    // Speak the toast message if neuralSpeak is available
    if (typeof (window as any).neuralSpeak === 'function') {
      (window as any).neuralSpeak(`${toast.title}. ${toast.message}`);
    }

    const timer = setTimeout(() => {
      onRemove();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const isXp = toast.type === 'xp';
  const colorClass = isXp ? 'border-cyan-500 text-cyan-400' : 'border-magenta-500 text-magenta-400';
  const bgClass = isXp ? 'bg-cyan-900/20' : 'bg-magenta-900/20';
  const shadowClass = isXp ? 'shadow-[0_0_15px_#0ff]' : 'shadow-[0_0_15px_#f0f]';

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.9 }}
      className={`glass-card p-4 w-72 flex items-start gap-3 border-l-4 ${colorClass} ${bgClass} ${shadowClass} font-mono screen-tear pointer-events-auto`}
    >
      <div className="mt-1">
        {isXp ? <Zap className="w-5 h-5 text-cyan-400" /> : <CheckCircle2 className="w-5 h-5 text-magenta-400" />}
      </div>
      <div className="flex-1">
        <h4 className={`text-xs font-bold uppercase tracking-widest ${colorClass} mb-1 glitch-text`} data-text={toast.title}>
          {toast.title}
        </h4>
        <p className="text-[10px] text-gray-300 uppercase tracking-wider leading-tight">
          {toast.message}
        </p>
      </div>
      <div className="absolute top-0 right-0 p-1 opacity-30">
        <AlertTriangle className="w-3 h-3 text-white" />
      </div>
    </motion.div>
  );
}
