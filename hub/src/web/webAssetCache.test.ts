import { describe, expect, it } from 'bun:test'
import { getWebAssetCacheHeaders } from './server'

describe('getWebAssetCacheHeaders', () => {
    it('prevents service-worker and app-shell entrypoints from being cached', () => {
        for (const path of ['/sw.js', '/index.html', '/manifest.webmanifest']) {
            expect(getWebAssetCacheHeaders(path)).toEqual({
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'CDN-Cache-Control': 'no-store',
                'Cloudflare-CDN-Cache-Control': 'no-store'
            })
        }
    })

    it('allows fingerprinted assets to be cached immutably', () => {
        expect(getWebAssetCacheHeaders('/assets/index-B9KpkXam.js')).toEqual({
            'Cache-Control': 'public, max-age=31536000, immutable'
        })
    })
})
