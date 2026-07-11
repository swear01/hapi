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
