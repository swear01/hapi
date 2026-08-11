import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJsonPath = join(__dirname, '..', 'package.json')
const rawVersion = process.env.HAPI_DESKTOP_VERSION || process.env.GITHUB_REF_NAME

if (!rawVersion) {
    throw new Error('HAPI_DESKTOP_VERSION or GITHUB_REF_NAME is required to sync desktop release version.')
}

const version = rawVersion.replace(/^v/, '')
// Accept maintained-release four-part versions (e.g. 0.27.2.1) in addition
// to plain semver — the fork tags every maintained release with four parts.
// electron-builder (app-builder-lib) requires strict semver and rejects a
// fourth numeric component, so the desktop app version is pinned to the
// three-part base (0.27.2.1 -> 0.27.2); the bundled CLI inside still carries
// the full maintained version.
const match = /^(\d+\.\d+\.\d+)(?:\.\d+)?(?:[-+][0-9A-Za-z.-]+)?$/.exec(version)
if (!match) {
    throw new Error(`Invalid desktop release version: ${rawVersion}`)
}
const packageVersion = match[1]

const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { version?: string }
packageJson.version = packageVersion
writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 4)}\n`, 'utf8')
console.log(`Synced desktop package version to ${packageVersion} (from ${rawVersion})`)
