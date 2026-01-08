"use client";

import type { SymptomAnalysisOutput } from "@/ai/flows/analyze-symptoms-and-suggest-relief";
import {
  AlertTriangle,
  ClipboardList,
  Heart,
  Home,
  Pill,
  Search,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnalysisResultsProps {
  analysis: SymptomAnalysisOutput;
  onStartOver: () => void;
}

const renderList = (text: string | undefined, title: string) => {
  if (!text || text.trim() === "") return null;
  const items = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "" && !line.toLowerCase().startsWith(title.toLowerCase()));

  if (items.length === 0) return <p>{text}</p>;

  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, index) => (
        <li key={index} className="text-card-foreground/80">
          {item.replace(/^[-*–•]\s*|\d+\.\s*/, "")}
        </li>
      ))}
    </ul>
  );
};

export function AnalysisResults({ analysis, onStartOver }: AnalysisResultsProps) {
  const {
    personalSummary,
    immediateRelief,
    symptomAnalysis,
    otcReliefOptions,
    selfCareTips,
    medicalCareAlert,
    disclaimer,
  } = analysis;

  const alertText = medicalCareAlert || "";
  const urgentCareIndex = alertText.toLowerCase().indexOf('seek urgent or emergency care if:');
  const doctorSoonText = urgentCareIndex !== -1 ? alertText.substring(0, urgentCareIndex) : alertText;
  const urgentCareText = urgentCareIndex !== -1 ? alertText.substring(urgentCareIndex) : "";

  return (
    <div className="p-6 md:p-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-primary">
              <ClipboardList className="h-5 w-5" />
              Personal Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-card-foreground/80">{personalSummary}</p>
          </CardContent>
        </Card>

        <Accordion type="multiple" defaultValue={["relief", "analysis"]} className="w-full space-y-6">
          <Card>
             <AccordionItem value="relief" className="border-b-0">
                <AccordionTrigger className="p-6 text-lg font-semibold text-primary hover:no-underline">
                   <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5" /> Immediate Relief
                   </div>
                </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {renderList(immediateRelief, 'immediate relief')}
              </AccordionContent>
            </AccordionItem>
          </Card>
          
          <Card>
            <AccordionItem value="analysis" className="border-b-0">
                <AccordionTrigger className="p-6 text-lg font-semibold text-primary hover:no-underline">
                   <div className="flex items-center gap-3">
                     <Search className="h-5 w-5" /> Symptom Analysis
                   </div>
                </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {renderList(symptomAnalysis, 'symptom analysis')}
              </AccordionContent>
            </AccordionItem>
          </Card>

          <Card>
            <AccordionItem value="otc" className="border-b-0">
                <AccordionTrigger className="p-6 text-lg font-semibold text-primary hover:no-underline">
                   <div className="flex items-center gap-3">
                    <Pill className="h-5 w-5" /> OTC Relief Options
                   </div>
                </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {renderList(otcReliefOptions, 'otc relief options')}
              </AccordionContent>
            </AccordionItem>
          </Card>
          
          <Card>
             <AccordionItem value="self-care" className="border-b-0">
                <AccordionTrigger className="p-6 text-lg font-semibold text-primary hover:no-underline">
                   <div className="flex items-center gap-3">
                     <Home className="h-5 w-5" /> Self-Care & Ongoing Tips
                   </div>
                </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {renderList(selfCareTips, 'self-care')}
              </AccordionContent>
            </AccordionItem>
          </Card>
        </Accordion>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              When to Seek Medical Care
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {doctorSoonText && (
               <Alert>
                  <Heart className="h-4 w-4" />
                  <AlertTitle>See a doctor soon if:</AlertTitle>
                  <AlertDescription>{renderList(doctorSoonText, "see a doctor soon if:")}</AlertDescription>
               </Alert>
             )}
              {urgentCareText && (
               <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Seek urgent or emergency care if:</AlertTitle>
                  <AlertDescription>{renderList(urgentCareText, "seek urgent or emergency care if:")}</AlertDescription>
               </Alert>
             )}
          </CardContent>
        </Card>

        <Separator />

        <div className="space-y-4 text-center">
          <p className="text-xs text-muted-foreground">{disclaimer}</p>
          <Button onClick={onStartOver}>Start New Analysis</Button>
        </div>
      </div>
    </div>
  );
}
