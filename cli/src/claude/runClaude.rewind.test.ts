import { describe, expect, it, vi } from 'vitest'
import { pruneDroppedRewindMappings, waitForRewindAck } from './runClaude'

describe('Claude rewind helpers', () => {
    it('clears the acknowledgement timeout when confirmation arrives first', async () => {
        vi.useFakeTimers()
        try {
            await expect(waitForRewindAck(
                Promise.resolve({ applied: true }),
                60_000
            )).resolves.toEqual({ applied: true })
            expect(vi.getTimerCount()).toBe(0)
        } finally {
            vi.useRealTimers()
        }
    })

    it('removes both directions of mappings for truncated turns', () => {
        const promptUuidByLocalId = new Map([
            ['local-kept', 'prompt-kept'],
            ['local-drop-a', 'prompt-drop'],
            ['local-drop-b', 'prompt-drop'],
            ['local-later', 'prompt-later'],
            ['local-missing', 'prompt-missing']
        ])
        const localIdsByPromptUuid = new Map([
            ['prompt-kept', ['local-kept']],
            ['prompt-drop', ['local-drop-a', 'local-drop-b']],
            ['prompt-later', ['local-later']],
            ['prompt-missing', ['local-missing']]
        ])

        pruneDroppedRewindMappings(
            promptUuidByLocalId,
            localIdsByPromptUuid,
            [
                { promptUuid: 'prompt-kept' },
                { promptUuid: 'prompt-drop' },
                { promptUuid: 'prompt-later' }
            ],
            'prompt-drop'
        )

        expect([...promptUuidByLocalId]).toEqual([['local-kept', 'prompt-kept']])
        expect([...localIdsByPromptUuid]).toEqual([['prompt-kept', ['local-kept']]])
    })
})
