import { render, screen } from '@testing-library/react'
import type { SqliteTableUsage } from '@hapi/protocol/apiTypes'
import { describe, expect, it } from 'vitest'
import { StorageUsageBreakdown } from './StorageUsageBreakdown'

const labels = {
    title: 'Itemized usage',
    table: 'Table',
    index: 'Index',
    rows: 'Rows',
    size: 'Size',
    share: 'Share',
}

const tables: SqliteTableUsage[] = [
    { name: 'messages', kind: 'table', bytes: 4096, rows: 100 },
    { name: 'idx_messages_session', kind: 'index', bytes: 2048, rows: 100 },
]

describe('StorageUsageBreakdown', () => {
    it('renders one row per object with kind, size, rows and share', () => {
        render(<StorageUsageBreakdown tables={tables} databaseBytes={8192} labels={labels} />)

        expect(screen.getByTestId('storage-breakdown')).toBeInTheDocument()
        expect(screen.getByText('Itemized usage')).toBeInTheDocument()
        expect(screen.getByText('messages')).toBeInTheDocument()
        expect(screen.getByText('idx_messages_session')).toBeInTheDocument()

        const tableRow = screen.getByTestId('storage-breakdown-row-messages')
        expect(tableRow).toHaveTextContent('Table')
        expect(tableRow).toHaveTextContent('4 KB')
        expect(tableRow).toHaveTextContent('50%')
        expect(tableRow).toHaveTextContent('100')

        const indexRow = screen.getByTestId('storage-breakdown-row-idx_messages_session')
        expect(indexRow).toHaveTextContent('Index')
        expect(indexRow).toHaveTextContent('2 KB')
        expect(indexRow).toHaveTextContent('25%')
    })
})
