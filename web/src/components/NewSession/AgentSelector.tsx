import { AGENT_FLAVORS, DEPRECATED_FLAVORS, getFlavorLabel } from '@hapi/protocol'
import type { AgentType } from './types'
import { useTranslation } from '@/lib/use-translation'

export function AgentSelector(props: {
    agent: AgentType
    isDisabled: boolean
    onAgentChange: (value: AgentType) => void
}) {
    const { t } = useTranslation()
    const isDeprecated = (DEPRECATED_FLAVORS as readonly string[]).includes(props.agent)

    return (
        <div className="flex flex-col gap-1.5 px-3 py-3">
            <label className="text-xs font-medium text-[var(--app-hint)]">
                {t('newSession.agent')}
            </label>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
                {AGENT_FLAVORS.map((agentType) => (
                    <label
                        key={agentType}
                        className="flex items-center gap-1.5 cursor-pointer"
                    >
                        <input
                            type="radio"
                            name="agent"
                            value={agentType}
                            checked={props.agent === agentType}
                            onChange={() => props.onAgentChange(agentType)}
                            disabled={props.isDisabled}
                            className="accent-[var(--app-link)]"
                        />
                        <span className="text-sm">{getFlavorLabel(agentType)}</span>
                    </label>
                ))}
            </div>
            {isDeprecated && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    Gemini CLI ends service June 18 — consider switching to Antigravity.
                </p>
            )}
        </div>
    )
}
