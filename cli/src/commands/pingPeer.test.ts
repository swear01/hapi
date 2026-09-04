import { describe, expect, it } from 'vitest'
import { PingPeerError } from '@/modules/pingPeer/pingPeer'
import { parsePingPeerArgs } from './pingPeer'

describe('parsePingPeerArgs', () => {
    it('parses positional session id + message', () => {
        expect(parsePingPeerArgs(['05d9f0f2-9273-4137-933c-07459a1146a2', 'hello'])).toEqual({
            help: false,
            json: false,
            sessionId: '05d9f0f2-9273-4137-933c-07459a1146a2',
            message: 'hello'
        })
    })

    it('parses --message-file and --wait', () => {
        expect(parsePingPeerArgs(['abc', '--message-file', 'brief.md', '--wait', '30'])).toEqual({
            help: false,
            json: false,
            sessionId: 'abc',
            messageFile: 'brief.md',
            waitActiveSecs: 30
        })
    })

    it('parses --json and --help', () => {
        expect(parsePingPeerArgs(['--json'])).toEqual({ help: false, json: true })
        expect(parsePingPeerArgs(['--help']).help).toBe(true)
    })

    it('rejects unknown flags', () => {
        expect(() => parsePingPeerArgs(['--host', 'evil'])).toThrow(PingPeerError)
        expect(() => parsePingPeerArgs(['--wait', '--json'])).toThrow(PingPeerError)
    })
})
