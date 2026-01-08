"use client";

import { useState } from "react";
import type { SymptomAnalysisOutput } from "@/ai/flows/analyze-symptoms-and-suggest-relief";
import { SymptomForm } from "@/components/symptom-form";
import { AnalysisResults } from "@/components/analysis-results";
import { HealthScribeIcon } from "@/components/icons";

export default function Home() {
  const [analysis, setAnalysis] = useState<SymptomAnalysisOutput | null>(null);
  const [view, setView] = useState<"form" | "results">("form");
  const [formKey, setFormKey] = useState(Date.now());

  const handleAnalysisComplete = (data: SymptomAnalysisOutput) => {
    setAnalysis(data);
    setView("results");
  };

  const handleStartOver = () => {
    setAnalysis(null);
    setView("form");
    setFormKey(Date.now()); // Change key to force re-mount
  };

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3 text-primary">
            <HealthScribeIcon className="h-10 w-10" />
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              HealthScribe AI
            </h1>
          </div>
          <p className="max-w-2xl text-muted-foreground md:text-lg">
            Your friendly AI symptom analyzer for immediate relief guidance and
            safe OTC options.
          </p>
        </header>

        <div className="relative w-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow-lg transition-all duration-500">
          {view === "form" && (
            <SymptomForm
              key={formKey}
              onAnalysisComplete={handleAnalysisComplete}
            />
          )}
          {view === "results" && analysis && (
            <AnalysisResults
              analysis={analysis}
              onStartOver={handleStartOver}
            />
          )}
        </div>

        <footer className="text-center text-sm text-muted-foreground">
          <p>Built with Next.js and Generative AI.</p>
          <p className="mt-1 font-semibold text-destructive">
            For educational purposes only. Not a substitute for professional
            medical advice.
          </p>
        </footer>
      </div>
    </main>
  );
}
