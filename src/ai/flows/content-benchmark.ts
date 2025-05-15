
'use server';

/**
 * @fileOverview Analyzes content topic and target country, considers content objective,
 * target audience, and funnel step. It compares content against
 * existing indexed data (including SERP analysis), identifies areas for improvement,
 * suggests keywords, performs a SWOT (DOFA) analysis, and generates all responses in Spanish.
 *
 * - contentBenchmark - A function that handles the content benchmarking process.
 * - ContentBenchmarkInput - The input type for the contentBenchmark function.
 * - ContentBenchmarkOutput - The return type for the contentBenchmark function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContentBenchmarkInputSchema = z.object({
  topic: z.string().describe('El tema del contenido.'),
  country: z.string().describe('El país de destino para el contenido.'),
  content: z.string().optional().describe('El contenido a analizar, si está disponible.'),
  contentObjective: z.string().optional().describe('El objetivo principal del contenido (ej: educar, generar leads).'),
  targetAudience: z.string().optional().describe('El público específico al que se dirige el contenido (ej: emprendedores, madres jóvenes).'),
  funnelStep: z.string().optional().describe('La etapa del embudo de conversión a la que pertenece el contenido (ej: TOFU, MOFU, BOFU).'),
  tone: z.string().optional().describe('El tono deseado del contenido.'),
  voice: z.string().optional().describe('La voz deseada del contenido.'),
  writingStyle: z.string().optional().describe('El estilo de escritura deseado para el contenido.'),
});
export type ContentBenchmarkInput = z.infer<typeof ContentBenchmarkInputSchema>;

const ContentBenchmarkOutputSchema = z.object({
  analysis: z.string().describe('El análisis del contenido y sugerencias de mejora. En ESPAÑOL.'),
  primaryKeyword: z.string().optional().describe('Palabra clave principal sugerida (formato: "keyword (volumen: NÚMERO, dificultad: baja/media/alta)"). En ESPAÑOL.'),
  secondaryKeywords: z.array(z.string()).optional().describe('Palabras clave secundarias sugeridas (formato: "keyword (volumen: NÚMERO, dificultad: baja/media/alta)"). En ESPAÑOL.'),
  lsiKeywords: z.array(z.string()).optional().describe('Palabras clave LSI sugeridas (formato: "keyword (volumen: NÚMERO, dificultad: baja/media/alta)"). En ESPAÑOL.'),
  serpAnalysis: z.string().optional().describe("Hallazgos clave del análisis de los primeros 20 resultados de las SERPs. En ESPAÑOL."),
  dofaAnalysis: z.string().optional().describe('Análisis DOFA (Debilidades, Oportunidades, Fortalezas, Amenazas) basado en toda la información. En ESPAÑOL.'),
});
export type ContentBenchmarkOutput = z.infer<typeof ContentBenchmarkOutputSchema>;

export async function contentBenchmark(input: ContentBenchmarkInput): Promise<ContentBenchmarkOutput> {
  return contentBenchmarkFlow(input);
}

const analyzeContentTool = ai.defineTool({
  name: 'analyzeContent',
  description: 'Analiza el contenido proporcionado basándose en el tema y el país para identificar áreas de mejora.',
  inputSchema: z.object({
    topic: z.string().describe('El tema del contenido.'),
    country: z.string().describe('El país de destino para el contenido.'),
    content: z.string().optional().describe('El contenido a ser analizado, si está disponible.'),
    contentObjective: z.string().optional().describe('El objetivo del contenido.'),
    targetAudience: z.string().optional().describe('El público objetivo.'),
    funnelStep: z.string().optional().describe('La etapa del funnel.'),
  }),
  outputSchema: z.string().describe('El análisis del contenido y sugerencias de mejora. En ESPAÑOL.'),
}, async (input) => {
  // Placeholder implementation for content analysis. Replace with actual analysis logic.
  return `Análisis del contenido para el tema: "${input.topic}" en ${input.country}. Contenido actual: ${input.content ?? 'No proporcionado'}. Objetivo: ${input.contentObjective ?? 'N/A'}. Audiencia: ${input.targetAudience ?? 'N/A'}. Etapa Funnel: ${input.funnelStep ?? 'N/A'}. [Este es un análisis placeholder en ESPAÑOL. Se deben incluir aquí observaciones sobre la calidad, estructura, y relevancia del contenido.]`;
});

const suggestKeywordsTool = ai.defineTool({
  name: 'suggestKeywords',
  description: 'Sugiere palabras clave primarias, secundarias y LSI con volumen de búsqueda estimado y dificultad de ranking. El volumen debe ser un número y la dificultad "baja", "media" o "alta". Toda la respuesta DEBE estar en ESPAÑOL.',
  inputSchema: z.object({
    topic: z.string().describe('El tema del contenido.'),
    country: z.string().describe('El país de destino para el contenido.'),
  }),
  outputSchema: z.object({
    primaryKeyword: z.string().optional().describe('Palabra clave principal sugerida (formato: "keyword (volumen: NÚMERO, dificultad: baja/media/alta)"). En ESPAÑOL.'),
    secondaryKeywords: z.array(z.string()).optional().describe('Palabras clave secundarias sugeridas (formato: "keyword (volumen: NÚMERO, dificultad: baja/media/alta)"). En ESPAÑOL.'),
    lsiKeywords: z.array(z.string()).optional().describe('Palabras clave LSI sugeridas (formato: "keyword (volumen: NÚMERO, dificultad: baja/media/alta)"). En ESPAÑOL.'),
  }),
}, async (input) => {
  // Placeholder implementation for keyword suggestion. Replace with actual keyword suggestion logic.
  return {
    primaryKeyword: `palabra clave principal para ${input.topic} (volumen: 1500, dificultad: media)`,
    secondaryKeywords: [`palabra clave secundaria 1 para ${input.topic} (volumen: 700, dificultad: baja)`, `palabra clave secundaria 2 para ${input.topic} (volumen: 300, dificultad: alta)`],
    lsiKeywords: [`palabra clave LSI 1 para ${input.topic} (volumen: 100, dificultad: baja)`, `palabra clave LSI 2 para ${input.topic} (volumen: 50, dificultad: media)`],
  };
});

const analyzeSERPTool = ai.defineTool({
  name: 'analyzeSERP',
  description: 'Analiza los primeros 20 resultados de las SERPs para un tema y país dados, y devuelve hallazgos clave para el posicionamiento. Toda la respuesta DEBE estar en ESPAÑOL.',
  inputSchema: z.object({
    topic: z.string().describe('El tema para el cual analizar las SERPs.'),
    country: z.string().describe('El país para el cual analizar las SERPs.'),
  }),
  outputSchema: z.string().describe("Un resumen de los hallazgos clave de las SERPs, incluyendo patrones comunes, tipos de contenido dominantes, y oportunidades identificadas. En ESPAÑOL."),
}, async (input) => {
  // Placeholder for actual SERP analysis logic
  return `Análisis SERP para '${input.topic}' en '${input.country}': [Este es un placeholder para los hallazgos de SERP en ESPAÑOL. Se identificarían aquí los tipos de contenido (ej. artículos de blog, videos, páginas de producto), la intención de búsqueda promedio (informativa, transaccional), la autoridad de los dominios principales (estimación), y las brechas de contenido u oportunidades (ej. falta de guías completas, poca información sobre X aspecto específico).]`;
});


const prompt = ai.definePrompt({
  name: 'contentBenchmarkPrompt',
  tools: [analyzeContentTool, suggestKeywordsTool, analyzeSERPTool],
  input: {schema: ContentBenchmarkInputSchema},
  output: {schema: ContentBenchmarkOutputSchema},
  prompt: `Eres un experto SEO y estratega de contenidos. Toda tu respuesta DEBE estar en ESPAÑOL.
  El usuario quiere optimizar contenido para el tema "{{topic}}" en "{{country}}".
  Considera también el objetivo del contenido "{{contentObjective}}", el público objetivo "{{targetAudience}}" y la etapa del funnel "{{funnelStep}}".

  1.  Analiza el contenido proporcionado (si existe) usando la herramienta 'analyzeContent', tomando en cuenta el tema, país, objetivo, audiencia y etapa del funnel.
  2.  Sugiere palabras clave (principal, secundarias, LSI) con su volumen de búsqueda estimado y dificultad de ranking usando la herramienta 'suggestKeywords'. Asegúrate que el formato sea "palabra (volumen: NÚMERO, dificultad: baja/media/alta)". Por ejemplo: "marketing digital (volumen: 2500, dificultad: media)". Las palabras clave DEBEN estar en ESPAÑOL.
  3.  Analiza los primeros 20 resultados de las SERPs para el tema y país dados usando la herramienta 'analyzeSERP'. Identifica patrones, tipos de contenido dominantes y oportunidades de posicionamiento. Los hallazgos DEBEN estar en ESPAÑOL.
  4.  Basándote en toda la información recopilada (análisis de contenido, palabras clave, análisis SERP, objetivo, audiencia, funnel), realiza un análisis DOFA (Debilidades, Oportunidades, Fortalezas, Amenazas) para la estrategia de contenido. Este análisis DOFA debe ser detallado y específico, en ESPAÑOL, y debe guardarse en el campo 'dofaAnalysis'.
  5.  Proporciona un análisis general ('analysis') que resuma los hallazgos clave, cómo el contenido actual se compara (si se proporcionó), y recomendaciones específicas para mejorar el ranking. Este análisis debe integrar los insights del contenido, palabras clave, SERPs y el DOFA. DEBE estar en ESPAÑOL.
  6.  Rellena el campo 'serpAnalysis' con los hallazgos detallados de la herramienta 'analyzeSERP'.
  7.  Asegúrate de que los campos de palabras clave en la salida final sigan el formato "palabra (volumen: NÚMERO, dificultad: baja/media/alta)".

  Tema: {{topic}}
  País: {{country}}
  {{#if contentObjective}}Objetivo del Contenido: {{contentObjective}}{{/if}}
  {{#if targetAudience}}Público Objetivo: {{targetAudience}}{{/if}}
  {{#if funnelStep}}Etapa del Funnel: {{funnelStep}}{{/if}}
  {{#if content}}Contenido existente: {{{content}}}{{/if}}
  {{#if tone}}Tono deseado: {{tone}}{{/if}}
  {{#if voice}}Voz deseada: {{voice}}{{/if}}
  {{#if writingStyle}}Estilo de escritura deseado: {{writingStyle}}{{/if}}

  Proporciona un análisis SEO completo, sugerencias de palabras clave, análisis SERP y un análisis DOFA para mejorar el ranking en motores de búsqueda. Asegúrate de que toda la salida esté en ESPAÑOL y siga el esquema JSON proporcionado.
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
