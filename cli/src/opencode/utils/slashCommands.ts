import { OPENCODE_PERMISSION_MODES } from '@hapi/protocol/modes';
import type { OpencodePermissionMode } from '@hapi/protocol/types';
import type { SlashCommand } from '@/modules/common/slashCommands';

export type OpencodeSlashResolution =
    | { kind: 'passthrough' }
    | {
        kind: 'handled';
        message: string;
        updates?: {
            permissionMode?: OpencodePermissionMode;
            model?: string | null;
            modelReasoningEffort?: string | null;
        };
    }
    | {
        kind: 'replace';
        text: string;
        message?: string;
        updates?: {
            permissionMode?: OpencodePermissionMode;
            model?: string | null;
            modelReasoningEffort?: string | null;
        };
    };

export function resolveOpencodeSlashCommand(
    text: string,
    state: {
        commands?: readonly SlashCommand[];
        permissionMode: OpencodePermissionMode;
        model?: string | null;
        modelReasoningEffort?: string | null;
    }
): OpencodeSlashResolution {
    const match = /^\s*\/([a-z0-9:_-]+)(?:\s+([\s\S]*))?$/i.exec(text);
    if (!match) return { kind: 'passthrough' };

    const command = match[1]?.toLowerCase();
    const rest = match[2]?.trim() ?? '';
    if (!command) return { kind: 'passthrough' };

    const custom = state.commands?.find((candidate) =>
        candidate.source !== 'builtin' && candidate.name.toLowerCase() === command
    );
    if (custom?.content) {
        return {
            kind: 'replace',
            text: rest ? `${custom.content}\n\nUser arguments: ${rest}` : custom.content,
            message: `Expanded /${custom.name}`
        };
    }

    if (command === 'plan') {
        const lowerRest = rest.toLowerCase();
        if (lowerRest === 'off' || lowerRest === 'default' || lowerRest === 'exit' || lowerRest === 'disable') {
            return {
                kind: 'handled',
                message: 'OpenCode plan mode disabled',
                updates: { permissionMode: 'default' }
            };
        }
        if (rest) {
            return {
                kind: 'replace',
                text: rest,
                message: 'OpenCode plan mode enabled',
                updates: { permissionMode: 'plan' }
            };
        }
        return {
            kind: 'handled',
            message: 'OpenCode plan mode enabled',
            updates: { permissionMode: 'plan' }
        };
    }

    if (command === 'default') {
        return {
            kind: 'handled',
            message: 'OpenCode permission mode set to default',
            updates: { permissionMode: 'default' }
        };
    }

    if (command === 'status') {
        return {
            kind: 'handled',
            message: [
                'OpenCode status',
                `permission: ${state.permissionMode}`,
                `model: ${state.model ?? 'default'}`,
                `reasoning: ${state.modelReasoningEffort ?? 'default'}`
            ].join('\n')
        };
    }

    if (command === 'model') {
        if (!rest) {
            return { kind: 'handled', message: `OpenCode model: ${state.model ?? 'default'}` };
        }
        const model = rest === 'auto' || rest === 'default' ? null : rest;
        return {
            kind: 'handled',
            message: `OpenCode model set to ${model ?? 'default'}`,
            updates: { model }
        };
    }

    if (command === 'reasoning' || command === 'effort') {
        if (!rest) {
            return {
                kind: 'handled',
                message: `OpenCode reasoning effort: ${state.modelReasoningEffort ?? 'default'}`
            };
        }
        if (rest === 'default' || rest === 'auto') {
            return {
                kind: 'handled',
                message: 'OpenCode reasoning effort set to default',
                updates: { modelReasoningEffort: null }
            };
        }
        return {
            kind: 'handled',
            message: `OpenCode reasoning effort set to ${rest}`,
            updates: { modelReasoningEffort: rest }
        };
    }

    if (command === 'permissions' || command === 'permission') {
        if (!rest) {
            return {
                kind: 'handled',
                message: `OpenCode permission mode: ${state.permissionMode}`
            };
        }
        if (!(OPENCODE_PERMISSION_MODES as readonly string[]).includes(rest)) {
            return {
                kind: 'handled',
                message: `Unknown OpenCode permission mode: ${rest}. Supported: ${OPENCODE_PERMISSION_MODES.join(', ')}.`
            };
        }
        return {
            kind: 'handled',
            message: `OpenCode permission mode set to ${rest}`,
            updates: { permissionMode: rest as OpencodePermissionMode }
        };
    }

    if (command === 'clear' || command === 'compact') {
        return {
            kind: 'handled',
            message: `/${command} is not yet supported in HAPI OpenCode sessions.`
        };
    }

    if (command === 'help') {
        return {
            kind: 'handled',
            message: [
                'Supported OpenCode slash commands:',
                '/plan [prompt] — enable plan mode, optionally send prompt',
                '/plan off — return to default permission mode',
                '/default — return to default permission mode',
                '/status — show current OpenCode session config',
                '/model [name|default] — show or set model',
                '/reasoning [effort|default] — show or set reasoning effort',
                '/permissions [' + OPENCODE_PERMISSION_MODES.join('|') + '] — show or set permission mode',
                '/clear, /compact — not yet supported in HAPI OpenCode sessions',
                'Custom /commands from ~/.config/opencode/command or .opencode/command are expanded before sending.'
            ].join('\n')
        };
    }

    return { kind: 'passthrough' };
}
