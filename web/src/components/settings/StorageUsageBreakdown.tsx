import type { SqliteTableUsage } from '@hapi/protocol/apiTypes'
import { formatFileSize } from '@/lib/file-metadata'
import { formatStoragePercent } from '@/components/settings/storageUsageSlices'

type StorageUsageBreakdownProps = {
    tables: SqliteTableUsage[]
    /** Denominator used for the per-row percentage (physical DB file size). */
    databaseBytes: number
    labels: {
        title: string
        table: string
        index: string
        rows: string
        size: string
        share: string
    }
}

export function StorageUsageBreakdown(props: StorageUsageBreakdownProps) {
    const { tables, databaseBytes, labels } = props
    const denominator = databaseBytes > 0 ? databaseBytes : 1

    return (
        <div data-testid="storage-breakdown">
            <div className="mb-2 text-sm font-medium text-[var(--app-fg)]">{labels.title}</div>
            <div className="overflow-hidden rounded-xl border border-[var(--app-border)]">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[var(--app-divider)] text-left text-xs text-[var(--app-hint)]">
                            <th className="px-3 py-2 font-medium">{labels.size}</th>
                            <th className="px-3 py-2 font-medium">{labels.rows}</th>
                            <th className="px-3 py-2 text-right font-medium">{labels.share}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tables.map((table) => (
                            <tr
                                key={table.name}
                                data-testid={`storage-breakdown-row-${table.name}`}
                                className="border-b border-[var(--app-divider)] last:border-b-0"
                            >
                                <td className="px-3 py-2">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <span
                                            className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                                                table.kind === 'index'
                                                    ? 'bg-[var(--app-secondary-bg)] text-[var(--app-hint)]'
                                                    : 'bg-[var(--app-link)]/10 text-[var(--app-link)]'
                                            }`}
                                        >
                                            {table.kind === 'index' ? labels.index : labels.table}
                                        </span>
                                        <code className="min-w-0 truncate text-xs text-[var(--app-fg)]" title={table.name}>
                                            {table.name}
                                        </code>
                                    </div>
                                </td>
                                <td className="px-3 py-2 tabular-nums text-[var(--app-hint)]">{table.rows}</td>
                                <td className="px-3 py-2 text-right tabular-nums text-[var(--app-fg)]">
                                    {formatFileSize(table.bytes) ?? '0 B'}
                                    <span className="ml-2 text-[var(--app-hint)]">
                                        {formatStoragePercent((table.bytes / denominator) * 100)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
