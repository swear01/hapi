import type { CursorModelSummary } from '@/types/api'

export type CursorModelOption = { value: string | null; label: string }

export type CursorModelVariantOption = {
    wireId: string
    label: string
    sortKey: string
}

export type CursorModelCatalog = {
    baseOptions: CursorModelOption[]
    variantsByBase: Map<string, CursorModelVariantOption[]>
    wireToBase: Map<string, string>
}

/** Base model id before ACP wire suffix, e.g. `composer-2.5[fast=true]` → `composer-2.5`. */
export function cursorModelBaseId(modelId: string): string {
    const bracket = modelId.indexOf('[')
    return bracket === -1 ? modelId : modelId.slice(0, bracket)
}

/** Key for grouping variants of the same base model. */
export function cursorModelDedupeKey(modelId: string): string {
    if (modelId.includes('[')) {
        return cursorModelBaseId(modelId)
    }

    let id = modelId
    if (id.endsWith('-fast')) {
        id = id.slice(0, -'-fast'.length)
    }
    id = id.replace(/-thinking(?:-(?:low|medium|high|xhigh|max))?$/, '')
    id = id.replace(/-(?:low|medium|high|xhigh|max)$/, '')
    return id
}

function isDefaultCursorModelId(modelId: string): boolean {
    const normalized = modelId.trim().toLowerCase()
    return normalized === 'auto' || normalized === 'default' || normalized === 'default[]'
}

function normalizeCurrentModel(model?: string | null): string | null {
    const trimmed = model?.trim()
    if (!trimmed || isDefaultCursorModelId(trimmed)) {
        return null
    }
    return trimmed
}

export function parseCursorWireParams(modelId: string): Record<string, string> {
    const match = modelId.match(/\[(.+)\]$/)
    if (!match) {
        return {}
    }

    const params: Record<string, string> = {}
    for (const part of match[1].split(',')) {
        const segment = part.trim()
        if (!segment) continue
        const eq = segment.indexOf('=')
        if (eq === -1) {
            params[segment] = 'true'
            continue
        }
        params[segment.slice(0, eq).trim()] = segment.slice(eq + 1).trim()
    }
    return params
}

/** Short label for an effort / variant row in the picker. */
export function cursorVariantLabel(modelId: string): string {
    const params = parseCursorWireParams(modelId)
    const parts: string[] = []

    if (params.fast === 'true') {
        parts.push('Fast')
    } else if (params.fast === 'false') {
        parts.push('Standard')
    }

    if (params.thinking === 'true') {
        parts.push('Thinking')
    }

    if (params.effort) {
        parts.push(`Effort ${params.effort}`)
    } else if (params.reasoning) {
        parts.push(`Reasoning ${params.reasoning}`)
    }

    if (params.context) {
        parts.push(`Context ${params.context}`)
    }

    if (parts.length === 0) {
        return 'Default'
    }

    return parts.join(' · ')
}

const CURSOR_EFFORT_PICKER_PARAM_ORDER = ['effort', 'reasoning', 'fast', 'thinking', 'context'] as const

/** Sort effort / variant rows: Fast before Standard, then low → max effort, then context. */
const CURSOR_EFFORT_PICKER_RANK: Record<string, number> = {
    minimal: 0,
    low: 1,
    medium: 2,
    high: 3,
    xhigh: 4,
    max: 5
}

export function cursorEffortPickerSortKey(wireId: string): string {
    const params = parseCursorWireParams(wireId)
    const fast = params.fast === 'true' ? '0' : params.fast === 'false' ? '1' : '2'
    const tier = (params.effort ?? params.reasoning ?? '').toLowerCase()
    const tierRank = String(CURSOR_EFFORT_PICKER_RANK[tier] ?? 50).padStart(2, '0')
    const thinking = params.thinking === 'true' ? '0' : '1'
    const contextDigits = (params.context?.match(/\d+/)?.[0] ?? '0').padStart(6, '0')
    return `${fast}:${tierRank}:${thinking}:${contextDigits}`
}

