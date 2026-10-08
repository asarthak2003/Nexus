import { z } from 'zod';

export type ProtocolVariant = 'http1-rest' | 'http2-rest' | 'graphql' | 'grpc-unary';

export const ReqResBenchmarkSchema = z.object({
  variant: z.enum(['http1-rest', 'http2-rest', 'graphql', 'grpc-unary']),
  payloadSizeBytes: z.number().min(0).max(10 * 1024 * 1024).default(1024), // 0 to 10MB
  totalRequests: z.number().min(1).max(100000).default(1000),
  concurrency: z.number().min(1).max(200).default(10),
  keepAlive: z.boolean().default(true),
  customHeaderCount: z.number().min(0).max(100).default(5),
});

export type ReqResBenchmarkConfig = z.infer<typeof ReqResBenchmarkSchema>;

//Calculate exact header to payload ratio
export interface WireMetrics {
  rawPayloadSizeBytes: number;
  headerSizeBytes: number;
  totalWireSizeBytes: number;
  wireOverheadRatio: number; // headerSize / totalSize
}

export interface DetailedLatencyMetrics {
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

export interface ReqResComparisonReport {
  scenarioId: string;
  timestamp: string;
  config: ReqResBenchmarkConfig;
  wire: WireMetrics;
  latency: DetailedLatencyMetrics;
}
