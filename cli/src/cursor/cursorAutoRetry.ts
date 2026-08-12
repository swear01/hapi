export const CURSOR_AUTO_RETRY_LIMIT = 3;

const RETRYABLE_CURSOR_ERROR = /(?:Error: (?:T|RetriableError): \[(?:canceled|deadline_exceeded|unavailable)\]|http\/(?:1\.1|2)|connection (?:reset|stalled|closed)|timed? out after|\btimeout\b)/i;
const INLINE_CURSOR_ERROR = /^[ \t]*Error: (?:T|RetriableError):/im;

export function isRetryableCursorError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return RETRYABLE_CURSOR_ERROR.test(message);
}

export function stripRetryableCursorError(text: string): string | null {
    const marker = INLINE_CURSOR_ERROR.exec(text);
    if (!marker || !isRetryableCursorError(text.slice(marker.index))) return null;
    return text.slice(0, marker.index).trimEnd();
}
