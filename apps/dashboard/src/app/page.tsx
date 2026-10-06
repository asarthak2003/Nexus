import React from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Activity, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  Gauge, 
  Network, 
  Terminal, 
  Database,
  Radio,
  Building2,
  Server,
  Film,
  HardDrive,
  ArrowRight
} from 'lucide-react';

export default function HomePage() {
  const telemetryStats = [
    { label: 'Protocols Covered', value: '88 Standards', detail: 'Across 4 Taxonomy Layers', icon: Network },
    { label: 'Active Pipeline', value: 'Phase 0 Ready', detail: 'REST (H1/H2) vs gRPC vs GraphQL Next', icon: Layers },
    { label: 'Time-Series Store', value: 'TimescaleDB', detail: 'Docker Profile :storage Active', icon: Database },
    { label: 'Telemetry Engine', value: 'Fastify v5 + OTel', detail: 'Sub-millisecond trace hooks', icon: Gauge },
  ];

  const taxonomyCards = [
    {
      title: 'Request / Response & RPCs',
      layer: 'Layer 7 Application',
      desc: 'Measure latency distributions, head-of-line blocking, and serialization efficiency across modern and legacy request/response architectures.',
      protocols: ['REST (HTTP/1.1)', 'REST (HTTP/2)', 'REST (HTTP/3)', 'GraphQL', 'gRPC Unary', 'JSON-RPC 2.0', 'SOAP / WSDL', 'OData', 'JSON:API', 'Apache Thrift', 'Avro RPC'],
      href: '/protocols/request-response',
      phase: 'Phase 1 Next',
      statusColor: 'bg-emerald-500',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    },
    {
      title: 'Real-Time & Bidirectional Streaming',
      layer: 'Full-Duplex / Push',
      desc: 'Inspect connection lifecycles, ping/pong framing overhead, and latency jitter across persistent streaming and push transports.',
      protocols: ['WebSocket (RFC 6455)', 'Server-Sent Events (SSE)', 'Long Polling', 'HTTP/3 WebTransport', 'gRPC Client Stream', 'gRPC Server Stream', 'gRPC Bidi Stream'],
      href: '/protocols/streaming',
      phase: 'Phase 2',
      statusColor: 'bg-slate-300',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Event-Driven Messaging & Queues',
      layer: 'Pub/Sub & Log Queues',
      desc: 'High-throughput broker benchmarks comparing partitions, consumer group rebalancing, message delivery guarantees, and backpressure.',
      protocols: ['Apache Kafka', 'RabbitMQ (AMQP 0-9-1)', 'AMQP 1.0 (ISO 19464)', 'MQTT 3.1.1 / 5.0', 'NATS Core', 'NATS JetStream', 'STOMP', 'Redis Streams', 'Web Push (RFC 8030)'],
      href: '/protocols/messaging',
      phase: 'Phase 3',
      statusColor: 'bg-slate-300',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Security, Cryptography & Auth',
      layer: 'TLS & Identity Wire',
      desc: 'Deep-dive into TLS handshakes (0-RTT vs 1-RTT), mutual TLS certificate validation, token exchange flows, and webhook signature verification.',
      protocols: ['TLS 1.3', 'DTLS', 'mTLS (X.509)', 'OAuth 2.0 (PKCE)', 'OpenID Connect', 'SAML 2.0', 'JWT (JWS/JWE)', 'HMAC Webhooks', 'SSH Tunneling'],
      href: '/protocols/security',
      phase: 'Phase 4',
      statusColor: 'bg-slate-300',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Database Wire & Object Storage',
      layer: 'Data Tier Protocols',
      desc: 'Inspect raw database client-server communication wire protocols, binary query execution, connection pooling, and multi-part object storage.',
      protocols: ['PostgreSQL Wire v3', 'MySQL Protocol', 'MongoDB Wire (OP_MSG)', 'Redis RESP2 / RESP3', 'TDS (SQL Server)', 'Cassandra CQL', 'Memcached', 'AWS S3 API', 'SFTP', 'FTPS', 'WebDAV', 'NFS / SMB'],
      href: '/protocols/database',
      phase: 'Phase 5',
      statusColor: 'bg-slate-300',
      tagColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
    {
      title: 'Media & Real-Time Communications',
      layer: 'VoIP & Video Transport',
      desc: 'Inspect real-time voice, video streaming, jitter buffer smoothing, adaptive bitrate chunking, and peer-to-peer data channel pipelines.',
      protocols: ['WebRTC (ICE/STUN/TURN)', 'RTSP', 'SIP / SDP', 'RTP / RTCP', 'SRTP', 'RTMP', 'SRT', 'Apple HLS', 'MPEG-DASH'],
      href: '/protocols/media',
      phase: 'Phase 6',
      statusColor: 'bg-slate-300',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      title: 'Industry-Specific Standards',
      layer: 'Vertical Domain Protocols',
      desc: 'Compliance and byte-level inspection for mission-critical protocols in healthcare, high-frequency finance, industrial automation, and supply chains.',
      protocols: ['HL7 v2 (MLLP)', 'FHIR (JSON/REST)', 'DICOM / DICOMweb', 'FIX Protocol (4.2-5.0)', 'ISO 8583 (Card TX)', 'SWIFT / ISO 20022', 'OPC UA (Binary)', 'Modbus TCP/RTU', 'CoAP (IoT)', 'BACnet', 'ONVIF', 'EDI / AS2', 'Diameter'],
      href: '/protocols/industry',
      phase: 'Phase 7',
      statusColor: 'bg-slate-300',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'Transport, Network & Serialization',
      layer: 'L4 Transport & Formats',
      desc: 'Evaluate lower-layer transport reliability, network address resolution protocols, and byte-for-byte wire serialization efficiency comparisons.',
      protocols: ['TCP', 'UDP', 'QUIC', 'SCTP', 'IPv4 / IPv6', 'DNS (UDP/TCP 53)', 'DoH (RFC 8484)', 'DoT (RFC 7858)', 'SMTP / IMAP / POP3', 'NTP', 'Protobuf v3', 'Avro', 'MessagePack', 'CBOR', 'FlatBuffers', 'JSON vs XML'],
      href: '/protocols/transport',
      phase: 'Phase 8',
      statusColor: 'bg-slate-300',
      tagColor: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  ];

  const recentTraces = [
    { method: 'POST', path: '/api/benchmarks/run', protocol: 'HTTP/2', duration: '1.24ms', status: '200 OK', wire: '184 B' },
    { method: 'RPC', path: 'EchoService.UnaryEcho', protocol: 'gRPC', duration: '0.48ms', status: '0 OK', wire: '38 B' },
    { method: 'GET', path: '/api/plugins', protocol: 'HTTP/1.1', duration: '2.10ms', status: '200 OK', wire: '1.2 KB' },
    { method: 'RESP', path: 'PING -> +PONG', protocol: 'Redis RESP3', duration: '0.12ms', status: 'OK', wire: '14 B' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-8 shadow-card bg-grid-slate">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-mono font-medium text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-600"></span>
            <span>Nexus Protocol Engineering Lab</span>
            <span className="text-slate-300">•</span>
            <span>UAT Cluster</span>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Where Every Connection Begins.
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed">
            A living benchmark suite and visualization console measuring protocol performance, packet transmission overhead, handshake latency, and wire serialization efficiency across <strong>88 modern distributed system communication standards</strong>.
          </p>
        </div>
      </div>

      {/* Telemetry HUD Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {telemetryStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-card hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{stat.label}</span>
                <Icon className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2 text-xl font-bold text-slate-900 font-mono tracking-tight">
                {stat.value}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{stat.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Taxonomy Matrix Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Protocol Taxonomy Matrix</h2>
            <p className="text-xs text-slate-500">Explore and compare all 88 communication protocols across the 8 architecture tiers.</p>
          </div>
          <span className="text-xs font-mono text-brand-600 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full font-semibold">
            8 Architecture Tiers • 88 Protocols
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {taxonomyCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.href}
              className="group relative bg-white border border-slate-200/80 rounded-xl p-6 shadow-card hover:shadow-card-hover hover:border-brand-500/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${card.tagColor}`}>
                    {card.layer}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-500">
                    <span className={`w-2 h-2 rounded-full ${card.statusColor}`}></span>
                    <span>{card.phase}</span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors flex items-center justify-between">
                    <span>{card.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Protocol Chips */}
                <div className="pt-2 flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                  {card.protocols.map((proto, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-[10.5px] font-mono bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200/60"
                    >
                      {proto}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
                <span>View Protocol Benchmarks & Traces</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Live Trace Stream Preview */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Live Orchestrator Trace Stream
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            ● Real-Time Feed
          </span>
        </div>

        <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-200 space-y-2 overflow-x-auto shadow-inner">
          <div className="text-slate-400 text-[11px] pb-1 border-b border-slate-800 flex items-center justify-between">
            <span>METHOD / ENDPOINT</span>
            <span>PROTOCOL • LATENCY • STATUS • WIRE</span>
          </div>
          {recentTraces.map((trace, idx) => (
            <div key={idx} className="flex items-center justify-between text-slate-300 hover:bg-slate-800/60 py-1 px-1.5 rounded transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-amber-400 font-bold w-12">{trace.method}</span>
                <span className="text-slate-100">{trace.path}</span>
              </div>
              <div className="flex items-center space-x-4 text-[11px]">
                <span className="text-cyan-400">{trace.protocol}</span>
                <span className="text-emerald-400 font-semibold">{trace.duration}</span>
                <span className="text-slate-400">{trace.status}</span>
                <span className="text-slate-500 bg-slate-800 px-1.5 py-0.2 rounded">{trace.wire}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
