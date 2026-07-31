import { describe, expect, it } from 'bun:test'
import { selectForkTranscriptPrefix } from './forkTranscript'

describe('selectForkTranscriptPrefix', () => {
    const messages = [
        { localId: 'a', text: '1' },
        { localId: null, text: '2' },
        { localId: 'b', text: '3' },
        { localId: null, text: '4' }
    ]

    it('copies the full transcript for current fork', () => {
        expect(selectForkTranscriptPrefix(messages)).toEqual(messages)
    })

    it('excludes the boundary message and later turns for historical fork', () => {
        expect(selectForkTranscriptPrefix(messages, 'b')).toEqual([
            { localId: 'a', text: '1' },
            { localId: null, text: '2' }
        ])
    })

    it('throws when the boundary localId is missing', () => {
        expect(() => selectForkTranscriptPrefix(messages, 'missing')).toThrow(
            'Fork boundary message not found'
        )
    })
})
