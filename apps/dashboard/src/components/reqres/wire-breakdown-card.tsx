'use client';

import React from 'react';
import { HardDrive, Layers, ShieldCheck } from 'lucide-react';

export interface WireMetricsData {
  rawPayloadSizeBytes: number;
  headerSizeBytes: number;
  totalWireSizeBytes: number;
  wireOverheadRatio: number;
}

interface WireBreakdownCardProps {
  wire: WireMetricsData | null;
  variant: string;
}

export function WireBreakdownCard({ wire, variant }: WireBreakdownCardProps) {
  if (!wire) return null;

  const isProtobuf = variant === 'grpc-unary';
  const payloadPercent = Math.round((wire.rawPayloadSizeBytes / (wire.totalWireSizeBytes || 1)) * 100);
  const headerPercent = 100 - payloadPercent;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <HardDrive className="w-4 h-4 text-brand-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Wire Serialization & Framing Overhead</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Overhead: <strong>{(wire.wireOverheadRatio * 100).toFixed(1)}%</strong>
        </span>
      </div>

      {/* Visual Stacked Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Payload Data ({payloadPercent}%)</span>
          <span className="text-slate-500">Header / Framing ({headerPercent}%)</span>
        </div>
        <div className="w-full bg-slate-100 rounded-lg h-5 flex overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className="bg-brand-600 h-full rounded-l text-[10px] text-white flex items-center justify-center font-mono font-bold transition-all duration-500"
            style={{ width: `${Math.max(5, payloadPercent)}%` }}
          >
            {wire.rawPayloadSizeBytes} B
          </div>
          <div
            className="bg-amber-400 h-full rounded-r text-[10px] text-slate-900 flex items-center justify-center font-mono font-bold transition-all duration-500"
            style={{ width: `${Math.max(5, headerPercent)}%` }}
          >
            {wire.headerSizeBytes} B
          </div>
        </div>
      </div>

      {/* Detailed Diagnostics Table */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
          <span className="text-[10px] text-slate-400 uppercase">Raw Payload</span>
          <div className="font-bold text-slate-900 mt-0.5">{wire.rawPayloadSizeBytes} Bytes</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
          <span className="text-[10px] text-slate-400 uppercase">Framing Overhead</span>
          <div className="font-bold text-amber-600 mt-0.5">+{wire.headerSizeBytes} Bytes</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
          <span className="text-[10px] text-slate-400 uppercase">Total on Wire</span>
          <div className="font-bold text-brand-600 mt-0.5">{wire.totalWireSizeBytes} Bytes</div>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 leading-relaxed">
        {isProtobuf ? (
          <span><strong>Protobuf Efficiency:</strong> Binary tags and varint encodings minimize header overhead, transferring up to 4x less wire metadata compared to JSON over HTTP/1.1.</span>
        ) : (
          <span><strong>HTTP/JSON Framing:</strong> Plaintext headers and string quotation inflate packet wire sizes, which is significantly mitigated when using HTTP/2 HPACK table compression.</span>
        )}
      </div>
    </div>
  );
}
