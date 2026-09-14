import { AxiosError } from 'axios'
import snapshots from '../../../../shared/fixtures/chat/codex-message-stream-snapshot.json'
import { describe, expect, it, vi } from 'vitest'
import {
    PingPeerError,
    controlPeer,
    exitCodeForPingPeerError,
    inspectPeer,
    pingPeer,
    requireExactSessionId,
    waitPeer
} from './pingPeer'

const SESSION_ID = '05d9f0f2-9273-4137-933c-07459a1146a2'
const REMIT_ID = '7ee03698-0fe7-4f76-b8a8-d84f4eddbf5c'

type MockResponse = { status: number; data: unknown }

function createHttpMock(handlers: {
    post?: (url: string, body?: unknown) => MockResponse | Promise<MockResponse>
    get?: (url: string, config?: { params?: Record<string, unknown>; signal?: AbortSignal }) => MockResponse | Promise<MockResponse>
    delete?: (url: string) => MockResponse | Promise<MockResponse>
}) {
    return {
        post: vi.fn(async (url: string, body?: unknown) => {
            if (!handlers.post) throw new Error(`unexpected POST ${url}`)
            return handlers.post(url, body)
        }),
        get: vi.fn(async (url: string, config?: { params?: Record<string, unknown>; signal?: AbortSignal }) => {
            if (!handlers.get) throw new Error(`unexpected GET ${url}`)
            return handlers.get(url, config)
        }),
        delete: vi.fn(async (url: string) => {
            if (!handlers.delete) throw new Error(`unexpected DELETE ${url}`)
            return handlers.delete(url)
        })
    }
}

function authResponse(url: string): MockResponse | null {
    return url.endsWith('/api/auth') ? { status: 200, data: { token: 'jwt' } } : null
}

describe('exact session boundary', () => {
    it('accepts an exact UUID or one exact session citation', () => {
        expect(requireExactSessionId(SESSION_ID)).toBe(SESSION_ID)
        expect(requireExactSessionId(`[peer](/sessions/${SESSION_ID})`)).toBe(SESSION_ID)
    })

    it.each(['05d9f0f2', '', 'not-a-session', `/sessions/${SESSION_ID} /sessions/${REMIT_ID}`])(
        'rejects non-exact target %s',
        (value) => expect(() => requireExactSessionId(value)).toThrowError(/exact HAPI session UUID/)
    )
})

