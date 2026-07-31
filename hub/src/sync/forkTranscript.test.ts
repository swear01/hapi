import { describe, expect, it } from 'bun:test'
import { selectForkTranscriptPrefix } from './forkTranscript'

describe('selectForkTranscriptPrefix', () => {
    const messages = [
        { localId: 'a', text: '1', invokedAt: 1 },
        { localId: null, text: '2', invokedAt: 2 },
        { localId: 'b', text: '3', invokedAt: 3 },
        { localId: null, text: '4', invokedAt: 4 },
        { localId: 'pending', text: 'scheduled', invokedAt: null }
    ]

    it('copies the full invoked transcript for current fork', () => {
        expect(selectForkTranscriptPrefix(messages)).toEqual([
            { localId: 'a', text: '1', invokedAt: 1 },
            { localId: null, text: '2', invokedAt: 2 },
            { localId: 'b', text: '3', invokedAt: 3 },
            { localId: null, text: '4', invokedAt: 4 }
        ])
    })

    it('excludes the boundary message and later turns for historical fork', () => {
        expect(selectForkTranscriptPrefix(messages, 'b')).toEqual([
            { localId: 'a', text: '1', invokedAt: 1 },
            { localId: null, text: '2', invokedAt: 2 }
        ])
    })

    it('never copies pending scheduled rows', () => {
        expect(selectForkTranscriptPrefix(messages).some((message) => message.localId === 'pending')).toBe(false)
        expect(selectForkTranscriptPrefix(messages, 'pending')).toEqual([
            { localId: 'a', text: '1', invokedAt: 1 },
            { localId: null, text: '2', invokedAt: 2 },
            { localId: 'b', text: '3', invokedAt: 3 },
            { localId: null, text: '4', invokedAt: 4 }
        ])
    })

    it('throws when the boundary localId is missing', () => {
        expect(() => selectForkTranscriptPrefix(messages, 'missing')).toThrow(
            'Fork boundary message not found'
        )
    })
})
