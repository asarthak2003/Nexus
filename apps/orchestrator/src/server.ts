import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { PluginRegistry } from './registry';
import { 
  RestProtocolPlugin, 
  GrpcProtocolPlugin,
  GraphQLProtocolPlugin,
  ReqResBenchmarkRunner,
  ReqResBenchmarkSchema
} from '@nexus/protocol-reqres';
import { Scenario } from '@nexus/protocol-core';

export async function createServer(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  });

  const registry = new PluginRegistry();
  const benchmarkRunner = new ReqResBenchmarkRunner();

  // Register Global Middlewares
  await app.register(cors, {
    origin: '*',
  });

  await app.register(websocket);

  // Initialize and Register Protocol Plugins
  const restPlugin = new RestProtocolPlugin();
  const grpcPlugin = new GrpcProtocolPlugin();
  const graphqlPlugin = new GraphQLProtocolPlugin();

  registry.register(restPlugin);
  registry.register(grpcPlugin);
  registry.register(graphqlPlugin);

  // Start background protocol listener servers
  try {
    await restPlugin.startServer(4001);
    await grpcPlugin.startServer(50051);
    await graphqlPlugin.startServer(4002);
  } catch (err) {
    app.log.warn({ err }, 'Some protocol listeners were already bound or had start notice');
  }

  // Health Check Endpoint
  app.get('/health', async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      registeredProtocols: registry.listAllMeta().map((m) => m.id),
    };
  });

  // Plugin Catalog Endpoint
  app.get('/api/plugins', async () => {
    const plugins = registry.listAllMeta();
    return {
      count: plugins.length,
      plugins,
    };
  });

  // Unified Scenario Benchmark Endpoint (Core contract)
  app.post<{ Body: { protocolId: string; scenario: Scenario } }>(
    '/api/benchmarks/run-scenario',
    async (request, reply) => {
      const { protocolId, scenario } = request.body || {};
      const plugin = registry.get(protocolId);

      if (!plugin) {
        return reply.status(404).send({ error: `Protocol "${protocolId}" not found in registry.` });
      }

      const result = await plugin.runScenario(scenario);
      return reply.status(200).send({ success: true, result });
    }
  );

  // Comparative Request/Response Benchmark Endpoint
  app.post('/api/benchmarks/run', async (request, reply) => {
    try {
      const parsedConfig = ReqResBenchmarkSchema.parse(request.body);
      const report = await benchmarkRunner.runScenario(parsedConfig);
      return reply.status(200).send(report);
    } catch (err: any) {
      return reply.status(400).send({
        error: 'Invalid benchmark configuration',
        details: err.errors || err.message,
      });
    }
  });

  // Protocol Trace Endpoint (for visual packet flow diagrams)
  app.post<{ Body: { protocolId: string; scenario: Scenario } }>(
    '/api/benchmarks/trace',
    async (request, reply) => {
      const { protocolId, scenario } = request.body || {};
      const plugin = registry.get(protocolId);

      if (!plugin) {
        return reply.status(404).send({ error: `Protocol "${protocolId}" not found.` });
      }

      const traces = await plugin.trace(scenario);
      return reply.status(200).send({ success: true, traces });
    }
  );

  // Real-Time WebSocket Telemetry Stream
  app.register(async function (fastify) {
    fastify.get('/ws', { websocket: true }, (socket, _req) => {
      socket.send(
        JSON.stringify({
          type: 'CONNECTED',
          message: 'Nexus Telemetry WebSocket Stream Active',
          timestamp: new Date().toISOString(),
        })
      );

      const interval = setInterval(() => {
        socket.send(
          JSON.stringify({
            type: 'TELEMETRY_HEARTBEAT',
            memoryUsageBytes: process.memoryUsage().heapUsed,
            uptimeSeconds: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
          })
        );
      }, 2000);

      socket.on('close', () => {
        clearInterval(interval);
      });
    });
  });

  return app;
}
