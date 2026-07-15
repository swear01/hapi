import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const webappWorkflow = readFileSync(join(import.meta.dir, '../../.github/workflows/webapp.yml'), 'utf8')
const upstreamOnly = "if: github.repository == 'tiann/hapi'"

describe('fork webapp workflow', () => {
    it('builds on forks but only publishes Pages from upstream', () => {
        expect(webappWorkflow).toContain('- name: Build web app')
        expect(webappWorkflow).toContain(`- name: Add CNAME for custom domain\n              ${upstreamOnly}`)
        expect(webappWorkflow).toContain(`- name: Setup Pages\n              ${upstreamOnly}`)
        expect(webappWorkflow).toContain(`- name: Upload artifact\n              ${upstreamOnly}`)
        expect(webappWorkflow).toContain(`deploy:\n        ${upstreamOnly}`)
    })
})

const releaseWorkflow = readFileSync(join(import.meta.dir, '../../.github/workflows/release.yml'), 'utf8')

describe('fork release workflow', () => {
    it('signs macOS artifacts with a stable local identity before release', () => {
        expect(releaseWorkflow).toContain('sign-macos:')
        expect(releaseWorkflow).toContain('runs-on: macos-14')
        expect(releaseWorkflow).toContain('secrets.MACOS_SIGNING_P12')
        expect(releaseWorkflow).toContain('secrets.MACOS_SIGNING_P12_PASSWORD')
        expect(releaseWorkflow).toContain('--identifier xyz.hapi.cli')
        expect(releaseWorkflow).toContain('codesign --verify --strict --verbose=2')
    })

    it('does not publish unsigned macOS binaries', () => {
        expect(releaseWorkflow).toContain('if [[ "$target" == bun-darwin-* ]]')
        expect(releaseWorkflow).toContain('needs: [build, sign-macos]')
        expect(releaseWorkflow).toContain("pattern: '*-release-artifacts'")
        expect(releaseWorkflow).toContain('merge-multiple: true')
    })
})
