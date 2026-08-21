import { useQuery } from '@tanstack/react-query'
import type { ApiClient } from '@/api/client'
import type { SessionReasoningEffortOption } from '@/types/api'
import { queryKeys } from '@/lib/query-keys'

export function useSessionReasoningEffortOptions(args: {
    api: ApiClient | null
    sessionId?: string | null
    model?: string | null
    enabled?: boolean
}): {
    options: SessionReasoningEffortOption[]
    currentValue: string | null
    isLoading: boolean
    error: string | null
} {
    const enabled = Boolean(args.enabled && args.api && args.sessionId)
    const query = useQuery({
        queryKey: args.sessionId
            ? queryKeys.sessionReasoningEffortOptions(args.sessionId, args.model)
            : ['session-reasoning-effort-options', 'unknown'] as const,
        queryFn: async () => {
            if (!args.api || !args.sessionId) throw new Error('Session unavailable')
            return await args.api.getSessionReasoningEffortOptions(args.sessionId)
        },
        enabled,
        staleTime: 30_000,
        retry: false,
    })

    return {
        options: query.data?.options ?? [],
        currentValue: query.data?.currentValue ?? null,
        isLoading: query.isLoading,
        error: query.data?.success === false
            ? (query.data.error ?? 'Failed to load session effort options')
            : query.error instanceof Error ? query.error.message : null,
    }
}
