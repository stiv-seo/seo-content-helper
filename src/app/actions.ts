'use server';

import { contentBenchmark, type ContentBenchmarkInput, type ContentBenchmarkOutput } from '@/ai/flows/content-benchmark';
import { generateTitlesHeaders, type GenerateTitlesHeadersInput, type GenerateTitlesHeadersOutput } from '@/ai/flows/title-header-generation';
import type { AnalysisResults, SeoFormValues } from '@/lib/types';

// Helper function to extract keyword text from "keyword (volumen: X, dificultad: Y)" format
function extractKeyword(keywordWithMeta: string | undefined): string {
  if (!keywordWithMeta) return '';
  return keywordWithMeta.split(' (')[0];
}

export async function performFullAnalysisAction(
  values: SeoFormValues
): Promise<AnalysisResults> {
  try {
    const benchmarkInput: ContentBenchmarkInput = {
      topic: values.topic,
      country: values.country,
      content: values.content,
      tone: values.tone,
      voice: values.voice,
      writingStyle: values.writingStyle,
    };

    const benchmarkResult: ContentBenchmarkOutput = await contentBenchmark(benchmarkInput);

    let titlesHeadersResult: GenerateTitlesHeadersOutput | undefined;

    // Prepare content for title/header generation
    const contentForTitles = values.content || benchmarkResult.analysis || `Contenido sobre ${values.topic}.`;
    
    // Extract only the keyword text for title generation
    const primaryKeywordForTitles = extractKeyword(benchmarkResult.primaryKeyword);
    const secondaryKeywordsForTitles = (benchmarkResult.secondaryKeywords || []).map(kw => extractKeyword(kw)).join(', ');
    const lsiKeywordsForTitles = (benchmarkResult.lsiKeywords || []).map(kw => extractKeyword(kw)).join(', ');


    const titlesInput: GenerateTitlesHeadersInput = {
      topic: values.topic,
      country: values.country,
      content: contentForTitles,
      primaryKeyword: primaryKeywordForTitles,
      secondaryKeywords: secondaryKeywordsForTitles,
      lsiKeywords: lsiKeywordsForTitles,
      tone: values.tone || 'neutral', 
      voice: values.voice || 'informativa', 
      writingStyle: values.writingStyle || 'claro', 
    };
    
    titlesHeadersResult = await generateTitlesHeaders(titlesInput);
    
    return {
      benchmark: benchmarkResult,
      titlesHeaders: titlesHeadersResult,
    };

  } catch (error) {
    console.error('Error in performFullAnalysisAction:', error);
    if (error instanceof Error) {
      // It's good to provide a more user-friendly error message in Spanish
      let userMessage = 'Ocurrió un error desconocido durante el análisis.';
      if (error.message.includes('deadline')) {
        userMessage = 'La solicitud tardó demasiado tiempo en procesarse. Inténtalo de nuevo.';
      } else if (error.message.toLowerCase().includes('api key') || error.message.toLowerCase().includes('auth')) {
        userMessage = 'Hubo un problema de autenticación con el servicio de IA. Por favor, verifica la configuración.';
      } else {
         userMessage = `Error al procesar la solicitud: ${error.message}`;
      }
      throw new Error(userMessage);
    }
    throw new Error('Ocurrió un error desconocido durante el análisis.');
  }
}
