import { describe, expect, it } from 'vitest'
import {
    buildCursorEffortPickerOptions,
    buildCursorModelCatalog,
    buildFlatCursorModelPickerOptions,
    cursorCatalogHasMultiVariantBases,
    shouldUseCursorDualPickers,
    cursorEffortPickerLabel,
    cursorEffortPickerSortKey,
    cursorModelBaseId,
    cursorVariantDisambiguationSuffix,
    cursorVariantLabel,
    cursorVaryingWireParamKeys,
    formatCursorModelPickerLabel,
    parseCursorWireParams,
    resolveCursorBaseKey,
    resolveCursorVariantOptions
} from './cursorModelOptions'

describe('cursorVariantLabel', () => {
    it('formats fast and effort hints', () => {
        expect(cursorVariantLabel('composer-2.5[fast=true]')).toBe('Fast')
        expect(
            cursorVariantLabel('claude-opus-4-8[thinking=true,context=300k,effort=high,fast=false]')
        ).toBe('Standard · Thinking · Effort high · Context 300k')
    })

    it('includes context so context-only wires are not labeled Default', () => {
        expect(cursorVariantLabel('claude-opus-4-8[context=200k]')).toBe('Context 200k')
        expect(cursorVariantLabel('claude-opus-4-8[context=300k]')).toBe('Context 300k')
    })
})

describe('buildCursorModelCatalog', () => {
    const acpModels = [
        { modelId: 'default[]', name: 'Auto' },
        { modelId: 'composer-2.5[fast=true]', name: 'composer-2.5' },
        { modelId: 'composer-2.5[fast=false]', name: 'composer-2.5' },
        { modelId: 'claude-opus-4-8[thinking=true,context=300k,effort=high,fast=false]', name: 'claude-opus-4-8' },
        { modelId: 'claude-opus-4-8[thinking=true,context=300k,effort=low,fast=false]', name: 'claude-opus-4-8' },
    ] as const

    it('groups variants under one base model sorted by name', () => {
        const catalog = buildCursorModelCatalog([...acpModels])
        expect(catalog.baseOptions.map((o) => o.label)).toEqual([
            'Default',
            'claude-opus-4-8',
            'composer-2.5',
        ])
        const composerVariants = resolveCursorVariantOptions('composer-2.5', catalog)
        expect(composerVariants.map((v) => v.label)).toEqual(['Fast', 'Standard'])
    })

    it('resolves current wire to base and variant list', () => {
        const catalog = buildCursorModelCatalog([...acpModels], {
            currentModel: 'composer-2.5[fast=true]',
        })
        expect(resolveCursorBaseKey('composer-2.5[fast=true]', catalog)).toBe('composer-2.5')
        expect(resolveCursorVariantOptions('composer-2.5', catalog)).toHaveLength(2)
    })

    it('exposes only one variant when the base model has no effort choices', () => {
        const catalog = buildCursorModelCatalog([
            { modelId: 'gpt-5.5[context=272k,reasoning=medium,fast=false]', name: 'gpt-5.5' },
        ])
        expect(resolveCursorVariantOptions('gpt-5.5', catalog)).toHaveLength(1)
    })

    it('merges CLI sku and ACP wire id under the same base', () => {
        const catalog = buildCursorModelCatalog([
            { modelId: 'composer-2.5-fast', name: 'Composer 2.5 Fast' },
            { modelId: 'composer-2.5[fast=true]', name: 'composer-2.5' },
            { modelId: 'composer-2.5[fast=false]', name: 'composer-2.5' },
        ])
        expect(catalog.baseOptions.map((o) => o.label)).toEqual(['Default', 'Composer 2.5 Fast'])
        expect(catalog.baseOptions.map((o) => o.value)).toEqual([null, 'composer-2.5'])
        const variants = resolveCursorVariantOptions('composer-2.5', catalog)
        expect(variants).toHaveLength(3)
        expect(variants.map((v) => v.wireId)).toEqual([
            'composer-2.5[fast=true]',
            'composer-2.5[fast=false]',
            'composer-2.5-fast',
        ])
    })
})

describe('parseCursorWireParams', () => {
    it('parses comma-separated wire parameters', () => {
        expect(
            parseCursorWireParams('claude-opus-4-8[thinking=true,context=300k,effort=high,fast=false]')
        ).toEqual({
            thinking: 'true',
            context: '300k',
            effort: 'high',
            fast: 'false',
        })
    })
})

describe('formatCursorModelPickerLabel', () => {
    it('combines base name and variant', () => {
        expect(formatCursorModelPickerLabel('composer-2.5[fast=true]', 'composer-2.5')).toBe(
            'composer-2.5 · Fast'
        )
    })
})

