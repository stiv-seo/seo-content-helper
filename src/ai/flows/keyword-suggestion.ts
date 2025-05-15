// keyword-suggestion.ts
'use server';
/**
 * @fileOverview Keyword suggestion flow.
 *
 * This file defines a Genkit flow for suggesting primary, secondary, and LSI keywords
 * with search volume and ranking difficulty based on the content provided by the user.
 * All responses will be in Spanish.
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
  primaryKeyword: z.string().describe('La palabra clave principal para el contenido (formato: "keyword (volumen: X, dificultad: Y)"). En ESPAÑOL.'),
  secondaryKeywords: z.array(z.string()).describe('Palabras clave secundarias para el contenido (formato: "keyword (volumen: X, dificultad: Y)"). En ESPAÑOL.'),
  lsiKeywords: z.array(z.string()).describe('Palabras clave LSI (Latent Semantic Indexing) para el contenido (formato: "keyword (volumen: X, dificultad: Y)"). En ESPAÑOL.'),
});

export type KeywordSuggestionOutput = z.infer<typeof KeywordSuggestionOutputSchema>;

export async function suggestKeywords(input: KeywordSuggestionInput): Promise<KeywordSuggestionOutput> {
  return keywordSuggestionFlow(input);
}

const keywordSuggestionPrompt = ai.definePrompt({
  name: 'keywordSuggestionPrompt',
  input: {schema: KeywordSuggestionInputSchema},
  output: {schema: KeywordSuggestionOutputSchema},
  prompt: `Eres un experto en SEO especializado en investigación de palabras clave.
  Toda tu respuesta DEBE estar en ESPAÑOL.
  Dado el siguiente tema de contenido, país de destino, contenido, tono, voz y estilo de escritura, sugiere una palabra clave principal, palabras clave secundarias y palabras clave LSI.
  Para cada palabra clave, proporciona un volumen de búsqueda mensual estimado y una estimación de la dificultad de ranking (por ejemplo, baja, media, alta).

  Tema: {{topic}}
  País: {{country}}
  Contenido: {{{content}}}
  Tono: {{tone}}
  Voz: {{voice}}
  Estilo de Escritura: {{writingStyle}}

  Proporciona las palabras clave en el siguiente formato JSON exacto:

  {
    "primaryKeyword": "palabra clave (volumen: [VOLUMEN ESTIMADO], dificultad: [DIFICULTAD ESTIMADA])",
    "secondaryKeywords": ["palabra clave secundaria 1 (volumen: [VOLUMEN ESTIMADO], dificultad: [DIFICULTAD ESTIMADA])", "palabra clave secundaria 2 (volumen: [VOLUMEN ESTIMADO], dificultad: [DIFICULTAD ESTIMADA])"],
    "lsiKeywords": ["palabra clave LSI 1 (volumen: [VOLUMEN ESTIMADO], dificultad: [DIFICULTAD ESTIMADA])", "palabra clave LSI 2 (volumen: [VOLUMEN ESTIMADO], dificultad: [DIFICULTAD ESTIMADA])"]
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
