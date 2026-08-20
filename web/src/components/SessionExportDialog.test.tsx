import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ApiClient } from '@/api/client'
import { I18nProvider } from '@/lib/i18n-context'
import { ToastProvider } from '@/lib/toast-context'
import { SessionExportDialog } from './SessionExportDialog'

function renderDialog(api: ApiClient, onClose: () => void) {
    return render(
        <I18nProvider>
            <ToastProvider>
                <SessionExportDialog
                    isOpen={true}
                    onClose={onClose}
                    sessionId="session-1"
                    api={api}
                />
            </ToastProvider>
        </I18nProvider>
    )
}

afterEach(() => cleanup())

describe('SessionExportDialog large export confirmation', () => {
    it('shows count and estimated size, and cancel does not retry or download', async () => {
        const getSessionExport = vi.fn().mockResolvedValue({
            type: 'warning',
            count: 20_001,
            limit: 20_000,
            estimatedBytes: 12_345_678
        })
        const api = { getSessionExport } as unknown as ApiClient
        const onClose = vi.fn()

        renderDialog(api, onClose)
        fireEvent.click(screen.getByRole('button', { name: 'Download' }))

        await waitFor(() => {
            expect(screen.getByText(/20,001/)).toBeInTheDocument()
            expect(screen.getByText(/11\.8 MiB/)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: 'Download anyway' })).toBeInTheDocument()
        })
        expect(getSessionExport).toHaveBeenCalledOnce()
        fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

        expect(onClose).toHaveBeenCalledOnce()
        expect(getSessionExport).toHaveBeenCalledOnce()
    })
})
