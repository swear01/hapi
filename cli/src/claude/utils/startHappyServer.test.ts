import { afterEach, describe, expect, it, vi } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import type { ApiSessionClient } from '@/api/apiSession';
import { startHappyServer } from './startHappyServer';

describe('startHappyServer', () => {
    const stops: Array<() => void> = [];
    const clients: Client[] = [];

    afterEach(async () => {
        await Promise.all(clients.splice(0).map((client) => client.close()));
        stops.splice(0).forEach((stop) => stop());
    });

    it('does not expose change_title when native ACP titles are enabled', async () => {
        const sessionClient = {
            updateMetadata: vi.fn(),
            sendClaudeSessionMessage: vi.fn(),
            sendAgentMessage: vi.fn()
        } as unknown as ApiSessionClient;
        const server = await startHappyServer(sessionClient, { enableChangeTitle: false });
        stops.push(server.stop);
        const client = new Client({ name: 'hapi-test', version: '1.0.0' });
        clients.push(client);

        await client.connect(new StreamableHTTPClientTransport(new URL(server.url)));
        const tools = await client.listTools();

        expect(server.toolNames).toEqual(['display_image']);
        expect(tools.tools.map((tool) => tool.name)).toEqual(['display_image']);
    });
});
