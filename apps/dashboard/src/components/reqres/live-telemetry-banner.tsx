'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Cpu, Server, Wifi } from 'lucide-react';

export function LiveTelemetryBanner() {
  const [online, setOnline] = useState(false);
  const [memoryMb, setMemoryMb] = useState<number | null>(null);
  const [uptimeSec, setUptimeSec] = useState<number | null>(null);

  useEffect(() => {
    // Check health probe
    const checkHealth = async () => {
      try {
        const res = await fetch('http://127.0.0.1:4000/health');
        if (res.ok) setOnline(true);
      } catch {
        setOnline(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-xl shadow-card text-xs">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
          <span className="font-semibold text-slate-800">
            {online ? 'Orchestrator Cluster Online' : 'Orchestrator Offline (Fallback Active)'}
          </span>
        </div>
        <span className="text-slate-300">•</span>
        <span className="font-mono text-slate-500">Port 4000 (REST) • Port 50051 (gRPC)</span>
      </div>

      <div className="flex items-center space-x-4 font-mono text-[11px] text-slate-600 mt-2 sm:mt-0">
        <div className="flex items-center space-x-1">
          <Server className="w-3.5 h-3.5 text-brand-600" />
          <span>Fastify v5 + HTTP/2</span>
        </div>
        <div className="flex items-center space-x-1">
          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
          <span>Node.js v22</span>
        </div>
      </div>
    </div>
  );
}
