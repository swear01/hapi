import { describe, expect, it } from 'vitest'
import { normalizeCliArgs } from './cliArgs'

describe('normalizeCliArgs', () => {
    it.each([
        [['bun', 'src/index.ts', '--', 'auth', 'login'], ['auth', 'login']],
        [['bun', 'src/index.ts', 'codex', '--', '--model', 'o3'], ['codex', '--model', 'o3']],
        [[process.execPath, '--', 'auth', 'login'], ['auth', 'login']],
        [[process.execPath, 'codex', '--', '--model', 'o3'], ['codex', '--model', 'o3']],
    ])('preserves the HAPI command while stripping runtime separators: %j', (argv, expected) => {
        expect(normalizeCliArgs(argv)).toEqual(expected)
    })
})
