import { z } from 'zod';
import type { ContentBenchmarkOutput } from '@/ai/flows/content-benchmark';
import type { GenerateTitlesHeadersOutput } from '@/ai/flows/title-header-generation';

export const seoFormSchema = z.object({
  topic: z.string().min(3, { message: "El tema debe tener al menos 3 caracteres." }),
  country: z.string().min(2, { message: "El país debe tener al menos 2 caracteres." }),
  content: z.string().optional(),
  tone: z.string().optional(),
  voice: z.string().optional(),
  writingStyle: z.string().optional(),
});

export type SeoFormValues = z.infer<typeof seoFormSchema>;

export interface AnalysisResults {
  benchmark?: ContentBenchmarkOutput;
  titlesHeaders?: GenerateTitlesHeadersOutput;
}
