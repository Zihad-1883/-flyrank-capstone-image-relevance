import { describe, it, expect } from 'vitest';
import { parseAndValidateTag } from '../../src/modules/images/images.schema.js';

describe('Images Tag Schema Validation', () => {
    it('successfully parses valid Gemini JSON response', () => {
        const jsonText = JSON.stringify({
            subject: 'Red Fox',
            category: 'Wildlife',
            attributes: ['red', 'woodland'],
            caption: 'A red fox standing in green foliage',
            confidence: 0.95,
        });

        const result = parseAndValidateTag(jsonText);
        expect(result).not.toBeNull();
        expect(result?.subject).toBe('Red Fox');
        expect(result?.confidence).toBe(0.95);
    });

    it('returns null on invalid JSON format', () => {
        const invalidJson = 'Not a json string';
        const result = parseAndValidateTag(invalidJson);
        expect(result).toBeNull();
    });

    it('extracts JSON when wrapped in markdown codeblocks', () => {
        const markdownWrapped = `\`\`\`json
{
  "subject": "Wolf",
  "category": "Wildlife",
  "attributes": ["grey"],
  "caption": "A grey wolf looking ahead",
  "confidence": 0.9
}
\`\`\``;

        const result = parseAndValidateTag(markdownWrapped);
        expect(result).not.toBeNull();
        expect(result?.subject).toBe('Wolf');
    });
});
