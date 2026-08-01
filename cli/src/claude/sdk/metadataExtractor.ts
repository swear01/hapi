/**
 * SDK Metadata Extractor
 * Captures available tools and slash commands from Claude SDK initialization
 */

import { query } from './query'
import type { SDKSystemMessage } from './types'
import { logger } from '@/ui/logger'
import type { SkillSummary } from '@/modules/common/skills'

export interface SDKMetadata {
    tools?: string[]
    slashCommands?: string[]
}

export function classifyClaudeSlashCatalog(
    names: readonly string[] | undefined,
    discoveredSkills: readonly SkillSummary[]
): { commands: string[]; skills: SkillSummary[] } {
    const skillsByName = new Map(discoveredSkills.map((skill) => [skill.name, skill]))
    const commands: string[] = []
    const skills: SkillSummary[] = []

    for (const rawName of names ?? []) {
        const name = rawName.trim()
        if (!name) continue
        const localName = name.slice(name.lastIndexOf(':') + 1)
        const skill = skillsByName.get(name) ?? skillsByName.get(localName)
        if (skill) {
            skills.push({ ...skill, name })
        } else {
            commands.push(name)
        }
    }

    return { commands, skills }
}

/**
 * Extract SDK metadata by running a minimal query and capturing the init message
 * @returns SDK metadata containing tools and slash commands
 */
export async function extractSDKMetadata(cwd?: string): Promise<SDKMetadata> {
    const abortController = new AbortController()
    
    try {
        logger.debug('[metadataExtractor] Starting SDK metadata extraction')
        
        // Run SDK with minimal tools allowed
        const sdkQuery = query({
            prompt: 'hello',
            options: {
                cwd,
                allowedTools: ['Bash(echo)'],
                maxTurns: 1,
                abort: abortController.signal
            }
        })

        // Wait for the first system message which contains tools and slash commands
        for await (const message of sdkQuery) {
            if (message.type === 'system' && message.subtype === 'init') {
                const systemMessage = message as SDKSystemMessage
                
                const metadata: SDKMetadata = {
                    tools: systemMessage.tools,
                    slashCommands: systemMessage.slash_commands
                }
                
                logger.debug('[metadataExtractor] Captured SDK metadata:', metadata)
                
                // Abort the query since we got what we need
                abortController.abort()
                
                return metadata
            }
        }
        
        logger.debug('[metadataExtractor] No init message received from SDK')
        return {}
        
    } catch (error) {
        // Check if it's an abort error (expected)
        if (error instanceof Error && error.name === 'AbortError') {
            logger.debug('[metadataExtractor] SDK query aborted after capturing metadata')
            return {}
        }
        logger.debug('[metadataExtractor] Error extracting SDK metadata:', error)
        return {}
    }
}

/**
 * Extract SDK metadata asynchronously without blocking
 * Fires the extraction and updates metadata when complete
 */
export function extractSDKMetadataAsync(onComplete: (metadata: SDKMetadata) => void, cwd?: string): void {
    extractSDKMetadata(cwd)
        .then(metadata => {
            if (metadata.tools || metadata.slashCommands) {
                onComplete(metadata)
            }
        })
        .catch(error => {
            logger.debug('[metadataExtractor] Async extraction failed:', error)
        })
}
