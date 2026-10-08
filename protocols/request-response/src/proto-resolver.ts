import fs from 'fs';
import path from 'path';

/**
 * Robustly resolves the path to echo.proto across local development (tsx),
 * compiled output (dist), and monorepo workspace roots.
 */
export function resolveEchoProtoPath(): string {
  const candidates = [
    path.resolve(__dirname, 'proto/echo.proto'),
    path.resolve(__dirname, '../proto/echo.proto'),
    path.resolve(__dirname, '../src/proto/echo.proto'),
    path.resolve(__dirname, '../../src/proto/echo.proto'),
    path.resolve(__dirname, '../../../protocols/request-response/src/proto/echo.proto'),
    path.resolve(process.cwd(), 'protocols/request-response/src/proto/echo.proto'),
    path.resolve(process.cwd(), 'src/proto/echo.proto'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(`Could not resolve echo.proto in candidates: ${candidates.join(', ')}`);
}
