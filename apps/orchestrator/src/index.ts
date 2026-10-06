import dotenv from 'dotenv';
import { createServer } from './server';

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || '0.0.0.0';

async function main() {
  const server = await createServer();

  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`🚀 Nexus Orchestrator is running on http://localhost:${PORT}`);
    console.log(`🔌 Registered Plugins: ${server.printRoutes()}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
