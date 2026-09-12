export type SessionProjectMetadata = {
    path?: string | null
    worktree?: {
        basePath?: string | null
        worktreePath?: string | null
    } | null
}

function usesWindowsSeparators(path: string): boolean {
    return /^[A-Za-z]:[\\/]/.test(path) || /^\\\\/.test(path)
}

function stripTrailingSeparators(path: string): string {
    if (!usesWindowsSeparators(path)) {
        if (/^\/+$/u.test(path)) return '/'
        return path.replace(/\/+$/u, '')
    }
    if (/^[A-Za-z]:[\\/]+$/u.test(path)) return path.slice(0, 3)
    return path.replace(/[\\/]+$/u, '')
}

function normalizePathForCompare(path: string): string {
    const stripped = stripTrailingSeparators(path)
    return usesWindowsSeparators(path) ? stripped.replace(/\\/gu, '/') : stripped
}

function pathIsUnder(parent: string, child: string): boolean {
    const parentNorm = normalizePathForCompare(parent)
    const childNorm = normalizePathForCompare(child)
    return childNorm === parentNorm || childNorm.startsWith(`${parentNorm}/`)
}

export function resolveSessionGroupDirectory(source: SessionProjectMetadata): string {
    const path = source.path ?? ''
    const basePath = source.worktree?.basePath ?? ''
    const worktreePath = source.worktree?.worktreePath ?? ''
    if (!basePath && !path) return 'Other'
    if (!basePath) return stripTrailingSeparators(path)
    if (!path) return stripTrailingSeparators(basePath)

    const normalizedBase = stripTrailingSeparators(basePath)
    if (pathIsUnder(normalizedBase, path)) return normalizedBase
    if (!worktreePath || !pathIsUnder(normalizedBase, worktreePath)) return normalizedBase

    const baseNorm = normalizePathForCompare(normalizedBase)
    const worktreeNorm = normalizePathForCompare(worktreePath)
    const pathNorm = normalizePathForCompare(path)
    const suffix = worktreeNorm.slice(baseNorm.length)
    if (!suffix) return normalizedBase

    const suffixIndex = pathNorm.lastIndexOf(`${suffix}/`)
    if (suffixIndex !== -1) {
        const logicalRoot = pathNorm.slice(0, suffixIndex)
        return usesWindowsSeparators(path) ? logicalRoot.replace(/\//gu, '\\') : logicalRoot
    }
    if (pathNorm.endsWith(suffix)) {
        const logicalRoot = pathNorm.slice(0, -suffix.length) || normalizedBase
        return usesWindowsSeparators(path) ? logicalRoot.replace(/\//gu, '\\') : logicalRoot
    }
    return normalizedBase
}

export function getSessionProjectPath(metadata: SessionProjectMetadata | null | undefined): string | null {
    if (metadata?.worktree && !metadata.worktree.basePath?.trim()) return null
    const directory = resolveSessionGroupDirectory(metadata ?? {})
    return directory === 'Other' || !directory.trim() ? null : directory
}

export function getSessionProjectLabel(directory: string): string {
    if (directory === 'Other') return directory
    const parts = directory.split(/[\\/]+/u).filter(Boolean)
    if (parts.length === 0) return directory
    if (parts.length === 1) return parts[0]
    return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`
}
