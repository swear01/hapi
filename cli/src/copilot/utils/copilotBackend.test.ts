import { describe, expect, test } from 'vitest';
import { createCopilotBackend } from './copilotBackend';

describe('createCopilotBackend', () => {
    test('creates an ACP backend for copilot --acp --stdio', () => {
        const backend = createCopilotBackend();
        expect(backend).toBeDefined();
    });
});
