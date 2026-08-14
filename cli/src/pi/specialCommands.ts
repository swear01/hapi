/**
 * Pi built-in commands that exist in the pi TUI but cannot run through HAPI
 * (pi only runs as `pi --mode rpc` with piped stdio; these commands need the
 * interactive TUI). Typing them in web today passes the literal text to the
 * LLM as an ordinary prompt — silently doing nothing. Intercepting them with
 * an explicit message makes the failure visible instead.
 */
export const PI_TERMINAL_ONLY_COMMANDS = [
    'login',
    'logout',
    'llama',
    'scoped-models',
    'settings',
    'resume',
    'new',
    'name',
    'tree',
    'trust',
    'fork',
    'clone',
    'copy',
    'export',
    'import',
    'share',
    'reload',
    'hotkeys',
    'changelog',
    'quit',
] as const;

export type PiTerminalOnlyCommand = (typeof PI_TERMINAL_ONLY_COMMANDS)[number];

export type PiSpecialCommand =
    | { type: 'compact'; instructions?: string }
    | { type: 'session' }
    | { type: 'model'; modelId?: string }
    | { type: 'help' }
    | { type: 'unsupported'; name: string };

const PI_TERMINAL_ONLY_SET: ReadonlySet<string> = new Set<string>(PI_TERMINAL_ONLY_COMMANDS);

/**
 * Parse a user message that targets a Pi built-in command.
 *
 * Returns null for anything that is not a recognized Pi built-in (including
 * extension commands, /skill:name, prompt templates, and plain prose starting
 * with `/`), so those keep flowing through the normal prompt path.
 */
export function parsePiSpecialCommand(message: string): PiSpecialCommand | null {
    const trimmed = message.trim();
    if (!trimmed.startsWith('/')) return null;
    // Pi commands are case-insensitive in the TUI; match on the lowercased
    // line but slice args from the original text to preserve their case.
    const lower = trimmed.toLowerCase();
    const nameMatch = /^\/[a-z0-9:_-]+/.exec(lower);
    if (!nameMatch) return null;

    const name = nameMatch[0].slice(1);
    const args = trimmed.slice(nameMatch[0].length).trim();
    switch (name) {
        case 'compact':
            return { type: 'compact', ...(args ? { instructions: args } : {}) };
        case 'session':
            return { type: 'session' };
        case 'model':
            return { type: 'model', ...(args ? { modelId: args } : {}) };
        case 'help':
            return { type: 'help' };
        default:
            return PI_TERMINAL_ONLY_SET.has(name)
                ? { type: 'unsupported', name }
                : null;
    }
}
