import React, { Component, ErrorInfo } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class GlitchErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-mono relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/static/1920/1080')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          <div className="static-noise"></div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border-red-500/50 p-8 max-w-2xl w-full relative z-10 screen-tear"
          >
            <div className="flex items-center gap-4 mb-6 border-b-2 border-red-500/30 pb-4">
              <div className="w-12 h-12 bg-red-900/30 border-2 border-red-500 flex items-center justify-center shadow-[0_0_15px_#f00]">
                <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-red-500 tracking-widest uppercase glitch-text" data-text="FATAL_EXCEPTION">
                  FATAL_EXCEPTION
                </h1>
                <p className="text-red-400/70 text-xs tracking-widest uppercase">
                  // KERNEL PANIC: MEMORY CORRUPTION DETECTED
                </p>
              </div>
            </div>

            <div className="bg-black/80 border border-red-500/30 p-4 mb-6 overflow-auto max-h-48">
              <p className="text-red-400 font-mono text-sm whitespace-pre-wrap">
                {this.state.error?.message || "Unknown system failure."}
              </p>
              <p className="text-red-500/50 font-mono text-xs mt-2 whitespace-pre-wrap">
                {this.state.error?.stack}
              </p>
            </div>

            <button
              onClick={this.handleReset}
              className="w-full py-4 bg-red-900/20 border-2 border-red-500 text-red-400 font-display tracking-widest uppercase text-sm flex items-center justify-center gap-3 hover:bg-red-900/50 transition-all shadow-[0_0_15px_rgba(255,0,0,0.3)] hover:shadow-[0_0_25px_rgba(255,0,0,0.6)]"
            >
              <RefreshCw className="w-4 h-4" />
              [ INITIATE_SYSTEM_REBOOT ]
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
