import React from 'react';
import { Radio, Github, Search, Terminal, Zap, ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 select-none">
      {/* Search / Command Trigger Mockup */}
      <div className="flex items-center space-x-3 w-80">
        <div className="w-full flex items-center space-x-2 bg-slate-50 border border-slate-200/80 rounded-md px-2.5 py-1.5 text-xs text-slate-400 hover:border-slate-300 transition-colors cursor-pointer">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="flex-1 text-slate-500">Search protocols, RFCs, traces...</span>
          <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs text-slate-500">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Cluster Telemetry Pills & Actions */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full text-xs font-mono text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Orchestrator:</span>
          <span className="font-semibold text-slate-900">:4000</span>
        </div>

        <div className="hidden lg:flex items-center space-x-1.5 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full text-xs font-mono text-slate-600">
          <Radio className="w-3 h-3 text-brand-600 animate-pulse" />
          <span>Stream:</span>
          <span className="font-semibold text-slate-900">Active</span>
        </div>

        <div className="h-4 w-px bg-slate-200 mx-1"></div>

        <a
          href="https://github.com/asarthak2003/Nexus"
          target="_blank"
          rel="noreferrer"
          className="flex items-center space-x-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors bg-white hover:bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200/80 shadow-card"
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
