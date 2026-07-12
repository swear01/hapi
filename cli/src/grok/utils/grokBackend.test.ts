import { describe, expect, it } from 'vitest'
import { buildGrokAgentArgs } from './grokBackend'

describe('buildGrokAgentArgs', () => {
    it('starts the official Grok ACP stdio agent', () => {
        expect(buildGrokAgentArgs({})).toEqual(['agent', 'stdio'])
    })

    it('places agent options before the stdio subcommand', () => {
        expect(buildGrokAgentArgs({
            model: 'grok-4.5',
            effort: 'low'
        })).toEqual([
            'agent',
            '--model', 'grok-4.5',
            '--reasoning-effort', 'low',
            'stdio'
        ])
    })
})
