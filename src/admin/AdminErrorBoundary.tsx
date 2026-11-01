import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, ShieldAlert, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    const errorId = `ERR_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log full diagnostic stack for developers
    console.error('[AdminErrorBoundary] Captured runtime exception in Admin module:', error);
    console.error('[AdminErrorBoundary] Component stack trace:', errorInfo.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorId: '' });
    window.location.reload();
  };

  private handleSafeStorageRepair = () => {
    try {
      const current = localStorage.getItem('pf:ramzan_data_v1');
      if (current) {
        // Preserve a non-destructive recovery copy before repair
        sessionStorage.setItem('pf:ramzan_data_backup_before_repair', current);
        localStorage.removeItem('pf:ramzan_data_v1');
      }
    } catch (e) {
      console.warn('Storage repair note:', e);
    }
    window.location.href = '/admin';
  };

  public render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-screen bg-[#07090e] text-[#f0f4f8] flex items-center justify-center p-4 font-sans select-none">
          <div className="relative w-full max-w-lg bg-[#0e121a]/95 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.15)] z-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <h1 className="text-lg sm:text-xl font-bold font-display text-white mb-2">
              Admin Portal Diagnostic Recovery
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
              A runtime component exception was caught before it could cause a blank screen. Your public portfolio website remains 100% active and unaffected.
            </p>

            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/20 text-xs text-red-200/90 font-mono text-left mb-6 overflow-x-auto">
              <div className="flex items-center justify-between mb-1 text-[11px] text-red-400/80">
                <span>Reference ID: {this.state.errorId}</span>
                <span>{isDev ? 'DEV MODE' : 'PRODUCTION'}</span>
              </div>
              <p className="break-words">
                {isDev ? this.state.error?.message || 'Unknown component error' : 'Protected Module Exception — check console logs for details.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Admin</span>
              </button>

              <button
                type="button"
                onClick={this.handleSafeStorageRepair}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
                title="Repairs corrupted cached data while backing it up to session"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Repair Cached State</span>
              </button>

              <a
                href="/"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-white/10"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Site</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
