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
import type { SeoFormValues } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface SeoFormProps {
  form: UseFormReturn<SeoFormValues>;
  onSubmit: (values: SeoFormValues) => void;
  isLoading: boolean;
}

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
                <FormControl>
                  <Input placeholder="Ej: Informal, Persuasivo" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="Ej: Experto, Amigable" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="Ej: Narrativo, Descriptivo" {...field} />
                </FormControl>
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
