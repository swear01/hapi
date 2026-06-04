import type { CursorModelSummary } from '@/types/api'
import {
    buildCursorEffortPickerOptions,
    buildCursorModelCatalog,
    buildFlatCursorModelPickerOptions,
    cursorBaseHasMultipleVariants,
    cursorModelDedupeKey,
    parseCursorWireParams,
    resolveCursorBaseKey,
    resolveCursorVariantOptions,
    shouldUseCursorDualPickers,
    type CursorModelCatalog,
    type CursorModelOption
} from '@/lib/cursorModelOptions'

export type CursorPickerMode = 'dual' | 'flat'

export type CursorPickerOption = { value: string; label: string }

export type CursorPickerState = {
    catalog: CursorModelCatalog
    mode: CursorPickerMode
    wireId: string | null
    baseKey: string | null
    modelOptions: CursorPickerOption[]
    effortOptions: CursorPickerOption[]
    showEffortPicker: boolean
}

/** Prefer ACP wire ids when present; fall back to full machine/probe list. */
export function pickCursorModelsForPicker(
    availableModels: readonly CursorModelSummary[]
): CursorModelSummary[] {
    const acpWire = availableModels.filter((model) => model.modelId.includes('['))
    return acpWire.length > 0 ? acpWire : [...availableModels]
}

/**
 * Merge session (ACP) and machine catalogs. Session rows win on duplicate modelId;
 * machine rows fill display names and extra SKUs.
 */
export function mergeCursorModelSummaries(
    primary: readonly CursorModelSummary[],
    secondary: readonly CursorModelSummary[],
    currentWireId?: string | null
): CursorModelSummary[] {
    const merged = new Map<string, CursorModelSummary>()

    const add = (model: CursorModelSummary, preferName: boolean) => {
        const modelId = model.modelId.trim()
        if (!modelId) {
            return
        }
        const existing = merged.get(modelId)
        if (!existing) {
            merged.set(modelId, { ...model, modelId })
            return
        }
        const name = model.name?.trim()
        if (
            name
            && name !== modelId
            && (preferName || !existing.name || existing.name === existing.modelId)
        ) {
            merged.set(modelId, { modelId, name })
        }
    }

    for (const model of secondary) {
        add(model, false)
    }
    for (const model of primary) {
        add(model, true)
    }

    const trimmedCurrent = currentWireId?.trim()
    if (trimmedCurrent && !merged.has(trimmedCurrent)) {
        merged.set(trimmedCurrent, { modelId: trimmedCurrent })
    }

    return [...merged.values()]
}

export function buildCursorCatalogFromSources(args: {
    sessionModels: readonly CursorModelSummary[]
    machineModels?: readonly CursorModelSummary[]
    currentWireId?: string | null
    sessionModelFromHub?: string | null
    defaultValue?: null | 'auto'
}): CursorModelCatalog {
    const wireHint = args.currentWireId
        ?? args.sessionModelFromHub
        ?? null
    const merged = mergeCursorModelSummaries(
        args.sessionModels,
        args.machineModels ?? [],
        wireHint
    )
    return buildCursorModelCatalog(pickCursorModelsForPicker(merged), {
        currentModel: wireHint ?? args.sessionModelFromHub,
        defaultValue: args.defaultValue
    })
}

export function normalizeCursorPickerWireId(
    wireId: string | null | undefined,
    defaultToken: 'auto' | null = null
): string | null {
    const trimmed = wireId?.trim()
    if (!trimmed || trimmed === 'auto' || trimmed === 'default' || trimmed === 'default[]') {
        return defaultToken
    }
    return trimmed
}

export function buildCursorPickerState(args: {
    catalog: CursorModelCatalog
    currentWireId?: string | null
    defaultValue?: null | 'auto'
}): CursorPickerState {
    const defaultToken = args.defaultValue === 'auto' ? 'auto' : null
    const wireId = normalizeCursorPickerWireId(args.currentWireId, defaultToken)
    const baseKey = wireId && wireId !== 'auto'
        ? resolveCursorBaseKey(wireId, args.catalog)
        : null

    const useDual = shouldUseCursorDualPickers(args.catalog, wireId === 'auto' ? null : wireId)
    const showEffortPicker = Boolean(
        baseKey
        && baseKey !== 'auto'
        && cursorBaseHasMultipleVariants(args.catalog, baseKey)
    )

    const modelOptions: CursorPickerOption[] = useDual
        ? args.catalog.baseOptions.map((option) => ({
            value: option.value ?? 'auto',
            label: option.label
        }))
        : buildFlatCursorModelPickerOptions(args.catalog, { defaultValue: args.defaultValue })
            .map((option) => ({
                value: option.value ?? 'auto',
                label: option.label
            }))

    const effortOptions: CursorPickerOption[] = showEffortPicker
        ? buildCursorEffortPickerOptions(resolveCursorVariantOptions(baseKey, args.catalog))
        : []

    return {
        catalog: args.catalog,
        mode: useDual ? 'dual' : 'flat',
        wireId,
        baseKey,
        modelOptions,
        effortOptions,
        showEffortPicker
    }
}

function scoreVariantForBaseChange(
    currentParams: Record<string, string>,
    candidateParams: Record<string, string>
): number {
    let score = 0
    for (const key of ['effort', 'reasoning', 'fast', 'thinking', 'context'] as const) {
        const current = currentParams[key]
        if (current === undefined) {
            continue
        }
        if (candidateParams[key] === current) {
            score += 10
        }
    }
    return score
}

/**
 * When switching base in dual picker, keep effort/fast/context tier when the new base offers a matching wire.
 */
export function resolveWireIdForBaseChange(
    baseKey: string,
    catalog: CursorModelCatalog,
    currentWireId?: string | null
): string {
    if (baseKey === 'auto') {
        return 'auto'
    }
    const variants = resolveCursorVariantOptions(baseKey, catalog)
    if (variants.length === 0) {
        return 'auto'
    }
    if (!currentWireId || currentWireId === 'auto') {
        return variants[0].wireId
    }
    const exact = variants.find((entry) => entry.wireId === currentWireId)
    if (exact) {
        return exact.wireId
    }
    const currentParams = parseCursorWireParams(currentWireId)
    let best = variants[0]
    let bestScore = -1
    for (const variant of variants) {
        const score = scoreVariantForBaseChange(currentParams, parseCursorWireParams(variant.wireId))
        if (score > bestScore) {
            bestScore = score
            best = variant
        }
    }
    return best.wireId
}

export function resolveCursorBaseFromWire(
    wireId: string,
    catalog: CursorModelCatalog
): string {
    if (wireId === 'auto') {
        return 'auto'
    }
    return resolveCursorBaseKey(wireId, catalog) ?? cursorModelDedupeKey(wireId)
}
