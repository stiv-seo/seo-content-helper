// keyword-suggestion.ts
'use server';
/**
 * @fileOverview Keyword suggestion flow.
 *
 * This file defines a Genkit flow for suggesting primary, secondary, and LSI keywords
 * with search volume and ranking difficulty based on the content provided by the user.
 *
 * @remarks
 * The flow takes content topic and target country as input.
 *
 * @example
 * ```typescript
 * const result = await suggestKeywords({
 *   topic: 'example topic',
 *   country: 'US',
 *   content: 'example content',
 *   tone: 'friendly',
 *   voice: 'professional',
 *   writingStyle: 'persuasive'
 * });
 * ```
 *
 * @exports suggestKeywords - The main function to trigger the keyword suggestion flow.
 * @exports KeywordSuggestionInput - The input type for the suggestKeywords function.
 * @exports KeywordSuggestionOutput - The output type for the suggestKeywords function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const KeywordSuggestionInputSchema = z.object({
  topic: z.string().describe('The topic of the content.'),
  country: z.string().describe('The target country for the content.'),
  content: z.string().describe('The content to analyze.'),
  tone: z.string().describe('The tone of the content (e.g., formal, informal).'),
  voice: z.string().describe('The voice of the content (e.g., authoritative, friendly).'),
  writingStyle: z.string().describe('The writing style of the content (e.g., persuasive, informative).'),
});

export type KeywordSuggestionInput = z.infer<typeof KeywordSuggestionInputSchema>;

const KeywordSuggestionOutputSchema = z.object({
  primaryKeyword: z.string().describe('The primary keyword for the content, including search volume and ranking difficulty.'),
  secondaryKeywords: z.array(z.string()).describe('Secondary keywords for the content, including search volume and ranking difficulty.'),
  lsiKeywords: z.array(z.string()).describe('LSI (Latent Semantic Indexing) keywords for the content, including search volume and ranking difficulty.'),
});

export type KeywordSuggestionOutput = z.infer<typeof KeywordSuggestionOutputSchema>;

export async function suggestKeywords(input: KeywordSuggestionInput): Promise<KeywordSuggestionOutput> {
  return keywordSuggestionFlow(input);
}

const keywordSuggestionPrompt = ai.definePrompt({
  name: 'keywordSuggestionPrompt',
  input: {schema: KeywordSuggestionInputSchema},
  output: {schema: KeywordSuggestionOutputSchema},
  prompt: `You are an SEO expert specializing in keyword research.
  Given the following content topic, target country, content, tone, voice, and writing style, suggest a primary keyword, secondary keywords, and LSI keywords with their search volume and ranking difficulty.

  Topic: {{{topic}}}
  Country: {{{country}}}
  Content: {{{content}}}
  Tone: {{{tone}}}
  Voice: {{{voice}}}
  Writing Style: {{{writingStyle}}}

  Provide the keywords in the following format:

  {
    "primaryKeyword": "keyword (search volume, ranking difficulty)",
    "secondaryKeywords": ["keyword (search volume, ranking difficulty)", "keyword (search volume, ranking difficulty)"],
    "lsiKeywords": ["keyword (search volume, ranking difficulty)", "keyword (search volume, ranking difficulty)"]
  }
  `,
});

const keywordSuggestionFlow = ai.defineFlow(
  {
    name: 'keywordSuggestionFlow',
    inputSchema: KeywordSuggestionInputSchema,
    outputSchema: KeywordSuggestionOutputSchema,
  },
  async input => {
    const {output} = await keywordSuggestionPrompt(input);
    return output!;
  }
);