describe('peer lifecycle operations', () => {
    it('messages only the exact target and records a stable remit id', async () => {
        const http = createHttpMock({
            post: (url, body) => {
                const auth = authResponse(url)
                if (auth) return auth
                if (url.endsWith(`/api/sessions/${SESSION_ID}/messages`)) {
                    expect(body).toEqual({ text: 'hello', localId: REMIT_ID })
                    return { status: 200, data: { ok: true } }
                }
                throw new Error(`unexpected POST ${url}`)
            },
            get: (url) => {
                expect(url).toBe(`http://hub.test/api/sessions/${SESSION_ID}`)
                return {
                    status: 200,
                    data: { session: { id: SESSION_ID, active: true, metadata: { name: 'Peer' } } }
                }
            }
        })

        await expect(pingPeer({
            sessionId: SESSION_ID,
            message: 'hello',
            remitId: REMIT_ID,
            apiUrl: 'http://hub.test',
            accessToken: 'token',
            http: http as never
        })).resolves.toEqual({ sessionId: SESSION_ID, remitId: REMIT_ID, name: 'Peer', resumed: false })
        expect(http.get).not.toHaveBeenCalledWith('http://hub.test/api/sessions', expect.anything())
    })

    it('returns the generated remit id when the message response is lost', async () => {
        let sentRemitId: string | undefined
        const http = createHttpMock({
            post: (url, body) => {
                const auth = authResponse(url)
                if (auth) return auth
                sentRemitId = (body as { localId?: string }).localId
                throw new Error('socket reset')
            },
            get: () => ({
                status: 200,
                data: { session: { id: SESSION_ID, active: true, metadata: { name: 'Peer' } } }
            })
        })

        try {
            await pingPeer({
                sessionId: SESSION_ID,
                message: 'hello',
                apiUrl: 'http://hub.test',
                accessToken: 'token',
                http: http as never
            })
            throw new Error('expected pingPeer to fail')
        } catch (error) {
            expect(error).toBeInstanceOf(PingPeerError)
            expect(error).toMatchObject({ code: 'send_failed', remitId: sentRemitId })
        }
        expect(sentRemitId).toMatch(/^[0-9a-f-]{36}$/)
    })

    it('reports a reused remit with a different payload as a deterministic conflict', async () => {
        const http = createHttpMock({
            post: (url) => authResponse(url) ?? {
                status: 409,
                data: {
                    error: 'localId is already bound to a different message payload',
                    code: 'local_id_conflict'
                }
            },
            get: () => ({
                status: 200,
                data: { session: { id: SESSION_ID, active: true, metadata: { name: 'Peer' } } }
            })
        })

        await expect(pingPeer({
            sessionId: SESSION_ID,
            message: 'different',
            remitId: REMIT_ID,
            apiUrl: 'http://hub.test',
            accessToken: 'token',
            http: http as never
        })).rejects.toMatchObject({ code: 'remit_conflict', remitId: REMIT_ID })
    })

    it('inspects without resuming or listing sessions', async () => {
        const http = createHttpMock({
            post: (url) => authResponse(url) ?? Promise.reject(new Error(`unexpected POST ${url}`)),
            get: (url) => {
                if (url.endsWith(`/api/sessions/${SESSION_ID}/messages`)) {
                    return {
                        status: 200,
                        data: { messages: [{ id: 'm1', createdAt: 10, content: { role: 'user', content: { text: 'task' } } }] }
                    }
                }
                if (url.endsWith(`/api/sessions/${SESSION_ID}`)) {
                    return { status: 200, data: { session: { id: SESSION_ID, active: false, metadata: { name: 'Peer', flavor: 'codex' } } } }
                }
                throw new Error(`unexpected GET ${url}`)
            }
        })

        const result = await inspectPeer({
            sessionId: SESSION_ID,
            apiUrl: 'http://hub.test',
            accessToken: 'token',
            http: http as never
        })
        expect(result).toMatchObject({ sessionId: SESSION_ID, active: false, flavor: 'codex' })
        expect(result.messages).toEqual([{ id: 'm1', role: 'user', text: 'task', createdAt: 10 }])
        expect(http.post).toHaveBeenCalledTimes(1)
    })

    it('waits for the assistant result after the exact remit', async () => {
        const http = createHttpMock({
            post: (url) => authResponse(url) ?? Promise.reject(new Error(`unexpected POST ${url}`)),
            get: (url) => {
                if (url.endsWith(`/api/sessions/${SESSION_ID}/messages`)) {
                    return {
                        status: 200,
                        data: {
                            messages: [
                                { id: 'u1', localId: REMIT_ID, invokedAt: 1, content: { role: 'user', content: { text: 'task' } } },
                                { id: 'queued', content: { role: 'user', content: { text: 'scheduled later' } } },
                                { id: 'a1', createdAt: 2, content: { role: 'assistant', content: { type: 'codex', data: { type: 'message', message: 'done' } } } },
                                { id: 'u2', createdAt: 3, invokedAt: 3, content: { role: 'user', content: { text: 'later turn' } } },
                                { id: 'a2', createdAt: 4, content: { role: 'assistant', content: { type: 'codex', data: { type: 'message', message: 'must not leak' } } } }
                            ]
                        }
                    }
                }
                if (url.endsWith(`/api/sessions/${SESSION_ID}`)) {
                    return { status: 200, data: { session: { id: SESSION_ID, active: true, thinking: true } } }
                }
                throw new Error(`unexpected GET ${url}`)
            }
        })

        await expect(waitPeer({
            sessionId: SESSION_ID,
            remitId: REMIT_ID,
            apiUrl: 'http://hub.test',
            accessToken: 'token',
            http: http as never
        })).resolves.toMatchObject({ status: 'completed', text: 'done' })
    })

    it('keeps only the final cumulative Codex snapshot for each stream', async () => {
        const http = createHttpMock({
            post: (url) => authResponse(url)!,
            get: (url) => url.endsWith('/messages')
                ? { status: 200, data: { messages: [
                    { id: 'u1', localId: REMIT_ID, invokedAt: 1, content: { role: 'user', content: { text: 'task' } } },
                    ...snapshots.input.messages
                ] } }
                : { status: 200, data: { session: { id: SESSION_ID, active: true, thinking: false } } }
        })
        const result = await waitPeer({ sessionId: SESSION_ID, remitId: REMIT_ID, apiUrl: 'http://hub.test', accessToken: 'token', http: http as never })
        expect(result.text).toBe(snapshots.expected.blocks[0].text)
        expect(result.messages).toHaveLength(1)
    })

    it.each([false, true])('requires a durable boundary for an inactive remit (boundary=%s)', async (boundary) => {
        const http = createHttpMock({
            post: (url) => authResponse(url)!,
            get: (url) => url.endsWith('/messages')
                ? { status: 200, data: { messages: [
                    { id: 'u1', localId: REMIT_ID, invokedAt: 1, content: { role: 'user', content: { text: 'task' } } },
                    snapshots.input.messages[0],
                    ...(boundary ? [{ id: 'u2', invokedAt: 2, content: { role: 'user', content: { text: 'next turn' } } }] : [])
                ] } }
                : { status: 200, data: { session: { id: SESSION_ID, active: false, thinking: false } } }
        })
        const result = waitPeer({ sessionId: SESSION_ID, remitId: REMIT_ID, apiUrl: 'http://hub.test', accessToken: 'token', http: http as never })
        if (boundary) await expect(result).resolves.toMatchObject({ status: 'completed' })
        else await expect(result).rejects.toMatchObject({ code: 'session_ended' })
    })

    it.each(['messages', 'session'])('retries transient %s polling failures but rejects deterministic errors', async (endpoint) => {
        for (const failure of [503, 'timeout', 401, 404] as const) {
            let failed = false
            let time = 0
            const sleep = vi.fn(async () => { time += 1000 })
            const http = createHttpMock({
                post: (url) => authResponse(url)!,
                get: (url) => {
                    if (!failed && (url.endsWith('/messages') === (endpoint === 'messages'))) {
                        failed = true
                        if (failure === 'timeout') throw new AxiosError('timeout', 'ECONNABORTED')
                        return { status: failure, data: {} }
                    }
                    return url.endsWith('/messages')
                        ? { status: 200, data: { messages: [
                            { id: 'u1', localId: REMIT_ID, invokedAt: 1, content: { role: 'user', content: { text: 'task' } } },
                            ...snapshots.input.messages
                        ] } }
                        : { status: 200, data: { session: { id: SESSION_ID, active: true, thinking: false } } }
                }
            })
            const result = waitPeer({ sessionId: SESSION_ID, remitId: REMIT_ID, apiUrl: 'http://hub.test', accessToken: 'token', http: http as never, now: () => time, sleep, timeoutSecs: 3 })
            if (failure === 503 || failure === 'timeout') {
                await expect(result).resolves.toMatchObject({ text: snapshots.expected.blocks[0].text })
                expect(sleep).toHaveBeenCalledTimes(1)
            } else {
                await expect(result).rejects.toMatchObject({ code: 'not_found' })
                expect(sleep).not.toHaveBeenCalled()
            }
        }
    })

    it('stops transient retries at the original deadline', async () => {
        let time = 0
        const http = createHttpMock({ post: (url) => authResponse(url)!, get: () => ({ status: 502, data: {} }) })
        await expect(waitPeer({ sessionId: SESSION_ID, remitId: REMIT_ID, apiUrl: 'http://hub.test', accessToken: 'token', http: http as never, now: () => time, sleep: async () => { time += 1000 }, timeoutSecs: 2 })).rejects.toMatchObject({ code: 'timeout' })
        expect(time).toBe(2000)
    })

    it.each(['messages', 'session'])('cancels an outstanding %s request at the remit deadline', async (endpoint) => {
        const http = createHttpMock({
            post: (url) => authResponse(url)!,
            get: (url, config) => {
                if (url.endsWith('/messages') !== (endpoint === 'messages')) return { status: 200, data: { messages: [] } }
                const signal = config?.signal
                if (!signal) throw new Error('Missing polling deadline')
                return new Promise((_resolve, reject) => {
                    const abort = () => reject(new AxiosError('deadline', 'ERR_CANCELED'))
                    if (signal.aborted) abort()
                    else signal.addEventListener('abort', abort, { once: true })
                })
            }
        })
        await expect(waitPeer({ sessionId: SESSION_ID, remitId: REMIT_ID, apiUrl: 'http://hub.test', accessToken: 'token', http: http as never, timeoutSecs: 0.02 })).rejects.toMatchObject({ code: 'timeout' })
    })

    it.each([false, true])('keeps results for remits acknowledged in a shared batch (later boundary=%s)', async (boundary) => {
        let time = 0
        const http = createHttpMock({
            post: (url) => authResponse(url)!,
            get: (url) => url.endsWith('/messages')
                ? { status: 200, data: { messages: [
                    { id: 'u1', localId: REMIT_ID, invokedAt: 1, content: { role: 'user', content: { text: 'task' } } },
                    { id: 'sibling', invokedAt: 1, content: { role: 'user', content: { text: 'same batch' } } },
                    ...snapshots.input.messages,
                    ...(boundary ? [
                        { id: 'later', invokedAt: 2, content: { role: 'user', content: { text: 'next turn' } } },
                        { ...snapshots.input.messages[1], content: { role: 'assistant', content: { type: 'codex', data: { type: 'message', message: 'must not leak' } } } }
                    ] : [])
                ] } }
                : { status: 200, data: { session: { id: SESSION_ID, active: true, thinking: boundary } } }
        })
        await expect(waitPeer({ sessionId: SESSION_ID, remitId: REMIT_ID, apiUrl: 'http://hub.test', accessToken: 'token', http: http as never, now: () => time, sleep: async () => { time += 1000 }, timeoutSecs: 2 })).resolves.toMatchObject({ status: 'completed', text: snapshots.expected.blocks[0].text })
    })

    it('rechecks thinking after messages arrive before returning a remit result', async () => {
        let thinking = false
        let reads = 0
        let time = 0
        const http = createHttpMock({
            post: (url) => authResponse(url)!,
            get: (url) => {
                if (url.endsWith(`/api/sessions/${SESSION_ID}`)) {
                    return { status: 200, data: { session: { id: SESSION_ID, active: true, thinking } } }
                }
                reads += 1
                thinking = reads === 1
                return { status: 200, data: { messages: [
                    { id: 'u1', localId: REMIT_ID, invokedAt: 1, content: { role: 'user', content: { text: 'task' } } },
                    { id: 'a1', content: { role: 'assistant', content: { type: 'codex', data: { type: 'message', message: thinking ? 'partial' : 'complete' } } } }
                ] } }
            }
        })
        const result = await waitPeer({ sessionId: SESSION_ID, remitId: REMIT_ID, apiUrl: 'http://hub.test', accessToken: 'token', http: http as never, now: () => time, sleep: async () => { time += 1000 } })
        expect(result.text).toBe('complete')
        expect(reads).toBe(2)
    })

    it('finds an older remit and returns results across message pages', async () => {
        const http = createHttpMock({
            post: (url) => authResponse(url) ?? Promise.reject(new Error(`unexpected POST ${url}`)),
            get: (url, config) => {
                if (url.endsWith(`/api/sessions/${SESSION_ID}`)) {
                    return { status: 200, data: { session: { id: SESSION_ID, active: true, thinking: false } } }
                }
                if (!url.endsWith(`/api/sessions/${SESSION_ID}/messages`)) throw new Error(`unexpected GET ${url}`)
                if (config?.params?.beforeSeq === 200) {
                    return {
                        status: 200,
                        data: {
                            messages: [
                                { id: 'u1', seq: 1, localId: REMIT_ID, invokedAt: 1, content: { role: 'user', content: { text: 'task' } } },
                                { id: 'a1', seq: 2, createdAt: 2, content: { role: 'assistant', content: { type: 'codex', data: { type: 'message', message: 'part one' } } } }
                            ],
                            page: { hasMore: false }
                        }
                    }
                }
                return {
                    status: 200,
                    data: {
                        messages: [
                            { id: 'a2', seq: 201, createdAt: 201, content: { role: 'assistant', content: { type: 'codex', data: { type: 'message', message: 'part two' } } } }
                        ],
                        page: { hasMore: true, nextBeforeAt: 200, nextBeforeSeq: 200 }
                    }
                }
            }
        })

        await expect(waitPeer({
            sessionId: SESSION_ID,
            remitId: REMIT_ID,
            apiUrl: 'http://hub.test',
            accessToken: 'token',
            http: http as never
        })).resolves.toMatchObject({ status: 'completed', text: 'part one\n\npart two' })
    })

    it.each(['abort', 'stop', 'archive', 'delete'] as const)('sends %s to the exact session', async (action) => {
        const http = createHttpMock({
            post: (url) => {
                const auth = authResponse(url)
                if (auth) return auth
                expect(url).toBe(`http://hub.test/api/sessions/${SESSION_ID}/${action}`)
                return { status: 200, data: { ok: true, alreadyStopped: action === 'stop', alreadyArchived: action === 'archive' } }
            },
            delete: (url) => {
                expect(url).toBe(`http://hub.test/api/sessions/${SESSION_ID}`)
                return { status: 200, data: { ok: true } }
            }
        })
        await expect(controlPeer({
            sessionId: SESSION_ID,
            action,
            apiUrl: 'http://hub.test',
            accessToken: 'token',
            http: http as never
        })).resolves.toMatchObject({ sessionId: SESSION_ID, action })
    })

    it('uses stable nonzero exit codes', () => {
        expect(exitCodeForPingPeerError(new PingPeerError('bad_args', 'x'))).toBe(2)
        expect(exitCodeForPingPeerError(new PingPeerError('remit_conflict', 'x'))).toBe(2)
        expect(exitCodeForPingPeerError(new PingPeerError('resume_failed', 'x'))).toBe(3)
        expect(exitCodeForPingPeerError(new PingPeerError('timeout', 'x'))).toBe(4)
    })
})
