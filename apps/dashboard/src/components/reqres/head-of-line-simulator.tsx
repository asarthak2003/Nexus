'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, FastForward, Play, ShieldAlert, Split } from 'lucide-react';

interface HeadOfLineSimulatorProps {
  activeVariant: string;
}

export function HeadOfLineSimulator({ activeVariant }: HeadOfLineSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState({ http1: 0, http2: 0 });

  const runSimulation = () => {
    setIsSimulating(true);
    setProgress({ http1: 0, http2: 0 });

    const interval = setInterval(() => {
      setProgress((prev) => {
        // HTTP/2 stream multiplexing finishes fast; HTTP/1.1 blocks on large asset
        const nextH2 = Math.min(100, prev.http2 + 8);
        const nextH1 = prev.http1 < 35 ? prev.http1 + 3 : prev.http1 < 45 ? prev.http1 + 1 : Math.min(100, prev.http1 + 7);

        if (nextH2 === 100 && nextH1 === 100) {
          clearInterval(interval);
          setIsSimulating(false);
        }
        return { http1: nextH1, http2: nextH2 };
      });
    }, 120);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Split className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Head-of-Line (HoL) Blocking Visual Simulator
          </h3>
        </div>
        <button
          type="button"
          onClick={runSimulation}
          disabled={isSimulating}
          className="flex items-center space-x-1.5 px-3 py-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-md transition-all cursor-pointer"
        >
          <Play className="w-3 h-3 fill-white" />
          <span>{isSimulating ? 'Simulating Traffic...' : 'Simulate 6 Concurrent Requests'}</span>
        </button>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Compare how HTTP/1.1 queues requests over limited TCP sockets versus HTTP/2 and gRPC interleaving multiplexed frames over a single TCP connection.
      </p>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* HTTP/1.1 Lane */}
        <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">HTTP/1.1 (Sequential Queue)</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
              HoL Blocking Risk
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-600">
              <span>Pipeline Queue Status</span>
              <span>{progress.http1}% Completed</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-100"
                style={{ width: `${progress.http1}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-amber-800">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Request #2 is blocked waiting for slow Request #1 to finish transmitting.</span>
          </div>
        </div>

        {/* HTTP/2 & gRPC Multiplexed Lane */}
        <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900">HTTP/2 & gRPC (Multiplexed Streams)</span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Zero Head-of-Line Blocking
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-600">
              <span>Interleaved Frame Dispatch</span>
              <span>{progress.http2}% Completed</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-100"
                style={{ width: `${progress.http2}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>All 6 streams transmit interleaved frames concurrently over 1 TCP connection.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
