import { lstat, mkdir, readFile, rename, rm, unlink, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { parse as parseYaml } from 'yaml'
import { runtimePath } from '@/projectPath'
import { resolveSkill } from './skills'

export const HAPI_SESSION_CONTROL_SKILL_NAME = 'hapi-session-control'
export const HAPI_SESSION_CONTROL_SKILL_DESCRIPTION =
    'Create, wait for, inspect, message, stop, archive, or delete HAPI coding-agent sessions across machines and workspaces. Use for delegated work, peer messages, session links or IDs, result collection, and cleanup.'

function homeDirectory(): string {
    return process.env.HOME ?? process.env.USERPROFILE ?? homedir()
}

export function nativeSkillRoot(flavor: string): string {
    const home = homeDirectory()
    switch (flavor) {
        case 'claude':
            return join(process.env.CLAUDE_CONFIG_DIR || join(home, '.claude'), 'skills')
        case 'codex':
            return join(process.env.CODEX_HOME || join(home, '.codex'), 'skills')
        case 'grok':
            return join(process.env.GROK_HOME || join(home, '.grok'), 'skills')
        case 'dsh':
            return join(process.env.DSH_HOME || join(home, '.dsh'), 'skills')
        case 'cursor':
            return join(home, '.cursor', 'skills')
        case 'opencode':
            // HAPI gives local OpenCode an isolated OPENCODE_CONFIG_DIR per
            // session; the runtime's native Agent Skills compatibility root
            // remains stable across local, remote, and resumed launches.
            return join(home, '.agents', 'skills')
        case 'kimi':
            return join(home, '.kimi', 'skills')
        case 'copilot':
            return join(home, '.copilot', 'skills')
        case 'agy':
            return join(home, '.gemini', 'antigravity-cli', 'skills')
        case 'pi':
            return join(home, '.pi', 'agent', 'skills')
        default:
            return join(home, '.agents', 'skills')
    }
}

function parseCanonicalSkill(source: string): { description: string; body: string } {
    const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
    if (!match) throw new Error('Bundled hapi-session-control skill has no frontmatter')
    const frontmatter = parseYaml(match[1]!) as Record<string, unknown>
    if (frontmatter.name !== HAPI_SESSION_CONTROL_SKILL_NAME || typeof frontmatter.description !== 'string') {
        throw new Error('Bundled hapi-session-control skill has invalid metadata')
    }
    return { description: frontmatter.description.trim(), body: match[2]!.trim() }
}

export async function ensureHapiSessionControlSkill(flavor: string, workingDirectory: string): Promise<string> {
    const sourcePath = join(runtimePath(), 'skills', HAPI_SESSION_CONTROL_SKILL_NAME, 'SKILL.md')
    const source = await readFile(sourcePath, 'utf8').catch((error) => {
        throw new Error(`Canonical ${HAPI_SESSION_CONTROL_SKILL_NAME} skill is unavailable: ${error instanceof Error ? error.message : String(error)}`)
    })
    const canonical = parseCanonicalSkill(source)
    const skillRoot = nativeSkillRoot(flavor)
    const targetDir = join(skillRoot, HAPI_SESSION_CONTROL_SKILL_NAME)
    const targetPath = join(targetDir, 'SKILL.md')

    await mkdir(skillRoot, { recursive: true, mode: 0o700 })
    const targetDirStat = await lstat(targetDir).catch(() => null)
    if (targetDirStat?.isSymbolicLink()) {
        const suffix = `${process.pid}.${randomUUID()}`
        const temporaryDir = join(skillRoot, `.${HAPI_SESSION_CONTROL_SKILL_NAME}.${suffix}.tmp`)
        const displacedPath = join(skillRoot, `.${HAPI_SESSION_CONTROL_SKILL_NAME}.${suffix}.old`)
        await mkdir(temporaryDir, { mode: 0o700 })
        try {
            await writeFile(join(temporaryDir, 'SKILL.md'), source, { encoding: 'utf8', mode: 0o600 })
            await rename(targetDir, displacedPath)
            try {
                await rename(temporaryDir, targetDir)
            } catch (error) {
                await rename(displacedPath, targetDir)
                throw error
            }
            await unlink(displacedPath).catch(() => {})
        } finally {
            await rm(temporaryDir, { recursive: true, force: true })
        }
    }

    await mkdir(targetDir, { recursive: true, mode: 0o700 })
    const targetStat = await lstat(targetPath).catch(() => null)
    const installed = targetStat?.isFile() && !targetStat.isSymbolicLink()
        ? await readFile(targetPath, 'utf8').catch(() => null)
        : null
    if (installed !== source) {
        const temporaryPath = join(targetDir, `.SKILL.md.${process.pid}.${randomUUID()}.tmp`)
        try {
            await writeFile(temporaryPath, source, { encoding: 'utf8', mode: 0o600 })
            await rename(temporaryPath, targetPath)
        } finally {
            await unlink(temporaryPath).catch(() => {})
        }
    }

    const effective = await resolveSkill(HAPI_SESSION_CONTROL_SKILL_NAME, workingDirectory, { flavor })
    if (
        !effective
        || canonical.description !== HAPI_SESSION_CONTROL_SKILL_DESCRIPTION
        || effective.description !== HAPI_SESSION_CONTROL_SKILL_DESCRIPTION
        || effective.body !== canonical.body
    ) {
        throw new Error(`Canonical ${HAPI_SESSION_CONTROL_SKILL_NAME} skill is shadowed or could not be verified`)
    }
    return targetPath
}
