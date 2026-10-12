'use client';

import React from 'react';
import { Play, RotateCcw, Sliders } from 'lucide-react';

export interface BenchmarkControlState {
  variant: 'http1-rest' | 'http2-rest' | 'graphql' | 'grpc-unary';
  payloadSizeBytes: number;
  totalRequests: number;
  concurrency: number;
}

interface BenchmarkControlsProps {
  config: BenchmarkControlState;
  onChange: (state: BenchmarkControlState) => void;
  onRun: () => void;
  isRunning: boolean;
}

export function BenchmarkControls({ config, onChange, onRun, isRunning }: BenchmarkControlsProps) {
  const payloadPresets = [
    { label: '100 B (Micro)', bytes: 100 },
    { label: '1 KB (Standard)', bytes: 1024 },
    { label: '10 KB (Medium)', bytes: 10240 },
    { label: '100 KB (Large)', bytes: 102400 },
  ];

  const variants = [
    { id: 'http1-rest', label: 'REST (HTTP/1.1)', badge: 'JSON' },
    { id: 'http2-rest', label: 'REST (HTTP/2)', badge: 'HPACK' },
    { id: 'graphql', label: 'GraphQL', badge: 'AST' },
    { id: 'grpc-unary', label: 'gRPC Unary', badge: 'Protobuf' },
  ] as const;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-card space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-brand-600" />
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">Benchmark Scenario Controls</h2>
        </div>
        <span className="text-[11px] font-mono font-medium text-slate-400 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded">
          Target: Port 4000
        </span>
      </div>

      {/* Protocol Variant Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-600">Select Protocol Standard</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => onChange({ ...config, variant: v.id })}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                config.variant === v.id
                  ? 'bg-brand-50 border-brand-500/50 text-brand-700 font-semibold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{v.label}</span>
              <span className="text-[9px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                {v.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Payload Size Presets */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600">Payload Size</label>
          <span className="text-xs font-mono font-bold text-brand-600">
            {config.payloadSizeBytes >= 1024 ? `${config.payloadSizeBytes / 1024} KB` : `${config.payloadSizeBytes} Bytes`}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {payloadPresets.map((preset) => (
            <button
              key={preset.bytes}
              type="button"
              onClick={() => onChange({ ...config, payloadSizeBytes: preset.bytes })}
              className={`px-2.5 py-1.5 rounded-md text-xs font-mono transition-all border ${
                config.payloadSizeBytes === preset.bytes
                  ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Concurrency & Request Volume Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600">Total Requests</label>
            <span className="text-xs font-mono font-bold text-slate-800">{config.totalRequests} reqs</span>
          </div>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={config.totalRequests}
            onChange={(e) => onChange({ ...config, totalRequests: Number(e.target.value) })}
            className="w-full accent-brand-600 cursor-pointer"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-600">Concurrency Level</label>
            <span className="text-xs font-mono font-bold text-slate-800">{config.concurrency} concurrent</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={config.concurrency}
            onChange={(e) => onChange({ ...config, concurrency: Number(e.target.value) })}
            className="w-full accent-brand-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Action Trigger Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          {isRunning ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Executing Live Benchmark Suite...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Execute Live Comparative Benchmark</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
