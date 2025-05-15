'use server';
/**
 * @fileOverview Generates suitable titles and headers (H1 tags) for articles.
 * All responses will be in Spanish.
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
  titleSuggestions: z.array(z.string()).describe('Suggested titles for the content. En ESPAÑOL.'),
  headerSuggestions: z.array(z.string()).describe('Suggested H1 headers for the content. En ESPAÑOL.'),
});

export type GenerateTitlesHeadersOutput = z.infer<typeof GenerateTitlesHeadersOutputSchema>;

export async function generateTitlesHeaders(input: GenerateTitlesHeadersInput): Promise<GenerateTitlesHeadersOutput> {
  return generateTitlesHeadersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTitlesHeadersPrompt',
  input: {schema: GenerateTitlesHeadersInputSchema},
  output: {schema: GenerateTitlesHeadersOutputSchema},
  prompt: `Eres un experto redactor SEO especializado en generar títulos y encabezados atractivos y optimizados para artículos.
  Toda tu respuesta DEBE estar en ESPAÑOL.

  Basándote en los detalles del contenido proporcionado, país de destino, palabras clave SEO y preferencias de estilo deseadas, genera una lista de títulos y encabezados H1 adecuados.

  Tema: {{topic}}
  País: {{country}}
  Contenido: {{{content}}}
  Palabra Clave Principal: {{primaryKeyword}}
  Palabras Clave Secundarias: {{secondaryKeywords}}
  Palabras Clave LSI: {{lsiKeywords}}
  Tono: {{tone}}
  Voz: {{voice}}
  Estilo de Escritura: {{writingStyle}}

  Los títulos deben ser llamativos e incorporar la palabra clave principal.
  Los encabezados (etiquetas H1) deben ser claros, concisos y relevantes para el contenido.

  Proporciona sugerencias de títulos y sugerencias de encabezados H1 como arrays de strings.

  Emite las sugerencias de títulos y encabezados en formato JSON.
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
