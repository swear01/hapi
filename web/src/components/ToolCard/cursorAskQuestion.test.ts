import { describe, expect, it } from 'vitest';
import { isCursorAskQuestionToolName, parseCursorAskQuestionInput } from '@/components/ToolCard/cursorAskQuestion';
import { isAskUserQuestionToolName } from '@/components/ToolCard/askUserQuestion';

describe('cursorAskQuestion', () => {
    it('is recognized as an ask-question tool', () => {
        expect(isCursorAskQuestionToolName('CursorAskQuestion')).toBe(true);
        expect(isAskUserQuestionToolName('CursorAskQuestion')).toBe(true);
    });

    it('parses Cursor ask_question payload shape', () => {
        const parsed = parseCursorAskQuestionInput({
            toolCallId: 'q-1',
            title: 'Choose approach',
            questions: [
                {
                    id: 'approach',
                    prompt: 'Which approach?',
                    allowMultiple: false,
                    options: [
                        { id: 'a', label: 'Option A' },
                        { id: 'b', label: 'Option B' }
                    ]
                }
            ]
        });

        expect(parsed.questions).toHaveLength(1);
        expect(parsed.questions[0]).toMatchObject({
            header: 'Choose approach',
            question: 'Which approach?',
            multiSelect: false,
            options: [
                { label: 'Option A', description: null },
                { label: 'Option B', description: null }
            ]
        });
    });

    it('returns empty questions for invalid input', () => {
        expect(parseCursorAskQuestionInput(null).questions).toEqual([]);
        expect(parseCursorAskQuestionInput({}).questions).toEqual([]);
    });
});
