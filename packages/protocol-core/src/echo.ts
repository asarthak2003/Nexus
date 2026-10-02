import { IProtocolPlugin, ProtocolMeta, Scenario, BenchmarkResult, TraceEvent } from './types';

//Mock Echo Plugin for testing the plugin architecture
export class EchoPlugin implements IProtocolPlugin {
  readonly meta: ProtocolMeta = {
    id: 'echo-mock',
    name: 'Mock Echo Protocol',
    category: 'request-response',
    transport: 'TCP',
    description: 'Internal reference plugin used to validate the plugin architecture and benchmark pipelines.',
    whenToUse: ['Testing the orchestrator', 'CI/CD pipeline validation'],
    whenNotToUse: ['Production workloads'],
    docUrl: 'https://github.com',
  };

  private isRunning = false;
  private port = 0;

  async startServer(port: number): Promise<void> {
    this.port = port;
    this.isRunning = true;
  }

  async stopServer(): Promise<void> {
    this.isRunning = false;
  }

  async runScenario(scenario: Scenario): Promise<BenchmarkResult> {
    return {
      protocolId: this.meta.id,
      protocolName: this.meta.name,
      scenarioId: scenario.id,
      timestamp: new Date(),
      p50Ms: 0.45,
      p95Ms: 0.95,
      p99Ms: 1.20,
      throughputReqSec: 15000,
      errorRatePercent: 0,
      payloadBytes: scenario.payloadSizeBytes,
      wireBytes: scenario.payloadSizeBytes + 48,
      cpuPercent: 2.1,
      memoryMb: 24.5,
    };
  }

  async trace(scenario: Scenario): Promise<TraceEvent[]> {
    return [
      { timestampMs: 0, from: 'client', to: 'server', label: 'SYN', wireFrameBytes: 54, description: 'TCP Connection Initiation' },
      { timestampMs: 1, from: 'server', to: 'client', label: 'SYN-ACK', wireFrameBytes: 54, description: 'TCP Handshake Response' },
      { timestampMs: 2, from: 'client', to: 'server', label: 'ACK + ECHO_REQ', wireFrameBytes: scenario.payloadSizeBytes + 54, description: 'Data Payload Sent' },
      { timestampMs: 3, from: 'server', to: 'client', label: 'ECHO_RESP', wireFrameBytes: scenario.payloadSizeBytes + 54, description: 'Echoed Response Received' },
    ];
  }
}
