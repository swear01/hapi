import { homedir } from 'node:os'
import { join } from 'node:path'

export const AGY_CONFIG_DIR = join(homedir(), '.gemini', 'antigravity-cli')
export const AGY_IMPLICIT_DIR = join(AGY_CONFIG_DIR, 'implicit')

export function buildAntigravityEnv(): NodeJS.ProcessEnv {
    return { ...process.env }
}
