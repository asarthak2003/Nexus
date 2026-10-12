'use client';

import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Gauge, Zap } from 'lucide-react';

export interface LatencyData {
  minMs: number;
  maxMs: number;
  meanMs: number;
  p50Ms: number;
  p90Ms: number;
  p95Ms: number;
  p99Ms: number;
  throughputReqPerSec: number;
  headOfLineBlockingDetected: boolean;
}

interface LatencyComparisonChartProps {
  latency: LatencyData | null;
  variant: string;
}

export function LatencyComparisonChart({ latency, variant }: LatencyComparisonChartProps) {
  if (!latency) {
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl p-8 shadow-card flex flex-col items-center justify-center text-center space-y-2 min-h-[260px]">
        <Activity className="w-8 h-8 text-slate-300 animate-pulse" />
        <h3 className="text-sm font-bold text-slate-700">No Benchmark Data Yet</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Select your scenario parameters and click &ldquo;Execute Live Comparative Benchmark&rdquo; to measure latency percentiles and throughput.
        </p>
      </div>
    );
  }

  const percentiles = [
    { label: 'p50 (Median)', value: latency.p50Ms, color: 'bg-emerald-500', barWidth: Math.min(100, latency.p50Ms * 25) },
    { label: 'p90 (90th)', value: latency.p90Ms, color: 'bg-blue-500', barWidth: Math.min(100, latency.p90Ms * 25) },
    { label: 'p95 (95th)', value: latency.p95Ms, color: 'bg-amber-500', barWidth: Math.min(100, latency.p95Ms * 25) },
    { label: 'p99 (Tail)', value: latency.p99Ms, color: 'bg-rose-500', barWidth: Math.min(100, latency.p99Ms * 25) },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-card space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Gauge className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Latency & Throughput Profile</h2>
        </div>
        <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
          {variant.toUpperCase()}
        </span>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-medium text-slate-500">Throughput</span>
          <div className="mt-1 text-lg font-bold font-mono text-slate-900">
            {latency.throughputReqPerSec.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">req/s</span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-medium text-slate-500">Mean Latency</span>
          <div className="mt-1 text-lg font-bold font-mono text-slate-900">
            {latency.meanMs} <span className="text-[10px] text-slate-500 font-normal">ms</span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-medium text-slate-500">Fastest (Min)</span>
          <div className="mt-1 text-lg font-bold font-mono text-emerald-600">
            {latency.minMs} <span className="text-[10px] text-slate-500 font-normal">ms</span>
          </div>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/60">
          <span className="text-[11px] font-medium text-slate-500">Worst Tail (Max)</span>
          <div className="mt-1 text-lg font-bold font-mono text-rose-600">
            {latency.maxMs} <span className="text-[10px] text-slate-500 font-normal">ms</span>
          </div>
        </div>
      </div>

      {/* Percentiles Bar Visualizer */}
      <div className="space-y-3 pt-1">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Percentile Breakdown</h4>
        <div className="space-y-2">
          {percentiles.map((p, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600 font-medium">{p.label}</span>
                <span className="font-bold text-slate-900">{p.value} ms</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${p.color}`}
                  style={{ width: `${Math.max(8, p.barWidth)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Head-of-line blocking alert */}
      <div className={`p-3 rounded-lg border flex items-center space-x-2.5 text-xs ${
        latency.headOfLineBlockingDetected
          ? 'bg-amber-50 border-amber-200 text-amber-800'
          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
      }`}>
        {latency.headOfLineBlockingDetected ? (
          <>
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span><strong>Head-of-Line Blocking Detected:</strong> Tail p99 latency spiked significantly over p50 due to connection queuing.</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>Healthy Stream Pipelining:</strong> Consistent low jitter observed across all percentiles.</span>
          </>
        )}
      </div>
    </div>
  );
}
