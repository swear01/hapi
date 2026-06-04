import { describe, expect, it } from 'vitest'
import {
    buildNewSessionCursorEffortOptions,
    buildNewSessionCursorModelCatalog,
    buildNewSessionCursorModelOptions,
    buildNewSessionCursorPickerState,
    isCursorEffortWireAllowed,
    pickCursorModelsForPicker,
    resolveNewSessionCursorBaseSelectValue,
    resolveNewSessionCursorEffortSelectValue,
    resolveWireIdForBaseChange,
    shouldShowCursorModelsUnavailable,
    shouldShowNewSessionCursorVariantPicker
} from './newSessionCursorModels'

const acpModels = [
    { modelId: 'composer-2.5[fast=true]', name: 'composer-2.5' },
    { modelId: 'composer-2.5[fast=false]', name: 'composer-2.5' },
] as const

describe('shouldShowCursorModelsUnavailable', () => {
    it('shows hint when cursor agent has no models and is not loading', () => {
        expect(shouldShowCursorModelsUnavailable({
            agent: 'cursor',
            isLoading: false,
            error: null,
            availableModels: []
        })).toBe(true)
    })

    it('hides hint while loading or on error', () => {
        expect(shouldShowCursorModelsUnavailable({
            agent: 'cursor',
            isLoading: true,
            error: null,
            availableModels: []
        })).toBe(false)
        expect(shouldShowCursorModelsUnavailable({
            agent: 'cursor',
            isLoading: false,
            error: 'boom',
            availableModels: []
        })).toBe(false)
    })

    it('hides hint for non-cursor agents', () => {
        expect(shouldShowCursorModelsUnavailable({
            agent: 'claude',
            isLoading: false,
            error: null,
            availableModels: []
        })).toBe(false)
    })
})

describe('pickCursorModelsForPicker', () => {
    it('prefers ACP wire ids when both ACP and CLI skus are present', () => {
        const mixed = [
            { modelId: 'composer-2.5-fast', name: 'Composer 2.5 Fast' },
            { modelId: 'composer-2.5[fast=true]', name: 'composer-2.5' },
        ]
        expect(pickCursorModelsForPicker(mixed)).toEqual([
            { modelId: 'composer-2.5[fast=true]', name: 'composer-2.5' },
        ])
    })
})

describe('shouldShowNewSessionCursorVariantPicker', () => {
    it('shows variant picker only when a base has multiple wire ids', () => {
        const picker = buildNewSessionCursorPickerState([...acpModels], 'composer-2.5[fast=true]')
        expect(shouldShowNewSessionCursorVariantPicker(picker)).toBe(true)
    })

    it('hides variant picker when each base has a single wire id (live Cursor ACP)', () => {
        const picker = buildNewSessionCursorPickerState([
            { modelId: 'claude-opus-4-7[thinking=true,context=300k,effort=xhigh,fast=false]', name: 'Claude Opus 4.7' },
        ], 'auto')
        expect(picker.mode).toBe('flat')
        expect(shouldShowNewSessionCursorVariantPicker(picker)).toBe(false)
    })
})

describe('flat vs dual cursor model pickers', () => {
    it('uses a flat model-name list when each base has only one variant', () => {
        const picker = buildNewSessionCursorPickerState([
            { modelId: 'claude-opus-4-7[thinking=true,context=300k,effort=xhigh,fast=false]', name: 'Claude Opus 4.7' },
            { modelId: 'composer-2.5[fast=true]', name: 'Composer 2.5' },
        ], 'auto')
        const options = buildNewSessionCursorModelOptions(picker)
        expect(picker.mode).toBe('flat')
        expect(options).toContainEqual({
            value: 'claude-opus-4-7[thinking=true,context=300k,effort=xhigh,fast=false]',
            label: 'Claude Opus 4.7'
        })
        expect(options.find((entry) => entry.label.includes('Effort'))).toBeUndefined()
    })

    it('uses dual pickers when one base has multiple wire ids', () => {
        const picker = buildNewSessionCursorPickerState([...acpModels], 'auto')
        expect(picker.mode).toBe('dual')
        expect(buildNewSessionCursorModelOptions(picker)).toEqual([
            { value: 'auto', label: 'Default' },
            { value: 'composer-2.5', label: 'composer-2.5' },
        ])
    })
})

