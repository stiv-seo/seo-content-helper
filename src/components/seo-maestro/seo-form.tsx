
'use client';

import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SeoFormValues } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface SeoFormProps {
  form: UseFormReturn<SeoFormValues>;
  onSubmit: (values: SeoFormValues) => void;
  isLoading: boolean;
}

const toneOptions = ["Amigable", "Profesional", "Humorístico", "Serio", "Conversacional", "Informativo", "Persuasivo", "Urgente", "Empático", "Neutro"];
const voiceOptions = ["Experto", "Cercano", "Autoritario", "Inspirador", "Didáctico", "Corporativa", "Juvenil", "Guía"];
const writingStyleOptions = ["Narrativo", "Descriptivo", "Expositivo", "Argumentativo", "Técnico", "Creativo", "Periodístico", "Claro y conciso"];
const funnelStepOptions = [
  { value: "tofu", label: "TOFU / Descubrimiento" },
  { value: "mofu", label: "MOFU / Consideración" },
  { value: "bofu", label: "BOFU / Decisión" },
];

export function SeoForm({ form, onSubmit, isLoading }: SeoFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tema Principal</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Marketing de contenidos para startups" {...field} />
              </FormControl>
              <FormDescription>
                El tema central sobre el que quieres generar contenido.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>País de Destino</FormLabel>
              <FormControl>
                <Input placeholder="Ej: México" {...field} />
              </FormControl>
              <FormDescription>
                El país al que se dirige tu contenido.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contentObjective"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivo del Contenido (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Educar sobre X, Generar leads para Y" {...field} />
              </FormControl>
              <FormDescription>
                ¿Qué buscas lograr con este contenido?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAudience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Público Objetivo (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Emprendedores de SaaS, Madres jóvenes" {...field} />
              </FormControl>
              <FormDescription>
                ¿A quién te diriges específicamente?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
            control={form.control}
            name="funnelStep"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Etapa del Funnel (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una etapa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {funnelStepOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  ¿En qué parte del embudo de conversión se sitúa este contenido?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenido Existente (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Pega aquí tu contenido existente para análisis y benchmarking..."
                  className="resize-y min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Si tienes un borrador o artículo existente, pégalo aquí.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tono (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tono" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {toneOptions.map(option => (
                      <SelectItem key={option} value={option.toLowerCase()}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="voice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Voz (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una voz" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {voiceOptions.map(option => (
                      <SelectItem key={option} value={option.toLowerCase()}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="writingStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estilo de Escritura (Opcional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estilo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {writingStyleOptions.map(option => (
                      <SelectItem key={option} value={option.toLowerCase()}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analizando...
            </>
          ) : (
            'Analizar Contenido'
          )}
        </Button>
      </form>
    </Form>
  );
}
