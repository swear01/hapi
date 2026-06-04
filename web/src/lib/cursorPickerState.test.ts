import { describe, expect, it } from 'vitest'
import {
    buildCursorCatalogFromSources,
    buildCursorPickerState,
    mergeCursorModelSummaries,
    resolveWireIdForBaseChange
} from '@/lib/cursorPickerState'

describe('mergeCursorModelSummaries', () => {
    it('prefers session wire rows and fills names from machine list', () => {
        const merged = mergeCursorModelSummaries(
            [{ modelId: 'composer-2.5[fast=false]', name: 'Composer 2.5' }],
            [
                { modelId: 'composer-2.5[fast=true]', name: 'Composer 2.5 Fast' },
                { modelId: 'composer-2.5[fast=false]', name: 'raw-id' }
            ]
        )
        expect(merged).toHaveLength(2)
        const slow = merged.find((entry) => entry.modelId === 'composer-2.5[fast=false]')
        expect(slow?.name).toBe('Composer 2.5')
    })

    it('injects current wire when missing from both lists', () => {
        const merged = mergeCursorModelSummaries([], [], 'claude-opus-4-8[effort=high,fast=false]')
        expect(merged).toEqual([
            { modelId: 'claude-opus-4-8[effort=high,fast=false]' }
        ])
    })
})

describe('buildCursorPickerState', () => {
    const dualModels = [
        { modelId: 'composer-2.5[fast=true]', name: 'Composer 2.5' },
        { modelId: 'composer-2.5[fast=false]', name: 'Composer 2.5' }
    ] as const

    it('uses dual mode with effort-only labels for current base', () => {
        const catalog = buildCursorCatalogFromSources({
            sessionModels: dualModels,
            machineModels: [],
            currentWireId: 'composer-2.5[fast=false]',
            defaultValue: 'auto'
        })
        const picker = buildCursorPickerState({
            catalog,
            currentWireId: 'composer-2.5[fast=false]',
            defaultValue: 'auto'
        })
        expect(picker.mode).toBe('dual')
        expect(picker.showEffortPicker).toBe(true)
        expect(picker.effortOptions.map((row) => row.label)).toEqual(['Fast', 'Standard'])
        expect(picker.effortOptions.every((row) => !row.label.includes('Composer'))).toBe(true)
    })

    it('shows effort picker for current base when only that base has variants', () => {
        const catalog = buildCursorCatalogFromSources({
            sessionModels: [
                { modelId: 'claude-opus-4-7[thinking=true,context=300k,effort=xhigh,fast=false]', name: 'Claude Opus 4.7' },
                ...dualModels
            ],
            defaultValue: null
        })
        const picker = buildCursorPickerState({
            catalog,
            currentWireId: 'composer-2.5[fast=true]',
            defaultValue: null
        })
        expect(picker.showEffortPicker).toBe(true)
        expect(picker.baseKey).toBe('composer-2.5')
    })
})

describe('resolveWireIdForBaseChange', () => {
    it('preserves effort tier when switching to another base with matching params', () => {
        const catalog = buildCursorCatalogFromSources({
            sessionModels: [
                { modelId: 'claude-opus-4-8[thinking=true,context=300k,effort=high,fast=false]', name: 'Opus 4.8' },
                { modelId: 'claude-opus-4-8[thinking=true,context=300k,effort=low,fast=false]', name: 'Opus 4.8' },
                { modelId: 'claude-opus-4-7[thinking=true,context=300k,effort=high,fast=false]', name: 'Opus 4.7' },
                { modelId: 'claude-opus-4-7[thinking=true,context=300k,effort=low,fast=false]', name: 'Opus 4.7' }
            ]
        })
        const wire = resolveWireIdForBaseChange(
            'claude-opus-4-7',
            catalog,
            'claude-opus-4-8[thinking=true,context=300k,effort=high,fast=false]'
        )
        expect(wire).toBe('claude-opus-4-7[thinking=true,context=300k,effort=high,fast=false]')
    })
})
