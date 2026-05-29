import { describe, expect, test } from 'bun:test'
import {
    ANTIGRAVITY_PERMISSION_MODES,
    PERMISSION_MODES,
    getPermissionModesForFlavor,
    isPermissionModeAllowedForFlavor,
} from './modes'

describe('ANTIGRAVITY_PERMISSION_MODES', () => {
    test('includes default, yolo, and sandbox', () => {
        expect(ANTIGRAVITY_PERMISSION_MODES).toContain('default')
        expect(ANTIGRAVITY_PERMISSION_MODES).toContain('yolo')
        expect(ANTIGRAVITY_PERMISSION_MODES).toContain('sandbox')
    })

    test('does not include claude-only modes', () => {
        expect(ANTIGRAVITY_PERMISSION_MODES).not.toContain('acceptEdits')
        expect(ANTIGRAVITY_PERMISSION_MODES).not.toContain('bypassPermissions')
    })
})

describe('PERMISSION_MODES', () => {
    test('includes sandbox (added for antigravity)', () => {
        expect(PERMISSION_MODES).toContain('sandbox')
    })
})

describe('getPermissionModesForFlavor', () => {
    test('antigravity returns ANTIGRAVITY_PERMISSION_MODES', () => {
        const modes = getPermissionModesForFlavor('antigravity')
        expect(modes).toEqual(ANTIGRAVITY_PERMISSION_MODES)
    })

    test('antigravity modes include sandbox', () => {
        expect(getPermissionModesForFlavor('antigravity')).toContain('sandbox')
    })

    test('claude does not include sandbox', () => {
        expect(getPermissionModesForFlavor('claude')).not.toContain('sandbox')
    })

    test('codex does not include sandbox', () => {
        expect(getPermissionModesForFlavor('codex')).not.toContain('sandbox')
    })

    test('null/undefined falls back to claude modes', () => {
        expect(getPermissionModesForFlavor(null)).toEqual(getPermissionModesForFlavor('claude'))
        expect(getPermissionModesForFlavor(undefined)).toEqual(getPermissionModesForFlavor('claude'))
    })
})

describe('isPermissionModeAllowedForFlavor', () => {
    test('sandbox is allowed for antigravity', () => {
        expect(isPermissionModeAllowedForFlavor('sandbox', 'antigravity')).toBe(true)
    })

    test('sandbox is not allowed for claude', () => {
        expect(isPermissionModeAllowedForFlavor('sandbox', 'claude')).toBe(false)
    })

    test('yolo is allowed for both antigravity and codex', () => {
        expect(isPermissionModeAllowedForFlavor('yolo', 'antigravity')).toBe(true)
        expect(isPermissionModeAllowedForFlavor('yolo', 'codex')).toBe(true)
    })
})
