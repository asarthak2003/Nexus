import http from 'http';
import http2 from 'http2';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import crypto from 'crypto';
import { 
  ReqResBenchmarkConfig, 
  ReqResComparisonReport, 
  DetailedLatencyMetrics, 
  WireMetrics 
} from '../types';
import { resolveEchoProtoPath } from '../proto-resolver';

export class ReqResBenchmarkRunner {
  private grpcClient: any = null;

  constructor() {
    const protoPath = resolveEchoProtoPath();
    const packageDefinition = protoLoader.loadSync(protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
    const grpcHost = process.env.GRPC_HOST || '127.0.0.1';
    this.grpcClient = new protoDescriptor.nexus.reqres.EchoBenchmarkService(
      `${grpcHost}:50051`,
      grpc.credentials.createInsecure()
    );
  }

  async runScenario(config: ReqResBenchmarkConfig): Promise<ReqResComparisonReport> {
    const latencies: number[] = [];
    const payloadData = 'x'.repeat(config.payloadSizeBytes);
    const startWallTime = Date.now();

    let totalBytesSent = 0;
    let totalBytesReceived = 0;

    // Execute benchmark batches based on concurrency
    for (let i = 0; i < config.totalRequests; i += config.concurrency) {
      const batchSize = Math.min(config.concurrency, config.totalRequests - i);
      const batchPromises = Array.from({ length: batchSize }).map(() => 
        this.executeSingleRequest(config.variant, payloadData)
      );

      const results = await Promise.all(batchPromises);
      for (const res of results) {
        latencies.push(res.latencyMs);
        totalBytesSent += res.bytesSent;
        totalBytesReceived += res.bytesReceived;
      }
    }

    const totalDurationSec = (Date.now() - startWallTime) / 1000;
    latencies.sort((a, b) => a - b);

    const latencyMetrics: DetailedLatencyMetrics = {
      minMs: Number(latencies[0]?.toFixed(2) || 0),
      maxMs: Number(latencies[latencies.length - 1]?.toFixed(2) || 0),
      meanMs: Number((latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2)),
      p50Ms: Number((latencies[Math.floor(latencies.length * 0.50)] || 0).toFixed(2)),
      p90Ms: Number((latencies[Math.floor(latencies.length * 0.90)] || 0).toFixed(2)),
      p95Ms: Number((latencies[Math.floor(latencies.length * 0.95)] || 0).toFixed(2)),
      p99Ms: Number((latencies[Math.floor(latencies.length * 0.99)] || 0).toFixed(2)),
      throughputReqPerSec: Number((config.totalRequests / (totalDurationSec || 1)).toFixed(1)),
      headOfLineBlockingDetected: (latencies[Math.floor(latencies.length * 0.99)] || 0) > (latencies[Math.floor(latencies.length * 0.50)] || 1) * 4,
    };

    const avgWireBytes = (totalBytesSent + totalBytesReceived) / config.totalRequests;
    const wireMetrics: WireMetrics = {
      rawPayloadSizeBytes: config.payloadSizeBytes,
      headerSizeBytes: Math.max(0, Math.round(avgWireBytes - config.payloadSizeBytes)),
      totalWireSizeBytes: Math.round(avgWireBytes),
      wireOverheadRatio: Number(((avgWireBytes - config.payloadSizeBytes) / (avgWireBytes || 1)).toFixed(3)),
    };

    return {
      scenarioId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      config,
      wire: wireMetrics,
      latency: latencyMetrics,
    };
  }

  private async executeSingleRequest(variant: string, payload: string): Promise<{ latencyMs: number; bytesSent: number; bytesReceived: number }> {
    const startTime = process.hrtime.bigint();
    const host = process.env.ORCHESTRATOR_HOST || '127.0.0.1';

    if (variant === 'grpc-unary') {
      return new Promise((resolve, reject) => {
        this.grpcClient.UnaryBenchmark(
          {
            id: crypto.randomUUID(),
            timestamp_ns: startTime.toString(),
            payload_size_bytes: payload.length,
            data: Buffer.from(payload),
          },
          (err: any) => {
            if (err) return reject(err);
            const endTime = process.hrtime.bigint();
            const latencyMs = Number(endTime - startTime) / 1_000_000;
            const estimatedBytes = payload.length + 32; // compact protobuf framing
            resolve({ latencyMs, bytesSent: estimatedBytes, bytesReceived: estimatedBytes });
          }
        );
      });
    }

    if (variant === 'graphql') {
      const body = JSON.stringify({
        query: `mutation RunBenchmark($id: String!, $ts: String!, $size: Int!, $data: String) {
          benchmark(id: $id, timestampNs: $ts, payloadSize: $size, data: $data) {
            id
            serverReceivedTimestampNs
            payloadSizeBytes
          }
        }`,
        variables: {
          id: crypto.randomUUID(),
          ts: startTime.toString(),
          size: payload.length,
          data: payload,
        },
      });

      const res = await fetch(`http://${host}:4000/api/v1/graphql`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.text();
      const endTime = process.hrtime.bigint();
      const latencyMs = Number(endTime - startTime) / 1_000_000;
      return { latencyMs, bytesSent: body.length + 120, bytesReceived: data.length + 150 };
    }

    // Default REST HTTP/1.1
    const body = JSON.stringify({
      id: crypto.randomUUID(),
      timestampNs: startTime.toString(),
      payloadSize: payload.length,
      data: payload,
    });

    const res = await fetch(`http://${host}:4000/api/v1/rest/benchmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const data = await res.text();
    const endTime = process.hrtime.bigint();
    const latencyMs = Number(endTime - startTime) / 1_000_000;

    return {
      latencyMs,
      bytesSent: body.length + 180,
      bytesReceived: data.length + 180,
    };
  }
}