function capitalizePickerToken(value: string): string {
    if (!value) {
        return value
    }
    return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatCursorEffortPickerParamPart(key: string, value: string): string | null {
    switch (key) {
        case 'effort':
            return capitalizePickerToken(value)
        case 'reasoning':
            return capitalizePickerToken(value)
        case 'fast':
            if (value === 'true') {
                return 'Fast'
            }
            if (value === 'false') {
                return 'Standard'
            }
            return null
        case 'thinking':
            return value === 'true' ? 'Thinking' : null
        case 'context':
            return value
        default:
            return `${key} ${value}`
    }
}

/** Param keys that differ across wire ids in the same base model group. */
export function cursorVaryingWireParamKeys(wireIds: readonly string[]): string[] {
    if (wireIds.length <= 1) {
        return []
    }

    const parsed = wireIds.map((wireId) => parseCursorWireParams(wireId))
    const keys = new Set<string>()
    for (const params of parsed) {
        for (const key of Object.keys(params)) {
            keys.add(key)
        }
    }

    const varying: string[] = []
    for (const key of CURSOR_EFFORT_PICKER_PARAM_ORDER) {
        if (!keys.has(key)) {
            continue
        }
        const values = new Set(parsed.map((params) => params[key] ?? ''))
        if (values.size > 1) {
            varying.push(key)
        }
    }

    for (const key of keys) {
        if (CURSOR_EFFORT_PICKER_PARAM_ORDER.includes(key as (typeof CURSOR_EFFORT_PICKER_PARAM_ORDER)[number])) {
            continue
        }
        const values = new Set(parsed.map((params) => params[key] ?? ''))
        if (values.size > 1) {
            varying.push(key)
        }
    }

    return varying
}

/**
 * Label for the Effort / variant row only — omits model name and shared params.
 * Shows just what differs within the selected base (e.g. High vs Low, Fast vs Standard).
 */
export function cursorEffortPickerLabel(wireId: string, siblingWireIds: readonly string[]): string {
    const varyingKeys = cursorVaryingWireParamKeys(siblingWireIds)
    const params = parseCursorWireParams(wireId)

    if (varyingKeys.length > 0) {
        const parts: string[] = []
        for (const key of varyingKeys) {
            const value = params[key]
            if (!value) {
                continue
            }
            const part = formatCursorEffortPickerParamPart(key, value)
            if (part) {
                parts.push(part)
            }
        }
        if (parts.length > 0) {
            return parts.join(' · ')
        }
    }

    const fallback = cursorVariantDisambiguationSuffix(wireId)
    if (fallback !== cursorModelBaseId(wireId)) {
        return fallback
    }

    return cursorVariantLabel(wireId) === 'Default'
        ? cursorVariantDisambiguationSuffix(wireId)
        : cursorVariantLabel(wireId)
}

/** Effort-picker rows for one base model (no Default prefix, no shared model name). */
export function buildCursorEffortPickerOptions(
    variants: readonly CursorModelVariantOption[]
): Array<{ value: string; label: string }> {
    if (variants.length <= 1) {
        return []
    }

    const sortedVariants = [...variants].sort((a, b) =>
        cursorEffortPickerSortKey(a.wireId).localeCompare(cursorEffortPickerSortKey(b.wireId))
    )
    const wireIds = sortedVariants.map((variant) => variant.wireId)
    const rows = sortedVariants.map((variant) => ({
        value: variant.wireId,
        label: cursorEffortPickerLabel(variant.wireId, wireIds)
    }))

    const seenLabels = new Set<string>()
    return rows.map((row) => {
        if (!seenLabels.has(row.label)) {
            seenLabels.add(row.label)
            return row
        }
        return {
            value: row.value,
            label: `${row.label} · ${cursorVariantDisambiguationSuffix(row.value)}`
        }
    })
}

/** Short suffix when variant labels still collide after cursorVariantLabel. */
export function cursorVariantDisambiguationSuffix(modelId: string): string {
    const params = parseCursorWireParams(modelId)
    const parts: string[] = []
    if (params.effort) {
        parts.push(`effort=${params.effort}`)
    }
    if (params.reasoning) {
        parts.push(`reasoning=${params.reasoning}`)
    }
    if (params.context) {
        parts.push(`context=${params.context}`)
    }
    if (params.fast === 'true') {
        parts.push('fast')
    } else if (params.fast === 'false') {
        parts.push('standard')
    }
    if (params.thinking === 'true') {
        parts.push('thinking')
    }
    if (parts.length > 0) {
        return parts.join(', ')
    }
    return cursorModelBaseId(modelId)
}

function cursorVariantSortKey(modelId: string): string {
    const params = parseCursorWireParams(modelId)
    const fast = params.fast === 'true' ? '0' : params.fast === 'false' ? '1' : '2'
    const thinking = params.thinking === 'true' ? '0' : '1'
    const effort = params.effort ?? params.reasoning ?? ''
    return `${fast}:${thinking}:${effort}:${modelId}`
}

/** Base model label: Cursor ACP / CLI `name` when present, otherwise wire base id. */
function formatCursorBaseLabel(baseId: string, name?: string | null): string {
    const trimmedName = name?.trim()
    if (trimmedName && !trimmedName.includes('[')) {
        return trimmedName
    }
    return baseId
}

function isRawModelIdLabel(label: string, baseId: string): boolean {
    const norm = label.trim().toLowerCase().replace(/\./g, '-')
    const baseNorm = baseId.trim().toLowerCase().replace(/\./g, '-')
    return norm === baseNorm
}

/** Prefer human display names over raw wire / SKU ids. */
function pickBetterBaseLabel(baseId: string, existing: string | undefined, candidate: string): string {
    if (!existing) {
        return candidate
    }
    if (candidate === baseId && !isRawModelIdLabel(existing, baseId)) {
        return existing
    }
    if (existing === baseId && !isRawModelIdLabel(candidate, baseId)) {
        return candidate
    }
    if (isRawModelIdLabel(candidate, baseId) && !isRawModelIdLabel(existing, baseId)) {
        return existing
    }
    if (isRawModelIdLabel(existing, baseId) && !isRawModelIdLabel(candidate, baseId)) {
        return candidate
    }
    return candidate.length < existing.length ? candidate : existing
}

/**
 * Group ACP wire ids by base model (Zed-style: one model row + effort/variant row).
 * Base models are sorted alphabetically by display name.
 */
export function buildCursorModelCatalog(
    availableModels: readonly CursorModelSummary[],
    options?: {
        currentModel?: string | null
        /** New-session spawn uses `auto`; active session uses `null` for default. */
        defaultValue?: null | 'auto'
    }
): CursorModelCatalog {
    const defaultValue = options?.defaultValue === 'auto' ? 'auto' : null
    const variantsByBase = new Map<string, CursorModelVariantOption[]>()
    const wireToBase = new Map<string, string>()
    const baseLabels = new Map<string, string>()

    for (const model of availableModels) {
        if (isDefaultCursorModelId(model.modelId)) {
            continue
        }

        const baseId = cursorModelDedupeKey(model.modelId)
        wireToBase.set(model.modelId, baseId)

        const variant: CursorModelVariantOption = {
            wireId: model.modelId,
            label: cursorVariantLabel(model.modelId),
            sortKey: cursorVariantSortKey(model.modelId)
        }

        const existing = variantsByBase.get(baseId) ?? []
        const duplicate = existing.find((entry) => entry.wireId === model.modelId)
        if (!duplicate) {
            existing.push(variant)
            variantsByBase.set(baseId, existing)
        }

        const label = formatCursorBaseLabel(baseId, model.name)
        baseLabels.set(baseId, pickBetterBaseLabel(baseId, baseLabels.get(baseId), label))
    }

    for (const [baseId, variants] of variantsByBase) {
        variants.sort((a, b) => a.sortKey.localeCompare(b.sortKey))
        if (variants.length === 1) {
            continue
        }
        const seenLabels = new Set<string>()
        for (const variant of variants) {
            if (seenLabels.has(variant.label)) {
                variant.label = `${variant.label} · ${cursorVariantDisambiguationSuffix(variant.wireId)}`
            }
            seenLabels.add(variant.label)
        }
    }

    const normalizedCurrent = normalizeCurrentModel(options?.currentModel)
    if (normalizedCurrent && !wireToBase.has(normalizedCurrent)) {
        const baseId = cursorModelDedupeKey(normalizedCurrent)
        wireToBase.set(normalizedCurrent, baseId)
        const variants = variantsByBase.get(baseId) ?? []
        if (!variants.some((entry) => entry.wireId === normalizedCurrent)) {
            variants.push({
                wireId: normalizedCurrent,
                label: cursorVariantLabel(normalizedCurrent),
                sortKey: cursorVariantSortKey(normalizedCurrent)
            })
            variants.sort((a, b) => a.sortKey.localeCompare(b.sortKey))
            variantsByBase.set(baseId, variants)
        }
        baseLabels.set(baseId, formatCursorBaseLabel(baseId, null))
    }

    const baseEntries = [...baseLabels.entries()]
        .sort((a, b) => a[1].localeCompare(b[1], undefined, { sensitivity: 'base' }))

    if (normalizedCurrent) {
        const currentBase = wireToBase.get(normalizedCurrent)
        if (currentBase) {
            const index = baseEntries.findIndex(([baseId]) => baseId === currentBase)
            if (index > 0) {
                const [entry] = baseEntries.splice(index, 1)
                baseEntries.unshift(entry)
            }
        }
    }

    const baseOptions: CursorModelOption[] = [
        { value: defaultValue, label: 'Default' },
        ...baseEntries.map(([baseId, label]) => ({ value: baseId, label }))
    ]

    return { baseOptions, variantsByBase, wireToBase }
}

export function resolveCursorBaseKey(
    wireId: string | null | undefined,
    catalog: CursorModelCatalog
): string | null {
    if (!wireId) {
        return null
    }
    return catalog.wireToBase.get(wireId) ?? cursorModelDedupeKey(wireId)
}

export function resolveCursorVariantOptions(
    baseKey: string | null,
    catalog: CursorModelCatalog
): CursorModelVariantOption[] {
    if (!baseKey) {
        return []
    }
    return catalog.variantsByBase.get(baseKey) ?? []
}

/** True when at least one base model has multiple ACP wire variants (Zed-style dual picker). */
export function cursorCatalogHasMultiVariantBases(catalog: CursorModelCatalog): boolean {
    for (const variants of catalog.variantsByBase.values()) {
        if (variants.length > 1) {
            return true
        }
    }
    return false
}

export function cursorBaseHasMultipleVariants(
    catalog: CursorModelCatalog,
    baseKey: string | null | undefined
): boolean {
    if (!baseKey || baseKey === 'auto') {
        return false
    }
    return (catalog.variantsByBase.get(baseKey)?.length ?? 0) > 1
}

/** Dual Model + Effort rows when any base has variants, or the active wire's base does. */
export function shouldUseCursorDualPickers(
    catalog: CursorModelCatalog,
    currentWireId?: string | null
): boolean {
    if (cursorCatalogHasMultiVariantBases(catalog)) {
        return true
    }
    if (!currentWireId) {
        return false
    }
    const baseKey = resolveCursorBaseKey(currentWireId, catalog)
    return cursorBaseHasMultipleVariants(catalog, baseKey)
}

/**
 * Cursor ACP often lists one wire id per model family (28 rows).
 * Single Model dropdown: show base display names only; value stays the wire id for spawn.
 */
export function buildFlatCursorModelPickerOptions(
    catalog: CursorModelCatalog,
    options?: { defaultValue?: null | 'auto' }
): Array<{ value: string; label: string }> {
    const defaultValue = options?.defaultValue === 'auto' ? 'auto' : null
    const rows: Array<{ value: string; label: string }> = []

    for (const [baseId, variants] of catalog.variantsByBase) {
        const baseLabel = catalog.baseOptions.find((entry) => entry.value === baseId)?.label ?? baseId
        const wireIds = variants.map((variant) => variant.wireId)
        for (const variant of variants) {
            rows.push({
                value: variant.wireId,
                label: variants.length === 1
                    ? baseLabel
                    : cursorEffortPickerLabel(variant.wireId, wireIds)
            })
        }
    }

    rows.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }))

    return [
        { value: defaultValue ?? 'auto', label: 'Default' },
        ...rows
    ]
}

/** @deprecated Use buildCursorModelCatalog for Cursor sessions. */
export function buildCursorModelOptions(
    availableModels: readonly CursorModelSummary[],
    options?: {
        currentModel?: string | null
        defaultValue?: null | 'auto'
    }
): CursorModelOption[] {
    const catalog = buildCursorModelCatalog(availableModels, options)
    const effortOptions: CursorModelOption[] = []

    for (const variants of catalog.variantsByBase.values()) {
        const wireIds = variants.map((variant) => variant.wireId)
        for (const variant of variants) {
            effortOptions.push({
                value: variant.wireId,
                label: cursorEffortPickerLabel(variant.wireId, wireIds)
            })
        }
    }

    effortOptions.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }))

    return [catalog.baseOptions[0]!, ...effortOptions]
}

/** Human label for status display from a wire id. */
export function formatCursorModelPickerLabel(modelId: string, name?: string | null): string {
    const base = formatCursorBaseLabel(cursorModelDedupeKey(modelId), name)
    const variant = cursorVariantLabel(modelId)
    if (variant === 'Default') {
        return base
    }
    return `${base} · ${variant}`
}
