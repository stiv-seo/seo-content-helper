import { Sparkles } from 'lucide-react';

export function SeoHeader() {
  return (
    <header className="py-6 px-4 md:px-8 border-b">
      <div className="container mx-auto flex items-center gap-2">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">SEO Maestro</h1>
      </div>
    </header>
  );
}
