'use client';

import React, { useState } from 'react';
import { Check, Copy, Code2, Terminal } from 'lucide-react';

interface CodeComparisonViewerProps {
  activeVariant: string;
}

export function CodeComparisonViewer({ activeVariant }: CodeComparisonViewerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'fetch' | 'curl' | 'grpc' | 'graphql'>('fetch');

  const snippets = {
    fetch: `// Standard REST Client (HTTP/1.1 & HTTP/2)
const response = await fetch('http://localhost:4000/api/v1/rest/benchmark', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-nexus-client-id': 'client-01'
  },
  body: JSON.stringify({
    id: crypto.randomUUID(),
    payloadSize: 1024,
    data: 'x'.repeat(1024)
  })
});
const data = await response.json();`,

    curl: `# Direct Terminal cURL Benchmark
curl -X POST http://localhost:4000/api/v1/rest/benchmark \\
  -H "Content-Type: application/json" \\
  -d '{"id":"test-uuid","payloadSize":1024,"data":"..."}'`,

    grpc: `// Node.js gRPC Client with Protocol Buffers
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const pkg = protoLoader.loadSync('echo.proto');
const { EchoBenchmarkService } = grpc.loadPackageDefinition(pkg).nexus.reqres;
const client = new EchoBenchmarkService('localhost:50051', grpc.credentials.createInsecure());

client.UnaryBenchmark({
  id: 'bench-01',
  timestamp_ns: process.hrtime.bigint().toString(),
  payload_size_bytes: 1024,
  data: Buffer.alloc(1024)
}, (err, response) => {
  console.log('gRPC Latency & Status:', response);
});`,

    graphql: `// GraphQL POST Mutation with Exact Field Selection
const query = \`
  mutation RunBench($id: String!, $size: Int!, $data: String) {
    benchmark(id: $id, payloadSize: $size, data: $data) {
      id
      serverReceivedTimestampNs
      payloadSizeBytes
    }
  }
\`;

const res = await fetch('http://localhost:4000/api/v1/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query, variables: { id: 'uuid', size: 1024, data: '...' } })
});`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-card space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Client Implementation Comparison
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-0.5 rounded-lg text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('fetch')}
            className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'fetch' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            fetch()
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('curl')}
            className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'curl' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            cURL
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('grpc')}
            className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'grpc' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            gRPC (Node)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('graphql')}
            className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'graphql' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'}`}
          >
            GraphQL
          </button>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="relative rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-200 overflow-x-auto shadow-inner">
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-3 right-3 flex items-center space-x-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-700 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
        <pre className="pr-16 leading-relaxed">{snippets[activeTab]}</pre>
      </div>
    </div>
  );
}
