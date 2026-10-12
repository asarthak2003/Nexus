'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { BenchmarkControlState } from './benchmark-controls';

export interface ScenarioPreset extends BenchmarkControlState {
  title: string;
  description: string;
}

interface ScenarioPresetSelectorProps {
  onSelectPreset: (preset: ScenarioPreset) => void;
  activeVariant: string;
}

export function ScenarioPresetSelector({ onSelectPreset, activeVariant }: ScenarioPresetSelectorProps) {
  const presets: ScenarioPreset[] = [
    {
      title: 'High-Concurrency Microservices',
      description: '100 concurrent callers, 1 KB JSON vs Protobuf payload',
      variant: 'grpc-unary',
      payloadSizeBytes: 1024,
      totalRequests: 1000,
      concurrency: 50,
    },
    {
      title: 'Head-of-Line Bottleneck Test',
      description: 'Large 100 KB payload under HTTP/1.1 vs HTTP/2',
      variant: 'http1-rest',
      payloadSizeBytes: 102400,
      totalRequests: 150,
      concurrency: 20,
    },
    {
      title: 'Selective Field GraphQL Query',
      description: 'Sparse field extraction over single POST endpoint',
      variant: 'graphql',
      payloadSizeBytes: 10240,
      totalRequests: 300,
      concurrency: 15,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span>One-Click Real-World Scenarios</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectPreset(p)}
            className="text-left p-3 rounded-lg border border-slate-200/80 bg-white hover:border-brand-500/50 hover:shadow-xs transition-all cursor-pointer group"
          >
            <div className="font-bold text-xs text-slate-900 group-hover:text-brand-600 transition-colors">
              {p.title}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{p.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
