import { afterEach, expect, it, vi } from 'vitest'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import packageJson from '../../package.json'

const state = vi.hoisted(() => ({ root: '', source: '' }))
vi.mock('@/projectPath', () => ({ isBunCompiled: () => true, runtimePath: () => state.root }))
vi.mock('#embedded-assets', () => ({ loadEmbeddedAssets: async () => [
    { relativePath: 'skills/hapi-session-runtime/SKILL.md', sourcePath: state.source }
] }))
import { ensureRuntimeAssets } from './assets'

afterEach(() => { if (state.root) rmSync(state.root, { recursive: true, force: true }) })

it('refreshes a stale embedded skill even when the runtime version is unchanged', async () => {
    state.root = mkdtempSync(join(tmpdir(), 'hapi-runtime-assets-'))
    state.source = join(state.root, 'bundled-skill.md')
    writeFileSync(state.source, 'current bundled skill')
    const suffix = process.platform === 'win32' ? '.exe' : ''
    for (const relative of [`tools/unpacked/rg${suffix}`, `tools/unpacked/difft${suffix}`, `tools/tunwg/tunwg${suffix}`]) {
        const target = join(state.root, relative)
        mkdirSync(join(target, '..'), { recursive: true })
        writeFileSync(target, 'existing tool')
    }
    const skill = join(state.root, 'skills/hapi-session-runtime/SKILL.md')
    mkdirSync(join(skill, '..'), { recursive: true })
    writeFileSync(skill, 'stale bundled skill')
    writeFileSync(join(state.root, '.runtime-version'), packageJson.version)

    await ensureRuntimeAssets()

    expect(readFileSync(skill, 'utf8')).toBe('current bundled skill')
})
