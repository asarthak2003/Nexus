import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import websocket from '@fastify/websocket';
import { registry } from './registry';
import { Scenario } from '@nexus/protocol-core';

export async function createServer(): Promise<FastifyInstance> {
    const app = Fastify({
        logger: true,
    });

    //Enable CORS
    await app.register(cors, {
        origin: '*',
    });

    // Enable WebSocket support
    await app.register(websocket);

    // Health check route
    app.get('/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    // List all registered protocol plugins
    app.get('/api/plugins', async () => {
        return {
            count: registry.listAllMeta().length,
            plugins: registry.listAllMeta(),
        };
    });

    // Run benchmark scenario against a protocol
    app.post<{ Body: { protocolId: string; scenario: Scenario } }>(
        '/api/benchmarks/run',
        async (request, reply) => {
            const { protocolId, scenario } = request.body;
            const plugin = registry.get(protocolId);

            if (!plugin) {
                return reply.status(404).send({ error: `Protocol "${protocolId}" not found.` });
            }

            const result = await plugin.runScenario(scenario);
            return { success: true, result };
        }
    );

    // Get trace frames for animated flow diagrams
    app.post<{ Body: { protocolId: string; scenario: Scenario } }>(
        '/api/benchmarks/trace',
        async (request, reply) => {
            const { protocolId, scenario } = request.body;
            const plugin = registry.get(protocolId);

            if (!plugin) {
                return reply.status(404).send({ error: `Protocol "${protocolId}" not found.` });
            }

            const traces = await plugin.trace(scenario);
            return { success: true, traces };
        }
    );

    // WebSocket endpoint for streaming live events to dashboard
    app.get('/ws', { websocket: true }, (connection: any) => {
        const socket = connection?.socket || connection;
        socket.send(
            JSON.stringify({ type: 'CONNECTED', message: 'Nexus Live Telemetry Stream Connected' })
        );

        socket.on('message', (message: any) => {
            socket.send(JSON.stringify({ type: 'ACK', received: message.toString() }));
        });
    });

    return app;
}
