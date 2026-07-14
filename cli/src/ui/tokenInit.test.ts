import { beforeEach, describe, expect, it, vi } from 'vitest'

const { initializeApiUrlMock, readSettingsMock, updateSettingsMock } = vi.hoisted(() => ({
    initializeApiUrlMock: vi.fn(async () => {}),
    readSettingsMock: vi.fn(),
    updateSettingsMock: vi.fn()
}))

vi.mock('@/ui/apiUrlInit', () => ({
    initializeApiUrl: initializeApiUrlMock
}))

vi.mock('@/persistence', () => ({
    readSettings: readSettingsMock,
    updateSettings: updateSettingsMock
}))

import { configuration } from '@/configuration'
import { initializeToken } from './tokenInit'

describe('initializeToken extra headers', () => {
    beforeEach(() => {
        delete process.env.HAPI_EXTRA_HEADERS_JSON
        configuration._setCliApiToken('token-from-env')
        configuration._setExtraHeaders({})
        initializeApiUrlMock.mockClear()
        readSettingsMock.mockReset()
        updateSettingsMock.mockReset()
    })

    it('loads extra headers from settings even when the token is already initialized', async () => {
        readSettingsMock.mockResolvedValue({
            extraHeaders: {
                'CF-Access-Client-Id': 'client-id',
                'CF-Access-Client-Secret': 'client-secret'
            }
        })

        await initializeToken()

        expect(configuration.extraHeaders).toEqual({
            'CF-Access-Client-Id': 'client-id',
            'CF-Access-Client-Secret': 'client-secret'
        })
    })
})
