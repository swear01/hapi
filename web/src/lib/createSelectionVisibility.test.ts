import { beforeEach, describe, expect, it } from 'vitest'
import { loadCreateSelectionVisibility, saveCreateSelectionVisibility } from './createSelectionVisibility'

describe('Create selection visibility preferences', () => {
    beforeEach(() => {
        localStorage.clear()
    })

    it('defaults new selections to visible and restores saved values', () => {
        expect(loadCreateSelectionVisibility()).toEqual({
            machine: true,
            sessionType: true,
            agent: true,
            model: true,
            effort: true,
            reasoningEffort: true,
            grokPermissionMode: true,
            codexFamilyPermissionMode: true,
            collaborationMode: true,
            copilotAgentMode: true,
            fastMode: true,
            yolo: true
        })

        saveCreateSelectionVisibility({
            ...loadCreateSelectionVisibility(),
            model: false,
            fastMode: false
        })
        expect(loadCreateSelectionVisibility().model).toBe(false)
        expect(loadCreateSelectionVisibility().fastMode).toBe(false)

        localStorage.setItem(
            'hapi:newSession:selectionVisibility:v1',
            JSON.stringify({ model: false, unknown: false })
        )
        expect(loadCreateSelectionVisibility().fastMode).toBe(true)
    })
})
