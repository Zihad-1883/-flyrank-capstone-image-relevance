/**
 * Images Zod Validation Schemas
 * 
 * Defines Zod schema definitions for structured vision response metadata (ImageTagSchema),
 * upload request validation, and query parameters.
 */

import { z } from "zod";

export const ImageTagSchema = z.object({
    subject: z.string().min(1, "Subject is required"),
    category: z.string().min(1, "Category is required"),
    attributes: z.array(z.string()).min(1, "Attributes are required"),
    caption: z.string().min(1, "Caption is required"),
    confidence: z.number().min(0, "Confidence is required").max(1, "Confidence is required"),
});

export type ImageTag = z.infer<typeof ImageTagSchema>;

export function parseAndValidateTag(rawText: string): ImageTag | null {
    let parsedJson: unknown;

    try {
        const cleaned = rawText.replace(/```json|```/g, '').trim();
        parsedJson = JSON.parse(cleaned);
    } catch (err) {
        console.error('Failed to parse AI response as JSON:', rawText);
        return null;
    }

    const result = ImageTagSchema.safeParse(parsedJson);

    if (!result.success) {
        console.error('AI response failed schema validation:', result.error);
        return null;
    }

    return result.data;
}