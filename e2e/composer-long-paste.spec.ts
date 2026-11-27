import { expect, test, type Locator } from '@playwright/test'

async function paste(input: Locator, text: string) {
    await input.evaluate((element, content) => {
        const clipboardData = new DataTransfer()
        clipboardData.setData('text/plain', content)
        element.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData }))
    }, text)
}

test('keeps both successive long-paste edits in the textarea undo history', async ({ page }) => {
    await page.goto('/e2e-fixtures/codex-fast-theme.html?richMentions=0')
    const input = page.locator('textarea:visible')
    const draft = 'saved draft: '
    const first = 'a'.repeat(5500)
    const second = 'b'.repeat(6000)
    const insert = page.getByRole('button', { name: 'Paste as text' })
    const length = () => input.evaluate(el => (el as HTMLTextAreaElement).value.length)
    await input.focus()
    await page.keyboard.insertText(draft)
    await expect(input).toHaveValue(draft)
    await paste(input, first)
    await insert.click()
    await expect.poll(length).toBe(draft.length + first.length)
    await paste(input, second)
    await insert.click()
    await expect.poll(length).toBe(draft.length + first.length + second.length)
    await page.keyboard.press('ControlOrMeta+z')
    await expect.poll(length).toBe(draft.length + first.length)
    await page.keyboard.press('ControlOrMeta+z')
    await expect(input).toHaveValue(draft)
    await page.keyboard.press('ControlOrMeta+Shift+z')
    await expect.poll(length).toBe(draft.length + first.length)
    await page.keyboard.press('ControlOrMeta+Shift+z')
    await expect.poll(length).toBe(draft.length + first.length + second.length)
})
