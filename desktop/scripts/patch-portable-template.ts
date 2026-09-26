import { copyFileSync, existsSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const desktopRoot = join(__dirname, '..')
const repoRoot = join(desktopRoot, '..')
const sourceTemplatePath = join(desktopRoot, 'build', 'portable.nsi')
// bun hoists packages under node_modules/.bun/<pkg>@<version>/node_modules/<pkg>/;
// npm/yarn keep the flat node_modules/<pkg>/ layout. Try both.
const targetTemplateCandidates = [
    join(repoRoot, 'node_modules', 'app-builder-lib', 'templates', 'nsis', 'portable.nsi'),
    ...(() => {
        const bunDir = join(repoRoot, 'node_modules', '.bun')
        const matches: string[] = []
        try {
            const entries = readdirSync(bunDir)
            for (const entry of entries) {
                if (!entry.startsWith('app-builder-lib@')) continue
                matches.push(join(bunDir, entry, 'node_modules', 'app-builder-lib', 'templates', 'nsis', 'portable.nsi'))
            }
        } catch {
            // node_modules/.bun absent — npm/yarn layout only
        }
        return matches
    })()
]
const targetTemplatePath = targetTemplateCandidates.find((candidate) => existsSync(candidate))

if (!existsSync(sourceTemplatePath)) {
    throw new Error(`portable template not found: ${sourceTemplatePath}`)
}

if (!targetTemplatePath) {
    throw new Error(`electron-builder portable template not found (tried: ${targetTemplateCandidates.join(', ')})`)
}

copyFileSync(sourceTemplatePath, targetTemplatePath)
console.log(`Patched electron-builder portable template: ${targetTemplatePath}`)