describe('cursorModelBaseId', () => {
    it('strips ACP wire suffix', () => {
        expect(cursorModelBaseId('composer-2.5[fast=true]')).toBe('composer-2.5')
    })
})

describe('buildFlatCursorModelPickerOptions', () => {
    it('lists one row per wire variant (base label only when sole variant)', () => {
        const catalog = buildCursorModelCatalog([
            { modelId: 'claude-opus-4-7[thinking=true,context=300k,effort=xhigh,fast=false]', name: 'Claude Opus 4.7' },
            { modelId: 'composer-2.5[fast=true]', name: 'Composer 2.5' },
        ], { defaultValue: 'auto' })
        expect(cursorCatalogHasMultiVariantBases(catalog)).toBe(false)
        const options = buildFlatCursorModelPickerOptions(catalog, { defaultValue: 'auto' })
        expect(options[0]).toEqual({ value: 'auto', label: 'Default' })
        expect(options).toContainEqual({
            value: 'claude-opus-4-7[thinking=true,context=300k,effort=xhigh,fast=false]',
            label: 'Claude Opus 4.7'
        })
        expect(options).toContainEqual({
            value: 'composer-2.5[fast=true]',
            label: 'Composer 2.5'
        })
    })

    it('lists every wire id when a base has multiple variants', () => {
        const catalog = buildCursorModelCatalog([
            { modelId: 'composer-2.5[fast=true]', name: 'Composer 2.5' },
            { modelId: 'composer-2.5[fast=false]', name: 'Composer 2.5' },
        ], { defaultValue: 'auto' })
        const options = buildFlatCursorModelPickerOptions(catalog, { defaultValue: 'auto' })
        expect(options).toContainEqual({
            value: 'composer-2.5[fast=true]',
            label: 'Fast'
        })
        expect(options).toContainEqual({
            value: 'composer-2.5[fast=false]',
            label: 'Standard'
        })
        expect(options.every((row) => row.label === 'Default' || !row.label.includes('Composer'))).toBe(true)
    })

    it('uses effort-only labels for opus variants in flat mode', () => {
        const catalog = buildCursorModelCatalog([
            { modelId: 'claude-opus-4-8[thinking=true,context=300k,effort=high,fast=false]', name: 'Claude Opus 4.8' },
            { modelId: 'claude-opus-4-8[thinking=true,context=300k,effort=low,fast=false]', name: 'Claude Opus 4.8' },
        ], { defaultValue: 'auto' })
        const options = buildFlatCursorModelPickerOptions(catalog, { defaultValue: 'auto' })
        expect(options.map((row) => row.label)).toEqual(
            expect.arrayContaining(['Low', 'High'])
        )
        expect(options.every((row) => !row.label.includes('Claude Opus'))).toBe(true)
    })
})

describe('shouldUseCursorDualPickers', () => {
    it('enables dual pickers for the active base even when other bases are single-variant', () => {
        const catalog = buildCursorModelCatalog([
            { modelId: 'claude-opus-4-7[thinking=true,context=300k,effort=xhigh,fast=false]', name: 'Claude Opus 4.7' },
            { modelId: 'composer-2.5[fast=true]', name: 'Composer 2.5' },
            { modelId: 'composer-2.5[fast=false]', name: 'Composer 2.5' },
        ], { defaultValue: 'auto' })
        expect(cursorCatalogHasMultiVariantBases(catalog)).toBe(true)
        expect(shouldUseCursorDualPickers(catalog, 'composer-2.5[fast=false]')).toBe(true)
    })
})

describe('variant picker coverage', () => {
    it('exposes multiple effort rows for one base when the snapshot lists every wire id', () => {
        const catalog = buildCursorModelCatalog([
            { modelId: 'claude-opus-4-8[thinking=true,context=300k,effort=high,fast=false]', name: 'Claude Opus 4.8' },
            { modelId: 'claude-opus-4-8[thinking=true,context=300k,effort=low,fast=false]', name: 'Claude Opus 4.8' },
        ], { defaultValue: 'auto' });
        const variants = resolveCursorVariantOptions('claude-opus-4-8', catalog);
        expect(variants.length).toBeGreaterThanOrEqual(2);
        const labels = variants.map((entry) => entry.label);
        expect(labels.some((label) => label.includes('Effort high'))).toBe(true);
        expect(labels.some((label) => label.includes('Effort low'))).toBe(true);
    });
});

describe('base model labels', () => {
    it('keeps human display names instead of raw ids', () => {
        const catalog = buildCursorModelCatalog([
            { modelId: 'claude-4-7[effort=high,fast=false]', name: 'Claude 4.7' },
            { modelId: 'claude-4-7[effort=low,fast=false]', name: 'claude-4-7' },
        ])
        const claude = catalog.baseOptions.find((entry) => entry.value === 'claude-4-7')
        expect(claude?.label).toBe('Claude 4.7')
        expect(resolveCursorVariantOptions('claude-4-7', catalog)).toHaveLength(2)
    })
})

