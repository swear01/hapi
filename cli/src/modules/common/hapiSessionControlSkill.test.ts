import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { CREATABLE_AGENT_FLAVORS } from '@hapi/protocol/modes'
import { listSkills, resolveSkill } from './skills'
import {
    HAPI_SESSION_CONTROL_SKILL_DESCRIPTION,
    HAPI_SESSION_CONTROL_SKILL_NAME,
    ensureHapiSessionControlSkill,
    nativeSkillRoot
} from './hapiSessionControlSkill'

const ENV_KEYS = ['HOME', 'USERPROFILE', 'CLAUDE_CONFIG_DIR', 'CODEX_HOME', 'GROK_HOME', 'DSH_HOME', 'OPENCODE_CONFIG_DIR'] as const

describe('canonical hapi-session-control delivery', () => {
    let sandbox: string
    let workingDirectory: string
    let originalEnv: Partial<Record<typeof ENV_KEYS[number], string | undefined>>

    beforeEach(async () => {
        sandbox = await mkdtemp(join(tmpdir(), 'hapi-session-control-'))
        workingDirectory = join(sandbox, 'repo')
        await mkdir(join(workingDirectory, '.git'), { recursive: true })
        originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]))
        process.env.HOME = join(sandbox, 'home')
        delete process.env.USERPROFILE
        delete process.env.CLAUDE_CONFIG_DIR
        delete process.env.CODEX_HOME
        delete process.env.GROK_HOME
        delete process.env.DSH_HOME
        delete process.env.OPENCODE_CONFIG_DIR
    })

    afterEach(async () => {
        for (const key of ENV_KEYS) {
            const value = originalEnv[key]
            if (value === undefined) delete process.env[key]
            else process.env[key] = value
        }
        await rm(sandbox, { recursive: true, force: true })
    })

    it.each(CREATABLE_AGENT_FLAVORS)('installs and verifies the %s runtime catalog', async (flavor) => {
        const target = await ensureHapiSessionControlSkill(flavor, workingDirectory)
        expect(target).toBe(join(nativeSkillRoot(flavor), HAPI_SESSION_CONTROL_SKILL_NAME, 'SKILL.md'))
        expect(await readFile(target, 'utf8')).toContain(`name: ${HAPI_SESSION_CONTROL_SKILL_NAME}`)

        const catalog = await listSkills(workingDirectory, { flavor })
        expect(catalog).toContainEqual({
            name: HAPI_SESSION_CONTROL_SKILL_NAME,
            description: HAPI_SESSION_CONTROL_SKILL_DESCRIPTION
        })
        const loaded = await resolveSkill(HAPI_SESSION_CONTROL_SKILL_NAME, workingDirectory, { flavor })
        expect(loaded?.body).toContain('spawn_peer')
    })

    it('rejects an unmanaged skill file without overwriting it', async () => {
        const target = join(nativeSkillRoot('codex'), HAPI_SESSION_CONTROL_SKILL_NAME, 'SKILL.md')
        await mkdir(join(nativeSkillRoot('codex'), HAPI_SESSION_CONTROL_SKILL_NAME), { recursive: true })
        await writeFile(target, 'user-managed skill')

        await expect(ensureHapiSessionControlSkill('codex', workingDirectory)).rejects.toThrow(/user-managed/)

        expect(await readFile(target, 'utf8')).toBe('user-managed skill')
    })
})
