'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { seoFormSchema, type SeoFormValues, type AnalysisResults } from '@/lib/types';
import { SeoHeader } from '@/components/seo-maestro/seo-header';
import { SeoForm } from '@/components/seo-maestro/seo-form';
import { ResultsDisplay } from '@/components/seo-maestro/results-display';
import { performFullAnalysisAction } from './actions';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SeoMaestroPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoFormSchema),
    defaultValues: {
      topic: '',
      country: '',
      content: '',
      tone: '',
      voice: '',
      writingStyle: '',
    },
  });

  const onSubmit = async (values: SeoFormValues) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const analysisData = await performFullAnalysisAction(values);
      setResults(analysisData);
      toast({
        title: "Análisis Completado",
        description: "Tus sugerencias de SEO están listas.",
        variant: "default",
      });
    } catch (e: any) {
      const errorMessage = e.message || 'Ocurrió un error al procesar tu solicitud.';
      setError(errorMessage);
      toast({
        title: "Error en el Análisis",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SeoHeader />
      <main className="flex-grow container mx-auto px-4 md:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl">Configura tu Análisis</CardTitle>
                <CardDescription>
                  Proporciona los detalles para optimizar tu contenido.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SeoForm form={form} onSubmit={onSubmit} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <ResultsDisplay results={results} isLoading={isLoading} error={error} />
          </div>
        </div>
      </main>
      <footer className="py-6 px-4 md:px-8 border-t mt-12">
        <div className="container mx-auto text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} SEO Content Helper. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
