import { describe, expect, it } from 'vitest'
import {
    buildSessionCursorPickerState,
    isCursorEffortWireInCatalog,
    resolveSessionCursorBaseSelectValue,
    resolveSessionCursorModelChange
} from '@/lib/sessionChatCursorModel'

const sessionModels = [
    { modelId: 'composer-2.5[fast=true]', name: 'Composer 2.5' },
    { modelId: 'composer-2.5[fast=false]', name: 'Composer 2.5' }
] as const

describe('resolveSessionCursorModelChange', () => {
    const picker = buildSessionCursorPickerState({
        sessionModels,
        machineModels: [],
        sessionModel: 'composer-2.5[fast=true]',
        sessionCurrentModelId: 'composer-2.5[fast=true]'
    })

    it('maps base change to a wire id and updates selected base', () => {
        const plan = resolveSessionCursorModelChange({
            picker,
            sessionModel: 'composer-2.5[fast=true]',
            cursorSelectedBase: 'composer-2.5',
            kind: 'base',
            value: 'composer-2.5'
        })
        expect(plan).toEqual({
            ok: true,
            wireId: 'composer-2.5[fast=true]',
            nextSelectedBase: 'composer-2.5'
        })
    })

    it('accepts effort wire ids without matching stale session baseKey', () => {
        const plan = resolveSessionCursorModelChange({
            picker,
            sessionModel: 'composer-2.5[fast=true]',
            cursorSelectedBase: 'composer-2.5',
            kind: 'effort',
            value: 'composer-2.5[fast=false]'
        })
        expect(plan).toEqual({
            ok: true,
            wireId: 'composer-2.5[fast=false]',
            nextSelectedBase: 'composer-2.5'
        })
    })

    it('rejects effort wire ids missing from catalog', () => {
        const plan = resolveSessionCursorModelChange({
            picker,
            sessionModel: 'composer-2.5[fast=true]',
            cursorSelectedBase: 'composer-2.5',
            kind: 'effort',
            value: 'claude-opus-4-8[effort=high]'
        })
        expect(plan).toEqual({ ok: false, reason: 'effort wire id not in catalog' })
    })

    it('uses explicit selected base for dual-mode model row highlight', () => {
        expect(
            resolveSessionCursorBaseSelectValue(picker, 'composer-2.5')
        ).toBe('composer-2.5')
        expect(
            resolveSessionCursorBaseSelectValue(picker, 'auto')
        ).toBe('composer-2.5')
    })
})

describe('isCursorEffortWireInCatalog', () => {
    it('checks wireToBase membership', () => {
        const picker = buildSessionCursorPickerState({
            sessionModels,
            machineModels: [],
            sessionModel: null,
            sessionCurrentModelId: null
        })
        expect(isCursorEffortWireInCatalog('composer-2.5[fast=false]', picker.catalog)).toBe(true)
        expect(isCursorEffortWireInCatalog('unknown[fast=true]', picker.catalog)).toBe(false)
    })
})
