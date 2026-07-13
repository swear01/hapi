import { describe, expect, it } from 'vitest'
import { resolveToolAutoApprovalDecision } from './BasePermissionHandler'

describe('resolveToolAutoApprovalDecision skill_lookup', () => {
    it('auto-approves the read-only HAPI skill lookup tool', () => {
        expect(resolveToolAutoApprovalDecision(
            'default',
            'hapi_skill_lookup',
            'mcp__hapi__skill_lookup-1'
        )).toBe('approved')
    })

    it('does not approve another tool solely from a skill-looking call id', () => {
        expect(resolveToolAutoApprovalDecision(
            'default',
            'dangerous_tool',
            'skill_lookup-forged-id'
        )).toBeNull()
    })
})
