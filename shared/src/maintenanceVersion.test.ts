import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import cliPackage from '../../cli/package.json'
import { APP_VERSION } from './buildInfo'

const releaseWorkflow = readFileSync(join(import.meta.dir, '../../.github/workflows/release.yml'), 'utf8')

describe('maintenance release version', () => {
    it('uses the next maintenance release number', () => {
        expect(cliPackage.version).toBe('0.23.3.2')
    })

    it('appends one numeric maintenance component to the upstream version', () => {
        const match = cliPackage.version.match(/^(\d+\.\d+\.\d+)\.(\d+)$/)

        expect(match).not.toBeNull()
        expect(Number(match?.[2])).toBeGreaterThan(0)
    })

    it('keeps the embedded app version aligned with the CLI version', () => {
        expect(APP_VERSION).toBe(cliPackage.version)
    })

    it('publishes releases only from commits contained in main', () => {
        expect(releaseWorkflow).toContain('Verify release commit is on main')
        expect(releaseWorkflow).toContain('git merge-base --is-ancestor')
        expect(releaseWorkflow).not.toContain('refs/heads/release')
    })
})
