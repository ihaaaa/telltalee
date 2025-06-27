'use server';

/**
 * @fileOverview An AI agent that analyzes user input to provide insights into their mental state and detect crisis. It acts as a patient therapist, asking for more details if the user input is insufficient.
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
    .describe('The user input describing their current feelings or situation. This may contain a history of the conversation.'),
});
export type AnalyzeUserInputInput = z.infer<typeof AnalyzeUserInputInputSchema>;

const AnalyzeUserInputOutputSchema = z.object({
  sentimentAnalysis: z
    .string()
    .describe('The sentiment analysis of the user input. Responds with "Awaiting more details" if input is insufficient.'),
  crisisDetected: z
    .boolean()
    .describe('Whether or not a crisis state is detected.'),
  advice: z.string().describe('Tailored advice based on the analysis. If not enough information is provided, this will contain a question asking for more details.'),
  resources: z.string().describe('Curated resources for mental wellbeing, formatted as a list. Empty if more details are needed.'),
  resourceTips: z.string().describe('A brief, encouraging tip on how to approach these resources. Empty if more details are needed.'),
});
export type AnalyzeUserInputOutput = z.infer<typeof AnalyzeUserInputOutputSchema>;

export async function analyzeUserInput(input: AnalyzeUserInputInput): Promise<AnalyzeUserInputOutput> {
  return analyzeUserInputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserInputPrompt',
  input: {schema: AnalyzeUserInputInputSchema},
  output: {schema: AnalyzeUserInputOutputSchema},
  prompt: `You are the Mindful Oracle, a patient and empathetic therapist. Your goal is to provide insightful guidance to users about their mental state.

Analyze the user's input, which may be a single message or a short conversation.

If the user's latest message is very short or lacks detail (e.g., less than 15 words or vague), and you need more information to provide a helpful analysis, your primary goal is to gently encourage them to share more. In this case, your 'advice' should be a kind and patient question prompting them for more elaboration. Do not provide a full analysis. For example: "Thank you for sharing. Could you tell me a little more about what's on your mind?" or "I'm here to listen. What's been happening that's making you feel this way?". Set 'sentimentAnalysis' to "Awaiting more details", 'crisisDetected' to false, 'resources' to an empty string, and 'resourceTips' to an empty string.

If the input is detailed enough for a full analysis, then:
- Determine the sentiment.
- Detect if the user is in a crisis state.
- Provide tailored, compassionate advice.
- Suggest some resources for mental wellbeing. Format these as a bulleted or numbered list.
- Provide a brief, encouraging tip on how to approach these resources in the 'resourceTips' field. For example: "Take your time with these; even a small step is progress."

Remember to always be patient, supportive, and understanding in your tone.

User Input History:
{{{userInput}}}
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
