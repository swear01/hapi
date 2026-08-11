import { describe, expect, it } from 'vitest'
import {
    buildStorageUsageSlices,
    describeDonutArc,
    formatStoragePercent,
    polarToCartesian,
} from './storageUsageSlices'

describe('buildStorageUsageSlices', () => {
    it('drops zero-byte components and returns empty when nothing has size', () => {
        expect(buildStorageUsageSlices({ usedBytes: 0, freelistBytes: 0, walBytes: 0, shmBytes: 0 })).toEqual([])
        expect(buildStorageUsageSlices({ usedBytes: 10, freelistBytes: 0, walBytes: 0, shmBytes: 0 })).toHaveLength(1)
    })

    it('assigns equal quarters for equal byte counts', () => {
        const slices = buildStorageUsageSlices({ usedBytes: 100, freelistBytes: 100, walBytes: 100, shmBytes: 100 })
        expect(slices.map((s) => s.key)).toEqual(['used', 'freelist', 'wal', 'shm'])
        expect(slices.every((s) => s.percent === 25)).toBe(true)
        expect(slices[0]?.startAngle).toBe(-90)
        expect(slices[3]?.endAngle).toBe(270)
        expect(slices[1]!.endAngle - slices[1]!.startAngle).toBeCloseTo(90, 5)
    })

    it('gives a single full-circle slice when only one component has bytes', () => {
        const [only] = buildStorageUsageSlices({ usedBytes: 42, freelistBytes: 0, walBytes: 0, shmBytes: 0 })
        expect(only).toMatchObject({ key: 'used', bytes: 42, percent: 100, startAngle: -90, endAngle: 270 })
    })
})

describe('donut geometry', () => {
    it('maps 0deg to the right of center', () => {
        expect(polarToCartesian(0, 0, 10, 0)).toEqual({ x: 10, y: 0 })
    })

    it('returns a closed path for a quarter arc', () => {
        const path = describeDonutArc(50, 50, 20, 40, -90, 0)
        expect(path.startsWith('M ')).toBe(true)
        expect(path.endsWith('Z')).toBe(true)
        expect(path).toContain('A 40 40')
        expect(path).toContain('A 20 20')
    })

    it('returns a two-half path for a full circle', () => {
        const path = describeDonutArc(50, 50, 20, 40, -90, 270)
        expect(path.split('A 40 40').length - 1).toBe(2)
    })
})

describe('formatStoragePercent', () => {
    it('formats whole and fractional percents', () => {
        expect(formatStoragePercent(50)).toBe('50%')
        expect(formatStoragePercent(33.3)).toBe('33.3%')
        expect(formatStoragePercent(Number.NaN)).toBe('0%')
    })
})
