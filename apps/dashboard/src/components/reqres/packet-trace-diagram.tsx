'use client';

import React from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Network, Terminal } from 'lucide-react';

interface PacketTraceDiagramProps {
  variant: string;
}

export function PacketTraceDiagram({ variant }: PacketTraceDiagramProps) {
  const traces = [
    { from: 'Client', to: 'Server', label: variant === 'grpc-unary' ? 'HTTP/2 HEADERS + DATA (Stream 1)' : 'HTTP POST /api/v1/rest/benchmark', bytes: '184 B', time: '0.00ms' },
    { from: 'Server', to: 'Server', label: 'Engine AST Deserialization & Processing', bytes: 'Internal', time: '+0.12ms' },
    { from: 'Server', to: 'Client', label: variant === 'grpc-unary' ? 'HTTP/2 HEADERS + DATA + TRAILERS (grpc-status: 0)' : 'HTTP 200 OK (application/json)', bytes: '142 B', time: '+0.48ms' },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-card space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Network className="w-4 h-4 text-cyan-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Packet Sequence Flow & Handshake Trace</h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-semibold">
          Synchronous Request-Response
        </span>
      </div>

      {/* Ladder Sequence Diagram */}
      <div className="bg-slate-50/70 border border-slate-200/60 rounded-lg p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between font-bold text-slate-700 pb-2 border-b border-slate-200">
          <span>CLIENT (Port 3001)</span>
          <span>NETWORK WIRE</span>
          <span>ORCHESTRATOR (Port 4000)</span>
        </div>

        <div className="space-y-3 py-2">
          {traces.map((trace, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-2 bg-white rounded border border-slate-200/80 shadow-2xs">
              <div className="w-24 text-[11px] text-slate-500 font-semibold">{trace.from}</div>
              <div className="flex-1 flex items-center justify-center space-x-2 px-3">
                {trace.from === 'Client' ? (
                  <>
                    <span className="text-slate-900 font-semibold">{trace.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
                  </>
                ) : trace.to === 'Client' ? (
                  <>
                    <ArrowLeft className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-slate-900 font-semibold">{trace.label}</span>
                  </>
                ) : (
                  <span className="text-amber-600 font-semibold">⚙️ {trace.label}</span>
                )}
              </div>
              <div className="text-right w-28 text-[11px]">
                <span className="text-slate-400">{trace.time}</span> • <span className="font-bold text-slate-700">{trace.bytes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
