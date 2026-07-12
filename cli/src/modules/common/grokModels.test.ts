import { describe, expect, test } from 'vitest'
import { buildGrokModelsArgs, parseGrokModelsOutput } from './grokModels'

describe('Grok model discovery', () => {
    test('runs the official model listing command in the selected cwd', () => {
        expect(buildGrokModelsArgs('/home/user/project')).toEqual([
            '--cwd', '/home/user/project', 'models'
        ])
    })

    test('parses available and default models from Grok Build output', () => {
        expect(parseGrokModelsOutput(`
You are logged in with grok.com.

Default model: grok-4.5

Available models:
  * grok-4.5 (default)
  * custom-fast
`)).toEqual({
            availableModels: [
                { modelId: 'grok-4.5' },
                { modelId: 'custom-fast' }
            ],
            currentModelId: 'grok-4.5'
        })
    })
})
