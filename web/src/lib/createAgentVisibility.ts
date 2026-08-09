import { CREATABLE_AGENT_FLAVORS, type AgentFlavor } from '@hapi/protocol'

export type CreateAgentVisibility = Record<AgentFlavor, boolean>

const STORAGE_KEY = 'hapi:newSession:agentVisibility:v1'

export function loadCreateAgentVisibility(): CreateAgentVisibility {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
        return Object.fromEntries(CREATABLE_AGENT_FLAVORS.map((agent) => [agent, stored?.[agent] !== false])) as CreateAgentVisibility
    } catch {
        return Object.fromEntries(CREATABLE_AGENT_FLAVORS.map((agent) => [agent, true])) as CreateAgentVisibility
    }
}

export function saveCreateAgentVisibility(visibility: CreateAgentVisibility): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(visibility))
    } catch {}
}
