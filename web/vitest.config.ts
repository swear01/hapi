import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            globals: false,
            environment: 'jsdom',
            include: ['src/**/*.test.{ts,tsx}'],
            setupFiles: ['./src/test/setup.ts'],
            // Node 25+ ships its own localStorage global, which shadows jsdom's Storage.
            execArgv: process.allowedNodeEnvironmentFlags.has('--no-experimental-webstorage')
                ? ['--no-experimental-webstorage']
                : [],
        },
    })
)
