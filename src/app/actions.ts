'use server';

import { analyzeUserInput, type AnalyzeUserInputInput, type AnalyzeUserInputOutput } from '@/ai/flows/analyze-user-input';
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
