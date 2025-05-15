'use server';

import { contentBenchmark, type ContentBenchmarkInput, type ContentBenchmarkOutput } from '@/ai/flows/content-benchmark';
import { generateTitlesHeaders, type GenerateTitlesHeadersInput, type GenerateTitlesHeadersOutput } from '@/ai/flows/title-header-generation';
import type { AnalysisResults, SeoFormValues } from '@/lib/types';

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
    
    // Ensure primaryKeyword is a string, even if undefined from benchmarkResult
    const primaryKeywordForTitles = benchmarkResult.primaryKeyword || '';

    const titlesInput: GenerateTitlesHeadersInput = {
      topic: values.topic,
      country: values.country,
      content: contentForTitles,
      primaryKeyword: primaryKeywordForTitles,
      secondaryKeywords: (benchmarkResult.secondaryKeywords || []).join(', '),
      lsiKeywords: (benchmarkResult.lsiKeywords || []).join(', '),
      tone: values.tone || 'neutral', // Default if not provided
      voice: values.voice || 'informativa', // Default if not provided
      writingStyle: values.writingStyle || 'claro', // Default if not provided
    };
    
    titlesHeadersResult = await generateTitlesHeaders(titlesInput);
    
    return {
      benchmark: benchmarkResult,
      titlesHeaders: titlesHeadersResult,
    };

  } catch (error) {
    console.error('Error in performFullAnalysisAction:', error);
    if (error instanceof Error) {
      throw new Error(`Error al procesar la solicitud: ${error.message}`);
    }
    throw new Error('Ocurrió un error desconocido durante el análisis.');
  }
}
