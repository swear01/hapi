import { expect, it } from 'bun:test'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

it('never caches HTML app shells while preserving API and asset cache policy', async () => {
    const root = await mkdtemp(join(tmpdir(), 'hapi-shell-cache-'))
    await mkdir(join(root, 'hub'))
    await mkdir(join(root, 'web', 'dist', 'assets'), { recursive: true })
    await writeFile(join(root, 'web', 'dist', 'index.html'), '<html>test app shell</html>')
    await writeFile(join(root, 'web', 'dist', 'assets', 'app.js'), 'void 0')
    const probe = Bun.serve({ hostname: '127.0.0.1', port: 0, fetch: () => new Response() })
    const port = probe.port
    probe.stop(true)
    const base = `http://127.0.0.1:${port}`
    const child = Bun.spawn([process.execPath, resolve(import.meta.dir, '../index.ts')], {
        cwd: join(root, 'hub'),
        env: {
            PATH: process.env.PATH,
            HOME: root,
            HAPI_HOME: root,
            DB_PATH: join(root, 'hapi.db'),
            CLI_API_TOKEN: 'isolated-app-shell-test',
            HAPI_LISTEN_HOST: '127.0.0.1',
            HAPI_LISTEN_PORT: String(port),
            HAPI_PUBLIC_URL: base,
            TELEGRAM_NOTIFICATION: 'false',
            SERVERCHAN_NOTIFICATION: 'false'
        },
        stdout: 'ignore',
        stderr: 'ignore'
    })
    try {
        const deadline = Date.now() + 3000
        while (Date.now() < deadline) {
            if (await fetch(`${base}/health`).then((r) => r.ok).catch(() => false)) break
            await Bun.sleep(25)
        }
        for (const path of ['/', '/index.html', '/sessions/example']) {
            for (const method of ['GET', 'HEAD']) {
                const response = await fetch(`${base}${path}`, { method })
                expect(response.status).toBe(200)
                expect(response.headers.get('Cache-Control')).toContain('no-store')
                expect(response.headers.get('CDN-Cache-Control')).toBe('no-store')
                expect(response.headers.get('Cloudflare-CDN-Cache-Control')).toBe('no-store')
            }
        }
        for (const path of ['/health', '/assets/app.js']) {
            const response = await fetch(`${base}${path}`)
            expect(response.status).toBe(200)
            expect(response.headers.get('Cache-Control') ?? '').not.toContain('no-store')
        }
    } finally {
        child.kill('SIGTERM')
        await Promise.race([child.exited, Bun.sleep(1000)])
        if (child.exitCode === null) child.kill('SIGKILL')
        await child.exited
        await rm(root, { recursive: true, force: true })
    }
})
