export const CREATE_SELECTION_KEYS = [
    'machine',
    'sessionType',
    'agent',
    'model',
    'effort',
    'reasoningEffort',
    'grokPermissionMode',
    'codexFamilyPermissionMode',
    'collaborationMode',
    'copilotAgentMode',
    'fastMode',
    'yolo'
] as const

export type CreateSelectionKey = typeof CREATE_SELECTION_KEYS[number]
export type CreateSelectionVisibility = Record<CreateSelectionKey, boolean>

const STORAGE_KEY = 'hapi:newSession:selectionVisibility:v1'
const DEFAULT_VISIBILITY = Object.fromEntries(
    CREATE_SELECTION_KEYS.map((key) => [key, true])
) as CreateSelectionVisibility

export function loadCreateSelectionVisibility(): CreateSelectionVisibility {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return { ...DEFAULT_VISIBILITY }
        const stored = JSON.parse(raw)
        if (!stored || typeof stored !== 'object') return { ...DEFAULT_VISIBILITY }
        return Object.fromEntries(CREATE_SELECTION_KEYS.map((key) => [
            key,
            typeof stored[key] === 'boolean' ? stored[key] : true
        ])) as CreateSelectionVisibility
    } catch {
        return { ...DEFAULT_VISIBILITY }
    }
}

export function saveCreateSelectionVisibility(visibility: CreateSelectionVisibility): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility))
    } catch {
        return
    }
}
