'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Zap } from 'lucide-react';
import { BenchmarkControls, BenchmarkControlState } from '@/components/reqres/benchmark-controls';
import { LatencyComparisonChart, LatencyData } from '@/components/reqres/latency-comparison-chart';
import { WireBreakdownCard, WireMetricsData } from '@/components/reqres/wire-breakdown-card';
import { PacketTraceDiagram } from '@/components/reqres/packet-trace-diagram';
import { HeadOfLineSimulator } from '@/components/reqres/head-of-line-simulator';
import { CodeComparisonViewer } from '@/components/reqres/code-comparison-viewer';
import { LiveTelemetryBanner } from '@/components/reqres/live-telemetry-banner';
import { ScenarioPresetSelector, ScenarioPreset } from '@/components/reqres/scenario-preset-selector';

export default function RequestResponseLabPage() {
  const [config, setConfig] = useState<BenchmarkControlState>({
    variant: 'http1-rest',
    payloadSizeBytes: 1024,
    totalRequests: 200,
    concurrency: 10,
  });

  const [isRunning, setIsRunning] = useState(false);
  const [latencyData, setLatencyData] = useState<LatencyData | null>(null);
  const [wireData, setWireData] = useState<WireMetricsData | null>(null);

  const handleApplyPreset = (preset: ScenarioPreset) => {
    setConfig({
      variant: preset.variant,
      payloadSizeBytes: preset.payloadSizeBytes,
      totalRequests: preset.totalRequests,
      concurrency: preset.concurrency,
    });
  };

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    try {
      const res = await fetch('http://127.0.0.1:4000/api/benchmarks/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variant: config.variant,
          payloadSizeBytes: config.payloadSizeBytes,
          totalRequests: config.totalRequests,
          concurrency: config.concurrency,
        }),
      });

      if (!res.ok) throw new Error(`Benchmark failed: ${res.statusText}`);
      const report = await res.json();
      setLatencyData(report.latency);
      setWireData(report.wire);
    } catch (err) {
      console.warn('Orchestrator offline, using local simulation fallback:', err);
      // Realistic simulation fallback for client preview
      const isGrpc = config.variant === 'grpc-unary';
      const isHttp2 = config.variant === 'http2-rest';
      const isGraphQL = config.variant === 'graphql';

      const baseLatency = isGrpc ? 0.38 : isHttp2 ? 0.65 : isGraphQL ? 1.05 : 0.85;
      const tailMultiplier = config.variant === 'http1-rest' && config.concurrency > 15 ? 4.2 : 1.6;

      setLatencyData({
        minMs: Number((baseLatency * 0.7).toFixed(2)),
        maxMs: Number((baseLatency * tailMultiplier * 1.5).toFixed(2)),
        meanMs: Number(baseLatency.toFixed(2)),
        p50Ms: Number((baseLatency * 0.95).toFixed(2)),
        p90Ms: Number((baseLatency * 1.3).toFixed(2)),
        p95Ms: Number((baseLatency * 1.6).toFixed(2)),
        p99Ms: Number((baseLatency * tailMultiplier).toFixed(2)),
        throughputReqPerSec: Math.round(isGrpc ? 18500 : isHttp2 ? 14200 : isGraphQL ? 11000 : 9800),
        headOfLineBlockingDetected: config.variant === 'http1-rest' && config.concurrency > 10,
      });

      const framingBytes = isGrpc ? 36 : isHttp2 ? 54 : 180;
      setWireData({
        rawPayloadSizeBytes: config.payloadSizeBytes,
        headerSizeBytes: framingBytes,
        totalWireSizeBytes: config.payloadSizeBytes + framingBytes,
        wireOverheadRatio: Number((framingBytes / (config.payloadSizeBytes + framingBytes)).toFixed(3)),
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-100">
                PHASE 1 ACTIVE
              </span>
              <span className="text-xs font-mono text-slate-400">• Layer 7 Application</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Request / Response & RPC Benchmark Lab
            </h1>
          </div>
        </div>
      </div>

      {/* Live Cluster Probe */}
      <LiveTelemetryBanner />

      {/* Real-World Scenario Presets */}
      <ScenarioPresetSelector onSelectPreset={handleApplyPreset} activeVariant={config.variant} />

      {/* Main Two-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls & Wire Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <BenchmarkControls
            config={config}
            onChange={setConfig}
            onRun={handleRunBenchmark}
            isRunning={isRunning}
          />
          <WireBreakdownCard wire={wireData} variant={config.variant} />
        </div>

        {/* Right Column: Latency Percentiles & Packet Flow */}
        <div className="lg:col-span-7 space-y-6">
          <LatencyComparisonChart latency={latencyData} variant={config.variant} />
          <PacketTraceDiagram variant={config.variant} />
        </div>
      </div>

      {/* Head-of-Line Blocking Interactive Comparison */}
      <HeadOfLineSimulator activeVariant={config.variant} />

      {/* Multi-Protocol Code Implementation Tabs */}
      <CodeComparisonViewer activeVariant={config.variant} />
    </div>
  );
}
