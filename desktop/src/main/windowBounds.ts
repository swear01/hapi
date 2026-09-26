import type { LauncherConfig } from '../shared'

type Bounds = NonNullable<LauncherConfig['windowBounds']>
type WorkArea = { x: number; y: number; width: number; height: number }

export function resolveWindowBounds(
    bounds: Bounds,
    displays: WorkArea[],
    primary: WorkArea
): Bounds {
    if (bounds.x === undefined || bounds.y === undefined) return bounds

    const visible = displays.some((display) => (
        bounds.x! < display.x + display.width
        && bounds.x! + bounds.width > display.x
        && bounds.y! < display.y + display.height
        && bounds.y! + bounds.height > display.y
    ))
    if (visible) return bounds

    return {
        ...bounds,
        x: Math.round(primary.x + (primary.width - bounds.width) / 2),
        y: Math.round(primary.y + (primary.height - bounds.height) / 2)
    }
}