describe('variant label disambiguation', () => {
    it('catalog variant labels may include context for internal dedupe', () => {
        const catalog = buildCursorModelCatalog([
            { modelId: 'claude-opus-4-8[context=200k]', name: 'Claude Opus 4.8' },
            { modelId: 'claude-opus-4-8[context=300k]', name: 'Claude Opus 4.8' },
        ])
        const labels = resolveCursorVariantOptions('claude-opus-4-8', catalog).map((entry) => entry.label)
        expect(labels).toEqual(['Context 200k', 'Context 300k'])
    })

    it('suffixes colliding labels with wire params', () => {
        expect(cursorVariantDisambiguationSuffix('claude-opus-4-8[effort=high,fast=false]')).toBe(
            'effort=high, standard'
        )
    })
})

describe('cursor base labels from API', () => {
    it('uses Cursor-provided name as-is without regex rewriting', () => {
        const catalog = buildCursorModelCatalog([
            { modelId: 'gpt-5.3-codex[reasoning=medium,fast=false]', name: 'Codex 5.3' },
        ], { defaultValue: 'auto' })
        expect(catalog.baseOptions.find((entry) => entry.value === 'gpt-5.3-codex')?.label).toBe('Codex 5.3')
    })

    it('falls back to base id when name is missing', () => {
        const catalog = buildCursorModelCatalog([
            { modelId: 'gpt-5.5[context=272k,reasoning=medium,fast=false]', name: 'gpt-5.5' },
        ])
        expect(catalog.baseOptions.find((entry) => entry.value === 'gpt-5.5')?.label).toBe('gpt-5.5')
    })
})

describe('cursorEffortPickerLabel', () => {
    it('shows only varying params, not Default or model name', () => {
        const wires = [
            'composer-2.5[fast=true]',
            'composer-2.5[fast=false]',
        ] as const
        expect(cursorVaryingWireParamKeys(wires)).toEqual(['fast'])
        expect(cursorEffortPickerLabel(wires[0], wires)).toBe('Fast')
        expect(cursorEffortPickerLabel(wires[1], wires)).toBe('Standard')
    })

    it('shows effort tokens when only effort differs', () => {
        const wires = [
            'claude-opus-4-8[thinking=true,context=300k,effort=high,fast=false]',
            'claude-opus-4-8[thinking=true,context=300k,effort=low,fast=false]',
        ] as const
        expect(cursorVaryingWireParamKeys(wires)).toEqual(['effort'])
        expect(buildCursorEffortPickerOptions(
            wires.map((wireId) => ({ wireId, label: '', sortKey: wireId }))
        ).map((row) => row.label)).toEqual(['Low', 'High'])
    })

    it('omits shared thinking and standard when only effort varies', () => {
        const label = cursorEffortPickerLabel(
            'claude-opus-4-8[thinking=true,context=300k,effort=high,fast=false]',
            [
                'claude-opus-4-8[thinking=true,context=300k,effort=high,fast=false]',
                'claude-opus-4-8[thinking=true,context=300k,effort=low,fast=false]',
            ]
        )
        expect(label).toBe('High')
        expect(label).not.toMatch(/Default|claude-opus/i)
    })

    it('sorts effort rows low before high and fast before standard', () => {
        const variants = [
            { modelId: 'claude-opus-4-8[thinking=true,context=300k,effort=high,fast=false]', name: 'x' },
            { modelId: 'claude-opus-4-8[thinking=true,context=300k,effort=low,fast=false]', name: 'x' },
            { modelId: 'claude-opus-4-8[thinking=true,context=300k,effort=medium,fast=false]', name: 'x' },
        ] as const
        const catalog = buildCursorModelCatalog([...variants])
        const labels = buildCursorEffortPickerOptions(
            resolveCursorVariantOptions('claude-opus-4-8', catalog)
        ).map((row) => row.label)
        expect(labels).toEqual(['Low', 'Medium', 'High'])
        expect(
            cursorEffortPickerSortKey('claude-opus-4-8[effort=low,fast=false]')
                < cursorEffortPickerSortKey('claude-opus-4-8[effort=high,fast=false]')
        ).toBe(true)
        const composer = buildCursorEffortPickerOptions(
            resolveCursorVariantOptions('composer-2.5', buildCursorModelCatalog([
                { modelId: 'composer-2.5[fast=false]', name: 'c' },
                { modelId: 'composer-2.5[fast=true]', name: 'c' },
            ]))
        ).map((row) => row.label)
        expect(composer).toEqual(['Fast', 'Standard'])
    })
})
