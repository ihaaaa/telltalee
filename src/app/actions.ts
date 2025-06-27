'use server';

import { analyzeUserInput, type AnalyzeUserInputInput, type AnalyzeUserInputOutput } from '@/ai/flows/analyze-user-input';
import { generateImage, type GenerateImageOutput } from '@/ai/flows/generate-image-flow';
import { z } from 'zod';

const FormSchema = z.object({
  userInput: z.string(),
});

type AnalysisResult = {
  data?: AnalyzeUserInputOutput;
  error?: string;
};

export async function getAnalysis(
  input: AnalyzeUserInputInput
): Promise<AnalysisResult> {
  const parsedInput = FormSchema.safeParse(input);

  if (!parsedInput.success) {
    return { error: 'Invalid input provided.' };
  }

  try {
    const result = await analyzeUserInput(parsedInput.data);
    return { data: result };
  } catch (e) {
    console.error('Error calling AI flow:', e);
    return { error: 'The Oracle seems to be resting. Please try again in a moment.' };
  }
}

type ImageResult = {
    data?: GenerateImageOutput;
    error?: string;
}

export async function getCaveImage(): Promise<ImageResult> {
    try {
        const result = await generateImage({
            prompt: "A beautiful pixel art illustration of a mystical cave. The cave walls are dark rock with orange and purple highlights. The path is made of stone tiles, leading towards the opening. Bright, glowing cyan crystals line the sides of the path. In the distance, through the cave opening, a mountain silhouetted against a starry night sky is visible. The overall mood is magical and serene."
        });
        return { data: result };
    } catch (e) {
        console.error('Error calling image generation flow:', e);
        return { error: 'Could not generate cave image.' };
    }
}
