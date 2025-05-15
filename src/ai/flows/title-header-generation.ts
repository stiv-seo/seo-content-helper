'use server';
/**
 * @fileOverview Generates suitable titles and headers (H1 tags) for articles.
 *
 * - generateTitlesHeaders - A function that generates titles and headers.
 * - GenerateTitlesHeadersInput - The input type for the generateTitlesHeaders function.
 * - GenerateTitlesHeadersOutput - The return type for the generateTitlesHeaders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTitlesHeadersInputSchema = z.object({
  topic: z.string().describe('The topic of the content.'),
  country: z.string().describe('The target country for the content.'),
  content: z.string().describe('The content to analyze.'),
  primaryKeyword: z.string().describe('The primary keyword for the content.'),
  secondaryKeywords: z.string().describe('Secondary keywords related to the content, separated by commas.'),
  lsiKeywords: z.string().describe('LSI (Latent Semantic Indexing) keywords, separated by commas.'),
  tone: z.string().describe('The desired tone of the content (e.g., formal, informal, humorous).'),
  voice: z.string().describe('The desired voice of the content (e.g., authoritative, friendly, professional).'),
  writingStyle: z.string().describe('The desired writing style of the content (e.g., descriptive, persuasive, narrative).'),
});

export type GenerateTitlesHeadersInput = z.infer<typeof GenerateTitlesHeadersInputSchema>;

const GenerateTitlesHeadersOutputSchema = z.object({
  titleSuggestions: z.array(z.string()).describe('Suggested titles for the content.'),
  headerSuggestions: z.array(z.string()).describe('Suggested H1 headers for the content.'),
});

export type GenerateTitlesHeadersOutput = z.infer<typeof GenerateTitlesHeadersOutputSchema>;

export async function generateTitlesHeaders(input: GenerateTitlesHeadersInput): Promise<GenerateTitlesHeadersOutput> {
  return generateTitlesHeadersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTitlesHeadersPrompt',
  input: {schema: GenerateTitlesHeadersInputSchema},
  output: {schema: GenerateTitlesHeadersOutputSchema},
  prompt: `You are an expert SEO copywriter specializing in generating engaging and optimized titles and headers for articles.

  Based on the provided content details, target country, SEO keywords, and desired style preferences, generate a list of suitable titles and H1 headers.

  Topic: {{{topic}}}
  Country: {{{country}}}
  Content: {{{content}}}
  Primary Keyword: {{{primaryKeyword}}}
  Secondary Keywords: {{{secondaryKeywords}}}
  LSI Keywords: {{{lsiKeywords}}}
  Tone: {{{tone}}}
  Voice: {{{voice}}}
  Writing Style: {{{writingStyle}}}

  Titles should be attention-grabbing and incorporate the primary keyword.
  Headers (H1 tags) should be clear, concise, and relevant to the content.

  Provide title suggestions and H1 header suggestions as arrays of strings.

  Output the title and header suggestions in JSON format.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateTitlesHeadersFlow = ai.defineFlow(
  {
    name: 'generateTitlesHeadersFlow',
    inputSchema: GenerateTitlesHeadersInputSchema,
    outputSchema: GenerateTitlesHeadersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
