import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { StorageUsageBreakdown } from '@/components/settings/StorageUsageBreakdown'
import { StorageUsagePie } from '@/components/settings/StorageUsagePie.tsx'
import { SettingsPageContent, SettingsRow, SettingsSection } from '@/components/settings/SettingsPrimitives'
import { useAppContext } from '@/lib/app-context'
import { formatFileSize } from '@/lib/file-metadata'
import { queryKeys } from '@/lib/query-keys'
import { useTranslation } from '@/lib/use-translation'

export default function SettingsStoragePage() {
    const { api } = useAppContext()
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const [vacuumResult, setVacuumResult] = useState<string | null>(null)

    const query = useQuery({
        queryKey: queryKeys.sqliteStorage,
        queryFn: async () => {
            if (!api) throw new Error('API unavailable')
            return await api.getSqliteStorageUsage()
        },
        enabled: Boolean(api),
        staleTime: 0,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const vacuumMutation = useMutation({
        mutationFn: async () => {
            if (!api) throw new Error('API unavailable')
            return await api.vacuumStorage()
        },
        onSuccess: (result) => {
            setVacuumResult(
                t('settings.storage.vacuumDone', {
                    size: formatFileSize(result.reclaimedBytes) ?? '0 B',
                    before: formatFileSize(result.beforeBytes) ?? '0 B',
                    after: formatFileSize(result.afterBytes) ?? '0 B',
                }),
            )
            void queryClient.invalidateQueries({ queryKey: queryKeys.sqliteStorage })
        },
        onError: (error) => {
            setVacuumResult(
                t('settings.storage.vacuumError', {
                    message: error instanceof Error ? error.message : String(error),
                }),
            )
        },
    })

    function confirmVacuum() {
        setVacuumResult(null)
        if (window.confirm(t('settings.storage.vacuumConfirm'))) {
            vacuumMutation.mutate()
        }
    }

    const data = query.data
    const freelistPercent =
        data && data.databaseBytes > 0 ? Math.round((data.freelistBytes / data.databaseBytes) * 1000) / 10 : 0

    return (
        <SettingsPageContent description={t('settings.storage.description')}>
            {query.isLoading || query.error ? (
                <SettingsSection>
                    {query.isLoading ? <SettingsRow label={t('settings.storage.loading')} /> : null}
                    {query.error ? (
                        <SettingsRow
                            label={t('settings.storage.error')}
                            description={query.error instanceof Error ? query.error.message : undefined}
                        />
                    ) : null}
                </SettingsSection>
            ) : null}
            {data ? (
                <>
                    <SettingsSection>
                        <StorageUsagePie
                            usage={{
                                usedBytes: data.usedBytes,
                                freelistBytes: data.freelistBytes,
                                walBytes: data.walBytes,
                                shmBytes: data.shmBytes,
                            }}
                            totalBytes={data.totalBytes}
                            path={data.path}
                            labels={{
                                title: t('settings.storage.chartTitle'),
                                empty: t('settings.storage.chartEmpty'),
                                used: t('settings.storage.used'),
                                freelist: t('settings.storage.freelist'),
                                wal: t('settings.storage.wal'),
                                shm: t('settings.storage.shm'),
                                total: t('settings.storage.total'),
                                path: t('settings.storage.path'),
                            }}
                        />
                        <div className="mt-3 px-2 text-sm text-[var(--app-hint)]" data-testid="storage-summary">
                            {t('settings.storage.usageSummary', {
                                used: formatFileSize(data.usedBytes) ?? '0 B',
                                free: formatFileSize(data.freelistBytes) ?? '0 B',
                                percent: `${freelistPercent}%`,
                            })}
                        </div>
                    </SettingsSection>
                    {data.tables.length > 0 ? (
                        <SettingsSection>
                            <StorageUsageBreakdown
                                tables={data.tables}
                                databaseBytes={data.databaseBytes}
                                labels={{
                                    title: t('settings.storage.breakdown'),
                                    table: t('settings.storage.kindTable'),
                                    index: t('settings.storage.kindIndex'),
                                    rows: t('settings.storage.rows'),
                                    size: t('settings.storage.breakdownSize'),
                                    share: t('settings.storage.breakdownShare'),
                                }}
                            />
                        </SettingsSection>
                    ) : null}
                    <SettingsSection>
                        <div className="flex items-center justify-between gap-3 px-3 py-3">
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-[var(--app-fg)]">
                                    {t('settings.storage.vacuumTitle')}
                                </div>
                                <div className="mt-0.5 text-xs text-[var(--app-hint)]">
                                    {t('settings.storage.vacuumHint')}
                                </div>
                                {vacuumResult ? (
                                    <div
                                        className="mt-1 text-xs text-[var(--app-link)]"
                                        data-testid="storage-vacuum-result"
                                    >
                                        {vacuumResult}
                                    </div>
                                ) : null}
                            </div>
                            <button
                                type="button"
                                onClick={confirmVacuum}
                                disabled={vacuumMutation.isPending}
                                className="shrink-0 rounded-lg bg-[var(--app-button)] px-3 py-2 text-sm font-medium text-[var(--app-button-text)] disabled:opacity-50"
                            >
                                {vacuumMutation.isPending
                                    ? t('settings.storage.vacuuming')
                                    : t('settings.storage.vacuum')}
                            </button>
                        </div>
                    </SettingsSection>
                </>
            ) : null}
            <button
                type="button"
                onClick={() => void query.refetch()}
                disabled={query.isFetching}
                className="rounded-lg bg-[var(--app-button)] px-3 py-2 text-sm font-medium text-[var(--app-button-text)] disabled:opacity-50"
            >
                {query.isFetching ? t('settings.storage.refreshing') : t('settings.storage.refresh')}
            </button>
        </SettingsPageContent>
    )
}
