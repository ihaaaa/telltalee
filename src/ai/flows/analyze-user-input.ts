'use server';

/**
 * @fileOverview An AI agent that analyzes user input to provide insights into their mental state and detect crisis.
 *
 * - analyzeUserInput - A function that handles the user input analysis process.
 * - AnalyzeUserInputInput - The input type for the analyzeUserInput function.
 * - AnalyzeUserInputOutput - The return type for the analyzeUserInput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserInputInputSchema = z.object({
  userInput: z
    .string()
    .describe('The user input describing their current feelings or situation.'),
});
export type AnalyzeUserInputInput = z.infer<typeof AnalyzeUserInputInputSchema>;

const AnalyzeUserInputOutputSchema = z.object({
  sentimentAnalysis: z
    .string()
    .describe('The sentiment analysis of the user input.'),
  crisisDetected: z
    .boolean()
    .describe('Whether or not a crisis state is detected.'),
  advice: z.string().describe('Tailored advice based on the analysis.'),
  resources: z.string().describe('Curated resources for mental wellbeing.'),
});
export type AnalyzeUserInputOutput = z.infer<typeof AnalyzeUserInputOutputSchema>;

export async function analyzeUserInput(input: AnalyzeUserInputInput): Promise<AnalyzeUserInputOutput> {
  return analyzeUserInputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserInputPrompt',
  input: {schema: AnalyzeUserInputInputSchema},
  output: {schema: AnalyzeUserInputOutputSchema},
  prompt: `You are a mental health expert analyzing user input to provide insights and detect crisis situations.

  Analyze the user input and determine the sentiment.
  Detect if the user is in a crisis state.
  Provide tailored advice and resources for mental wellbeing.

  User Input: {{{userInput}}}
  \nOutput in JSON format:
  `,
});

const analyzeUserInputFlow = ai.defineFlow(
  {
    name: 'analyzeUserInputFlow',
    inputSchema: AnalyzeUserInputInputSchema,
    outputSchema: AnalyzeUserInputOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