describe('new session cursor select values', () => {
    it('uses explicit base state in dual mode instead of derived baseKey', () => {
        const picker = buildNewSessionCursorPickerState([...acpModels], 'composer-2.5[fast=true]')
        expect(resolveNewSessionCursorBaseSelectValue(picker, 'composer-2.5')).toBe('composer-2.5')
        expect(resolveNewSessionCursorBaseSelectValue(picker, 'auto')).toBe('composer-2.5')
    })

    it('keeps effort select value on wire id after catalog reload', () => {
        const picker = buildNewSessionCursorPickerState([...acpModels], 'composer-2.5[fast=false]')
        expect(
            resolveNewSessionCursorEffortSelectValue('composer-2.5[fast=false]', picker.effortOptions)
        ).toBe('composer-2.5[fast=false]')
    })

    it('rejects effort wire ids outside the selected base', () => {
        const catalog = buildNewSessionCursorModelCatalog([...acpModels], 'composer-2.5[fast=true]')
        expect(
            isCursorEffortWireAllowed('composer-2.5[fast=false]', catalog, 'composer-2.5')
        ).toBe(true)
        expect(
            isCursorEffortWireAllowed('claude-opus-4-8[effort=high]', catalog, 'composer-2.5')
        ).toBe(false)
    })
})

describe('new session cursor model options', () => {
    it('maps base options with auto default and effort variants', () => {
        const picker = buildNewSessionCursorPickerState([...acpModels], 'composer-2.5[fast=true]')
        expect(buildNewSessionCursorModelOptions(picker)).toEqual([
            { value: 'auto', label: 'Default' },
            { value: 'composer-2.5', label: 'composer-2.5' },
        ])
        expect(buildNewSessionCursorEffortOptions(picker)).toHaveLength(2)
        const catalog = buildNewSessionCursorModelCatalog([...acpModels], 'auto')
        expect(resolveWireIdForBaseChange('composer-2.5', catalog)).toBe('composer-2.5[fast=true]')
    })

    it('keeps current wire id when changing back to the same base', () => {
        const catalog = buildNewSessionCursorModelCatalog([...acpModels], 'auto')
        expect(
            resolveWireIdForBaseChange(
                'composer-2.5',
                catalog,
                'composer-2.5[fast=false]'
            )
        ).toBe('composer-2.5[fast=false]')
    })

    it('returns auto wire id when base is reset to default', () => {
        const catalog = buildNewSessionCursorModelCatalog([...acpModels], 'auto')
        expect(resolveWireIdForBaseChange('auto', catalog)).toBe('auto')
        expect(buildNewSessionCursorEffortOptions(
            buildNewSessionCursorPickerState([...acpModels], 'auto')
        )).toEqual([])
    })

    it('labels effort rows with only the differing param (context)', () => {
        const picker = buildNewSessionCursorPickerState([
            { modelId: 'claude-opus-4-8[context=200k]', name: 'Claude Opus 4.8' },
            { modelId: 'claude-opus-4-8[context=300k]', name: 'Claude Opus 4.8' },
        ], 'claude-opus-4-8[context=200k]')
        const effortOptions = buildNewSessionCursorEffortOptions(picker)
        expect(effortOptions.map((entry) => entry.label)).toEqual(['200k', '300k'])
        expect(effortOptions.every((entry) => !entry.label.includes('Default'))).toBe(true)
    })

    it('labels composer effort rows as Fast vs Standard', () => {
        const picker = buildNewSessionCursorPickerState([...acpModels], 'composer-2.5[fast=true]')
        expect(buildNewSessionCursorEffortOptions(picker).map((entry) => entry.label)).toEqual([
            'Fast',
            'Standard',
        ])
        expect(
            buildNewSessionCursorEffortOptions(picker)
                .every((entry) => !entry.label.includes('composer-2.5'))
        ).toBe(true)
    })
})
