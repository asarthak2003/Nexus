import { IProtocolPlugin, ProtocolMeta } from '@nexus/protocol-core';
import { EchoPlugin } from '@nexus/protocol-core';

/**
 * In-memory registry that stores and manages all active protocol plugins.
 */
export class PluginRegistry {
  private plugins = new Map<string, IProtocolPlugin>();

  constructor() {
    this.register(new EchoPlugin());
  }

  /**
   * Register a new protocol plugin into the orchestrator
   */
  register(plugin: IProtocolPlugin): void {
    if (this.plugins.has(plugin.meta.id)) {
      throw new Error(`Protocol plugin with ID "${plugin.meta.id}" is already registered.`);
    }
    this.plugins.set(plugin.meta.id, plugin);
  }

  get(id: string): IProtocolPlugin | undefined {
    return this.plugins.get(id);
  }

  // List all registered protocol plugins metadata
  listAllMeta(): ProtocolMeta[] {
    return Array.from(this.plugins.values()).map((p) => p.meta);
  }
}

export const registry = new PluginRegistry();