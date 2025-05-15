
'use client';

import type { AnalysisResults } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Lightbulb, ListChecks, Zap, SearchCheck, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ResultsDisplayProps {
  results: AnalysisResults | null;
  isLoading: boolean;
  error: string | null;
}

function KeywordsList({ title, keywords, icon: Icon }: { title: string; keywords?: string[]; icon: React.ElementType }) {
  if (!keywords || keywords.length === 0) {
    return null;
  }
  return (
    <div className="mt-4">
      <h4 className="text-md font-semibold mb-2 flex items-center"><Icon className="w-4 h-4 mr-2 text-primary" />{title}</h4>
      <div className="flex flex-wrap gap-2">
        {keywords.map((kw, index) => (
          <Badge key={index} variant="secondary" className="text-sm px-3 py-1">{kw}</Badge>
        ))}
      </div>
    </div>
  );
}

export function ResultsDisplay({ results, isLoading, error }: ResultsDisplayProps) {
  const handleDownload = () => {
    if (!results) return;

    let content = `# Resultados del Análisis SEO Content Helper\n\n`;
    content += `Fecha del análisis: ${new Date().toLocaleString()}\n\n`;

    if (results.benchmark) {
      content += `## Análisis de Contenido y Benchmarking\n\n`;
      content += `### Análisis General:\n${results.benchmark.analysis || 'N/A'}\n\n`;

      if (results.benchmark.primaryKeyword) {
        content += `### Palabra Clave Principal Sugerida:\n- ${results.benchmark.primaryKeyword}\n\n`;
      }
      if (results.benchmark.secondaryKeywords && results.benchmark.secondaryKeywords.length > 0) {
        content += `### Palabras Clave Secundarias Sugeridas:\n${results.benchmark.secondaryKeywords.map(kw => `- ${kw}`).join('\n')}\n\n`;
      }
      if (results.benchmark.lsiKeywords && results.benchmark.lsiKeywords.length > 0) {
        content += `### Palabras Clave LSI Sugeridas:\n${results.benchmark.lsiKeywords.map(kw => `- ${kw}`).join('\n')}\n\n`;
      }
    }

    if (results.benchmark?.serpAnalysis) {
      content += `## Análisis de Resultados de Búsqueda (SERP)\n\n${results.benchmark.serpAnalysis || 'N/A'}\n\n`;
    }

    if (results.titlesHeaders) {
      content += `## Sugerencias de Títulos y Encabezados (H1)\n\n`;
      if (results.titlesHeaders.titleSuggestions && results.titlesHeaders.titleSuggestions.length > 0) {
        content += `### Títulos Sugeridos:\n${results.titlesHeaders.titleSuggestions.map(t => `- ${t}`).join('\n')}\n\n`;
      } else {
        content += `### Títulos Sugeridos:\n N/A\n\n`;
      }
      if (results.titlesHeaders.headerSuggestions && results.titlesHeaders.headerSuggestions.length > 0) {
        content += `### Encabezados H1 Sugeridos:\n${results.titlesHeaders.headerSuggestions.map(h => `- ${h}`).join('\n')}\n\n`;
      } else {
        content += `### Encabezados H1 Sugeridos:\n N/A\n\n`;
      }
    }
    
    const topic = results.benchmark?.topic || "analisis";
    const country = results.benchmark?.country || "general";
    const safeTopic = topic.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();
    const safeCountry = country.replace(/[^a-z0-9_.-]/gi, '_').toLowerCase();
    const filename = `analisis_seo_${safeTopic}_${safeCountry}.md`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-8 shadow-lg animate-pulse">
        <CardHeader>
          <CardTitle className="h-6 bg-muted rounded w-3/4"></CardTitle>
          <CardDescription className="h-4 bg-muted rounded w-1/2"></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full mt-2"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8 border-destructive bg-destructive/10 shadow-lg">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Error en el Análisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!results || (!results.benchmark && !results.titlesHeaders)) {
    return (
      <Card className="mt-8 border-dashed border-gray-300 shadow-sm">
        <CardContent className="p-10 text-center">
          <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Ingresa los detalles de tu contenido y haz clic en "Analizar Contenido" para ver las sugerencias.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleDownload} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Descargar Resultados
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['item-benchmark', 'item-serp', 'item-titles']} className="w-full">
        {results.benchmark && (
          <AccordionItem value="item-benchmark">
            <AccordionTrigger>
              <CardTitle className="text-xl flex items-center text-primary">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Análisis de Contenido y Benchmarking
              </CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-4">
                <p className="text-foreground/90 whitespace-pre-wrap">{results.benchmark.analysis}</p>
                <KeywordsList title="Palabra Clave Principal Sugerida" keywords={results.benchmark.primaryKeyword ? [results.benchmark.primaryKeyword] : []} icon={Zap} />
                <KeywordsList title="Palabras Clave Secundarias Sugeridas" keywords={results.benchmark.secondaryKeywords} icon={Zap} />
                <KeywordsList title="Palabras Clave LSI Sugeridas" keywords={results.benchmark.lsiKeywords} icon={Zap} />
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        )}

        {results.benchmark?.serpAnalysis && (
          <AccordionItem value="item-serp">
            <AccordionTrigger>
              <CardTitle className="text-xl flex items-center text-primary">
                <SearchCheck className="w-5 h-5 mr-2" />
                Análisis de Resultados de Búsqueda (SERP)
              </CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-4">
                <p className="text-foreground/90 whitespace-pre-wrap">{results.benchmark.serpAnalysis}</p>
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        )}

        {results.titlesHeaders && (results.titlesHeaders.titleSuggestions?.length > 0 || results.titlesHeaders.headerSuggestions?.length > 0) && (
          <AccordionItem value="item-titles">
            <AccordionTrigger>
              <CardTitle className="text-xl flex items-center text-primary">
                <ListChecks className="w-5 h-5 mr-2" />
                Sugerencias de Títulos y Encabezados (H1)
              </CardTitle>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent className="pt-4">
                {results.titlesHeaders.titleSuggestions && results.titlesHeaders.titleSuggestions.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Títulos Sugeridos:</h3>
                    <ul className="list-disc list-inside space-y-1 text-foreground/90">
                      {results.titlesHeaders.titleSuggestions.map((title, index) => (
                        <li key={`title-${index}`}>{title}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {results.titlesHeaders.headerSuggestions && results.titlesHeaders.headerSuggestions.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Encabezados H1 Sugeridos:</h3>
                    <ul className="list-disc list-inside space-y-1 text-foreground/90">
                      {results.titlesHeaders.headerSuggestions.map((header, index) => (
                        <li key={`header-${index}`}>{header}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
