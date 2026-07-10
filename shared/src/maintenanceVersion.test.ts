import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import cliPackage from '../../cli/package.json'
import { APP_VERSION } from './buildInfo'

const releaseWorkflow = readFileSync(join(import.meta.dir, '../../.github/workflows/release.yml'), 'utf8')

describe('maintenance release version', () => {
    it('appends one numeric maintenance component to the upstream version', () => {
        const match = cliPackage.version.match(/^(\d+\.\d+\.\d+)\.(\d+)$/)

        expect(match).not.toBeNull()
        expect(Number(match?.[2])).toBeGreaterThan(0)
        expect(new Set(Object.values(cliPackage.optionalDependencies))).toEqual(new Set([match?.[1]]))
    })

    it('keeps the CLI and embedded web versions aligned', () => {
        expect(APP_VERSION).toBe(cliPackage.version)
    })

    it('only releases four-part tags that match the CLI version', () => {
        expect(releaseWorkflow).toContain("- 'v*.*.*.*'")
        expect(releaseWorkflow).toContain('Validate maintenance release tag')
        expect(releaseWorkflow).toContain('TAG_VERSION="${GITHUB_REF_NAME#v}"')
        expect(releaseWorkflow).toContain('test "$TAG_VERSION" = "$CLI_VERSION"')
        expect(releaseWorkflow).not.toContain('Update Homebrew formula')
    })
})
