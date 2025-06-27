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
            prompt: "A beautiful pixel art illustration of a mystical cave, viewed from the inside looking out. The cave's rocky, dark blue silhouette frames the scene at the top and sides. The ground is a desolate, rocky terrain. The opening of the cave reveals a breathtaking, deep blue night sky filled with a dense field of brilliant white stars and a glowing central galaxy or nebula. The atmosphere is serene, magical, and vast."
        });
        return { data: result };
    } catch (e) {
        console.error('Error calling image generation flow:', e);
        return { error: 'Could not generate cave image.' };
    }
}
