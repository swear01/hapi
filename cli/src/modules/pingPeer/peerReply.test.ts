import { describe, expect, it } from 'vitest'
import type { AxiosInstance } from 'axios'
import { forwardPeerReply, spawnPeer } from './pingPeer'

const peer = { id: 'peer-1', active: true, metadata: { name: 'Peer' } }

function hub(options: { spawn?: unknown; polls?: Array<{ thinking: boolean; role: string; text: string }> } = {}) {
    const posts: Array<{ url: string; body: any }> = []
    const polls = [...(options.polls ?? [])]
    let current = polls[0]
    const http = {
        post: async (url: string, body: any) => {
            posts.push({ url, body })
            if (url.endsWith('/api/auth')) return { status: 200, data: { token: 'jwt' } }
            if (url.endsWith('/spawn')) return { status: 200, data: options.spawn }
            return { status: 200, data: { ok: true } }
        },
        get: async (url: string) => {
            if (url.endsWith('/api/sessions')) return { status: 200, data: { sessions: [peer] } }
            if (url.endsWith('/messages')) {
                return { status: 200, data: { messages: [{ id: 'm', content: { role: current!.role, content: { type: 'text', text: current!.text } } }] } }
            }
            current = polls.shift() ?? current
            return { status: 200, data: { session: { ...peer, thinking: current?.thinking ?? false } } }
        }
    } as unknown as AxiosInstance
    return { http, posts, auth: { apiUrl: 'http://hub.test', accessToken: 'token', http } }
}

describe('spawnPeer', () => {
    it('spawns on the given machine and sends the task', async () => {
        const { posts, auth } = hub({ spawn: { type: 'success', sessionId: 'peer-1' } })
        await spawnPeer({ ...auth, machineId: 'm1', directory: '/repo', agent: 'codex', message: 'task' })
        expect(posts.find((p) => p.url.endsWith('/machines/m1/spawn'))?.body).toEqual({ directory: '/repo', agent: 'codex' })
        expect(posts.find((p) => p.url.endsWith('/sessions/peer-1/messages'))?.body).toEqual({ text: 'task' })
    })

    it('reports a failed spawn', async () => {
        const { auth } = hub({ spawn: { type: 'error', message: 'runner offline' } })
        await expect(spawnPeer({ ...auth, machineId: 'm1', directory: '/repo', message: 'task' }))
            .rejects.toThrow('spawn failed: runner offline')
    })
})

describe('forwardPeerReply', () => {
    it('posts the reply to the caller only after the peer answers and stays idle', async () => {
        const { posts, auth } = hub({
            polls: [
                { thinking: false, role: 'user', text: 'task' },
                { thinking: true, role: 'user', text: 'task' },
                { thinking: false, role: 'agent', text: 'done: 3 files' },
                { thinking: false, role: 'agent', text: 'done: 3 files' }
            ]
        })
        await forwardPeerReply({ ...auth, peerSessionId: 'peer-1', callerSessionId: 'caller', sleep: async () => {} })
        const replies = posts.filter((p) => p.url.endsWith('/sessions/caller/messages'))
        expect(replies.map((p) => p.body.text)).toEqual(['Reply from peer [Peer](/sessions/peer-1):\n\ndone: 3 files'])
    })
})
