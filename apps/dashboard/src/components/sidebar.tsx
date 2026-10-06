import React from 'react';
import Link from 'next/link';
import { 
  Network, 
  Layers, 
  Radio, 
  Activity, 
  Building2, 
  ShieldCheck, 
  FolderArchive, 
  Database, 
  Server,
  Film,
  Cpu,
  Zap
} from 'lucide-react';

const categories = [
  {
    section: '01. Transport & Wire',
    items: [
      { name: 'TCP, UDP, QUIC, SCTP', href: '/protocols/transport', icon: Network, layer: 'L4' },
      { name: 'TLS 1.3, DTLS, mTLS', href: '/protocols/security', icon: ShieldCheck, layer: 'SEC' },
    ],
  },
  {
    section: '02. Request / Response & RPCs',
    items: [
      { name: 'REST (HTTP 1.1 / 2 / 3)', href: '/protocols/request-response', icon: Layers, layer: 'L7', active: true },
      { name: 'gRPC, GraphQL, JSON-RPC', href: '/protocols/request-response', icon: Zap, layer: 'RPC' },
      { name: 'SOAP, OData, Thrift, Avro', href: '/protocols/request-response', icon: Server, layer: 'IDL' },
    ],
  },
  {
    section: '03. Streaming & Push',
    items: [
      { name: 'WebSocket & SSE', href: '/protocols/streaming', icon: Radio, layer: 'DUPLEX' },
      { name: 'WebTransport & gRPC Stream', href: '/protocols/streaming', icon: Activity, layer: 'STREAM' },
    ],
  },
  {
    section: '04. Event Brokers & Queues',
    items: [
      { name: 'Kafka & Redis Streams', href: '/protocols/messaging', icon: Activity, layer: 'LOG' },
      { name: 'RabbitMQ (AMQP) & NATS', href: '/protocols/messaging', icon: Zap, layer: 'BROKER' },
      { name: 'MQTT 5.0 & STOMP', href: '/protocols/messaging', icon: Radio, layer: 'IOT' },
    ],
  },
  {
    section: '05. Data Wire & Storage',
    items: [
      { name: 'Postgres, MySQL, Mongo Wire', href: '/protocols/database', icon: Database, layer: 'SQL' },
      { name: 'Redis RESP2 / RESP3', href: '/protocols/database', icon: Server, layer: 'RESP' },
      { name: 'S3 API, SFTP, WebDAV, NFS', href: '/protocols/storage', icon: FolderArchive, layer: 'IO' },
    ],
  },
  {
    section: '06. Media & Real-Time Comm',
    items: [
      { name: 'WebRTC (ICE/STUN/TURN)', href: '/protocols/media', icon: Radio, layer: 'RTC' },
      { name: 'RTSP, SIP, RTP, RTMP, SRT', href: '/protocols/media', icon: Film, layer: 'RTP' },
      { name: 'HLS & MPEG-DASH', href: '/protocols/media', icon: Activity, layer: 'ABR' },
    ],
  },
  {
    section: '07. Industry Standards',
    items: [
      { name: 'Healthcare (FHIR, HL7, DICOM)', href: '/protocols/healthcare', icon: Building2, layer: 'HL7' },
      { name: 'Finance (FIX, ISO 8583, SWIFT)', href: '/protocols/finance', icon: Building2, layer: 'FIX' },
      { name: 'IoT (OPC UA, Modbus, CoAP)', href: '/protocols/industrial', icon: Zap, layer: 'OT' },
      { name: 'Supply Chain (EDI/AS2, ONVIF)', href: '/protocols/industry', icon: Server, layer: 'B2B' },
    ],
  },
  {
    section: '08. Net Services & Formats',
    items: [
      { name: 'DNS, DoH, DoT, SMTP, NTP', href: '/protocols/infrastructure', icon: Server, layer: 'NET' },
      { name: 'Protobuf, Avro, MsgPack, CBOR', href: '/protocols/serialization', icon: Layers, layer: 'WIRE' },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="w-72 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 overflow-y-auto select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-base shadow-sm ring-1 ring-slate-800">
            N
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-sm tracking-tight text-slate-900">NEXUS</span>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-100">
                88 STDS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Protocol Benchmark Core</p>
          </div>
        </div>
      </div>

      {/* Navigation Taxonomy */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-1">
            <h2 className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider px-2.5 mb-1">
              {cat.section}
            </h2>
            <div className="space-y-0.5">
              {cat.items.map((item, itemIdx) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={itemIdx}
                    href={item.href}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                      item.active
                        ? 'bg-slate-100/90 text-slate-900 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${item.active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-slate-400 group-hover:text-slate-600 bg-slate-100 px-1 py-0.2 rounded border border-slate-200/60">
                      {item.layer}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Engine Status Card */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="p-2.5 rounded-lg border border-slate-200/80 bg-white shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[11px] font-semibold text-slate-700">Cluster Engine</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100">
            <div>Node: <span className="font-semibold text-slate-700">v22.23</span></div>
            <div>Port: <span className="font-semibold text-slate-700">4000</span></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
