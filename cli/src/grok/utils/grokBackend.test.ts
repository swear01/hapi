import { describe, expect, it } from 'vitest'
import { buildGrokAgentArgs, formatGrokError } from './grokBackend'

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

describe('formatGrokError', () => {
    it('turns ACP auth failures into an actionable login hint', () => {
        expect(formatGrokError(new Error('Authentication required: no auth method id provided')))
            .toContain('grok login --device-auth')
    })

    it('preserves unrelated Grok errors', () => {
        expect(formatGrokError(new Error('Payment Required'))).toBe('Payment Required')
    })
})
