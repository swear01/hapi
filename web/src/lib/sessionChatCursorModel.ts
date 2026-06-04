import type { CursorModelCatalog } from '@/lib/cursorModelOptions'
import type { CursorModelSummary } from '@/types/api'
import {
    buildCursorCatalogFromSources,
    buildCursorPickerState,
    resolveCursorBaseFromWire,
    resolveWireIdForBaseChange,
    type CursorPickerState
} from '@/lib/cursorPickerState'

export function isCursorEffortWireInCatalog(
    wireId: string,
    catalog: CursorModelCatalog
): boolean {
    return catalog.wireToBase.has(wireId)
}

export function resolveSessionCursorBaseSelectValue(
    picker: CursorPickerState,
    cursorSelectedBase: string
): string {
    if (picker.mode !== 'dual') {
        return picker.wireId ?? 'auto'
    }
    if (cursorSelectedBase !== 'auto') {
        return cursorSelectedBase
    }
    return picker.baseKey ?? 'auto'
}

export function resolveSessionCursorModelChange(args: {
    picker: CursorPickerState
    sessionModel: string | null | undefined
    cursorSelectedBase: string
    kind: 'base' | 'effort' | 'flat'
    value: string | null
}): { ok: true; wireId: string | null; nextSelectedBase: string } | { ok: false; reason: string } {
    const { picker, sessionModel, cursorSelectedBase, kind, value } = args

    if (kind === 'base') {
        if (!value || value === 'auto') {
            return { ok: true, wireId: null, nextSelectedBase: 'auto' }
        }
        const wireId = resolveWireIdForBaseChange(value, picker.catalog, sessionModel)
        return {
            ok: true,
            wireId: wireId === 'auto' ? null : wireId,
            nextSelectedBase: value
        }
    }

    if (kind === 'effort') {
        if (!value || value === 'auto') {
            return { ok: true, wireId: null, nextSelectedBase: cursorSelectedBase }
        }
        if (!isCursorEffortWireInCatalog(value, picker.catalog)) {
            return { ok: false, reason: 'effort wire id not in catalog' }
        }
        const base = resolveCursorBaseFromWire(value, picker.catalog)
        return { ok: true, wireId: value, nextSelectedBase: base }
    }

    // flat picker: value is wire id or auto
    if (!value || value === 'auto') {
        return { ok: true, wireId: null, nextSelectedBase: 'auto' }
    }
    if (!picker.catalog.wireToBase.has(value)) {
        return { ok: false, reason: 'model wire id not in catalog' }
    }
    return {
        ok: true,
        wireId: value,
        nextSelectedBase: resolveCursorBaseFromWire(value, picker.catalog)
    }
}

export function buildSessionCursorPickerState(args: {
    sessionModels: readonly CursorModelSummary[]
    machineModels: readonly CursorModelSummary[]
    sessionModel: string | null | undefined
    sessionCurrentModelId: string | null
}): CursorPickerState {
    const catalog = buildCursorCatalogFromSources({
        sessionModels: args.sessionModels,
        machineModels: args.machineModels,
        currentWireId: args.sessionCurrentModelId ?? args.sessionModel,
        sessionModelFromHub: args.sessionModel,
        defaultValue: null
    })
    return buildCursorPickerState({
        catalog,
        currentWireId: args.sessionModel ?? args.sessionCurrentModelId,
        defaultValue: null
    })
}
