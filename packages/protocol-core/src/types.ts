//All taxonomic categories for protocols in Nexus
export type PluginCategory =
  | 'transport'
  | 'request-response'
  | 'streaming'
  | 'messaging'
  | 'callbacks'
  | 'media'
  | 'file-storage'
  | 'database'
  | 'infrastructure'
  | 'security-auth'
  | 'industry-standard';

//Underlying network transport layer
export type TransportType = 'TCP' | 'UDP' | 'QUIC' | 'SCTP' | 'N/A';

//Standard benchmark scenario definition
export interface Scenario {
  id: string;
  name: string;
  type: 'echo' | 'crud' | 'stream' | 'fanout' | 'upload' | 'query';
  payloadSizeBytes: number;
  totalRequests?: number;
  concurrency?: number;
  durationSeconds?: number;
}

//Standard unified metric result returned by all protocol benchmarks
export interface BenchmarkResult {
  protocolId: string;
  protocolName: string;
  scenarioId: string;
  timestamp: Date;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  throughputReqSec: number;
  errorRatePercent: number;
  payloadBytes: number;
  wireBytes: number;
  cpuPercent: number;
  memoryMb: number;
}

//Packet/frame level trace event for the frontend animated diagrams
export interface TraceEvent {
  timestampMs: number;
  from: 'client' | 'server' | 'broker';
  to: 'client' | 'server' | 'broker';
  label: string;
  wireFrameBytes?: number;
  description?: string;
}

//Protocol Metadata specification
export interface ProtocolMeta {
  id: string;
  name: string;
  category: PluginCategory;
  transport: TransportType;
  description: string;
  whenToUse: string[];
  whenNotToUse: string[];
  docUrl: string;
}

//The standard contract that every protocol plugin must implement.
export interface IProtocolPlugin {
  readonly meta: ProtocolMeta;
  startServer(port: number): Promise<void>;
  stopServer(): Promise<void>;
  runScenario(scenario: Scenario): Promise<BenchmarkResult>;
  trace(scenario: Scenario): Promise<TraceEvent[]>;
}
