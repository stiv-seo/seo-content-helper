'use server';

/**
 * @fileOverview Analyzes content topic and target country, compares it against
 * existing indexed data, and identifies areas for improvement using AI.
 *
 * - contentBenchmark - A function that handles the content benchmarking process.
 * - ContentBenchmarkInput - The input type for the contentBenchmark function.
 * - ContentBenchmarkOutput - The return type for the contentBenchmark function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentBenchmarkInputSchema = z.object({
  topic: z.string().describe('The topic of the content.'),
  country: z.string().describe('The target country for the content.'),
  content: z.string().optional().describe('The content to be analyzed, if available.'),
  tone: z.string().optional().describe('The desired tone of the content.'),
  voice: z.string().optional().describe('The desired voice of the content.'),
  writingStyle: z.string().optional().describe('The desired writing style of the content.'),
});
export type ContentBenchmarkInput = z.infer<typeof ContentBenchmarkInputSchema>;

const ContentBenchmarkOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the content and suggestions for improvement.'),
  primaryKeyword: z.string().optional().describe('Suggested primary keyword.'),
  secondaryKeywords: z.array(z.string()).optional().describe('Suggested secondary keywords.'),
  lsiKeywords: z.array(z.string()).optional().describe('Suggested LSI keywords.'),
});
export type ContentBenchmarkOutput = z.infer<typeof ContentBenchmarkOutputSchema>;

export async function contentBenchmark(input: ContentBenchmarkInput): Promise<ContentBenchmarkOutput> {
  return contentBenchmarkFlow(input);
}

const analyzeContentTool = ai.defineTool({
  name: 'analyzeContent',
  description: 'Analyzes content based on topic and country to identify areas for improvement.',
  inputSchema: z.object({
    topic: z.string().describe('The topic of the content.'),
    country: z.string().describe('The target country for the content.'),
    content: z.string().optional().describe('The content to be analyzed, if available.'),
  }),
  outputSchema: z.string().describe('The analysis of the content and suggestions for improvement.'),
}, async (input) => {
  // Placeholder implementation for content analysis. Replace with actual analysis logic.
  return `Analysis of content for topic: ${input.topic} in ${input.country}.  Current content: ${input.content ?? 'Not provided'}`;
});

const suggestKeywordsTool = ai.defineTool({
  name: 'suggestKeywords',
  description: 'Suggests primary, secondary, and LSI keywords with search volume and ranking difficulty.',
  inputSchema: z.object({
    topic: z.string().describe('The topic of the content.'),
    country: z.string().describe('The target country for the content.'),
  }),
  outputSchema: z.object({
    primaryKeyword: z.string().optional().describe('Suggested primary keyword.'),
    secondaryKeywords: z.array(z.string()).optional().describe('Suggested secondary keywords.'),
    lsiKeywords: z.array(z.string()).optional().describe('Suggested LSI keywords.'),
  }),
}, async (input) => {
  // Placeholder implementation for keyword suggestion. Replace with actual keyword suggestion logic.
  return {
    primaryKeyword: `primary keyword for ${input.topic}`,
    secondaryKeywords: [`secondary keyword 1 for ${input.topic}`, `secondary keyword 2 for ${input.topic}`],
    lsiKeywords: [`lsi keyword 1 for ${input.topic}`, `lsi keyword 2 for ${input.topic}`],
  };
});

const prompt = ai.definePrompt({
  name: 'contentBenchmarkPrompt',
  tools: [analyzeContentTool, suggestKeywordsTool],
  input: {schema: ContentBenchmarkInputSchema},
  output: {schema: ContentBenchmarkOutputSchema},
  prompt: `You are an SEO expert. The user wants to optimize content for the topic "{{topic}}" in "{{country}}".

  Analyze the content using the analyzeContent tool, and suggest keywords using the suggestKeywords tool.

  Desired tone: {{tone}}
  Desired voice: {{voice}}
  Desired writing style: {{writingStyle}}

  Provide a comprehensive analysis and keyword suggestions to improve search engine ranking.
  `,
});

const contentBenchmarkFlow = ai.defineFlow(
  {
    name: 'contentBenchmarkFlow',
    inputSchema: ContentBenchmarkInputSchema,
    outputSchema: ContentBenchmarkOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
