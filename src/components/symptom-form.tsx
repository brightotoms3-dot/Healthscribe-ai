"use client";

import { useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  LoaderCircle,
  User,
} from "lucide-react";
import { getAnalysis } from "@/app/actions";
import { SymptomAnalysisFormSchema } from "@/lib/schemas";
import type { SymptomAnalysisOutput } from "@/ai/flows/analyze-symptoms-and-suggest-relief";
import { countries } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type SymptomFormValues = z.infer<typeof SymptomAnalysisFormSchema>;

const steps = [
  {
    title: "Personal Information",
    icon: User,
    fields: [
      "name",
      "age",
      "gender",
      "country",
      "pregnancyStatus",
    ] as FieldPath<SymptomFormValues>[],
  },
  {
    title: "Health Background",
    icon: HeartPulse,
    fields: [
      "existingMedicalConditions",
      "currentMedications",
      "knownAllergies",
      "lifestyleFactors",
    ] as FieldPath<SymptomFormValues>[],
  },
  {
    title: "Symptom Details",
    icon: Activity,
    fields: [
      "mainSymptom",
      "symptomOnset",
      "symptomFrequency",
      "symptomSeverity",
      "symptomTriggers",
      "additionalSymptoms",
      "previousOccurrence",
      "recentEvents",
      "symptomProgression",
    ] as FieldPath<SymptomFormValues>[],
  },
];

interface SymptomFormProps {
  onAnalysisComplete: (data: SymptomAnalysisOutput) => void;
}

export function SymptomForm({ onAnalysisComplete }: SymptomFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SymptomFormValues>({
    resolver: zodResolver(SymptomAnalysisFormSchema),
    defaultValues: {
      name: "",
      age: undefined,
      gender: "",
      country: "",
      pregnancyStatus: "Not applicable",
      existingMedicalConditions: "",
      currentMedications: "",
      knownAllergies: "",
      lifestyleFactors: "",
      mainSymptom: "",
      symptomOnset: "",
      symptomFrequency: "",
      symptomSeverity: "",
      symptomTriggers: "",
      additionalSymptoms: "",
      previousOccurrence: "",
      recentEvents: "",
      symptomProgression: "",
    },
    mode: "onChange",
  });

  const processStep = async (direction: "next" | "back") => {
    if (direction === "back") {
      setCurrentStep((prev) => prev - 1);
      return;
    }

    const fields = steps[currentStep].fields;
    const isValid = await form.trigger(fields);
    if (isValid) {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const onSubmit = async (data: SymptomFormValues) => {
    setIsSubmitting(true);
    const result = await getAnalysis(data);
    setIsSubmitting(false);

    if (result.success) {
      onAnalysisComplete(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: result.error,
      });
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 md:p-8">
        <div className="space-y-3">
          <Progress value={(currentStep / (steps.length - 1)) * 100} />
          <div className="flex items-center gap-3">
            <StepIcon className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {steps[currentStep].title}
            </h2>
          </div>
        </div>

        {/* Render form fields based on current step */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {currentStep === 0 && (
            <>
              <FormField name="name" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name (Optional)</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField name="age" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl><Input type="number" placeholder="30" {...field} onChange={e => field.onChange(e.target.value === '' ? null : e.target.valueAsNumber)} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="gender" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="country" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {countries.map((c) => (<SelectItem key={c.value} value={c.label}>{c.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="pregnancyStatus" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Pregnancy Status (if applicable)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Not applicable">Not applicable</SelectItem>
                        <SelectItem value="Not pregnant">Not pregnant</SelectItem>
                        <SelectItem value="First trimester">First trimester</SelectItem>
                        <SelectItem value="Second trimester">Second trimester</SelectItem>
                        <SelectItem value="Third trimester">Third trimester</SelectItem>
                        <SelectItem value="Postpartum">Postpartum</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </>
          )}

          {currentStep === 1 && (
            <>
              <FormField name="existingMedicalConditions" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Existing Conditions (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Asthma, Diabetes, Hypertension" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField name="currentMedications" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Paracetamol, vitamins" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField name="knownAllergies" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Known Allergies (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Penicillin, peanuts" {...field} /></FormControl>
                  </FormItem>
                )}
              />
              <FormField name="lifestyleFactors" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lifestyle Factors (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Smoking, stress, sleep quality" {...field} /></FormControl>
                  </FormItem>
                )}
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <FormField name="mainSymptom" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Main Symptom(s)</FormLabel>
                    <FormControl><Input placeholder="e.g., Headache, sore throat" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField name="symptomOnset" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>When did it start?</FormLabel>
                    <FormControl><Input placeholder="e.g., 2 days ago, this morning" {...field} /></FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
               <FormField name="symptomTriggers" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>What makes it better or worse?</FormLabel>
                    <FormControl><Input placeholder="e.g., Lying down, eating spicy food" {...field} /></FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="symptomFrequency" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>How often does it occur?</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger><SelectValue placeholder="Select frequency" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Constant">Constant</SelectItem>
                        <SelectItem value="Comes and goes">Comes and goes</SelectItem>
                        <SelectItem value="Only at certain times">Only at certain times</SelectItem>
                      </SelectContent>
                    </Select>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="symptomSeverity" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger><SelectValue placeholder="Select severity" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Mild">Mild</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Severe">Severe</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField name="previousOccurrence" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Has this happened before?</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger><SelectValue placeholder="Select an option" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Unsure">Unsure</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="symptomProgression" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>How is it progressing?</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                       <FormControl><SelectTrigger><SelectValue placeholder="Select progression" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Improving">Improving</SelectItem>
                        <SelectItem value="Worsening">Worsening</SelectItem>
                        <SelectItem value="Unchanged">Unchanged</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField name="additionalSymptoms" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Additional Symptoms (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Fever, nausea, dizziness" {...field} /></FormControl>
                  </FormItem>
                )}
              />
               <FormField name="recentEvents" control={form.control} render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Recent Events (Optional)</FormLabel>
                    <FormControl><Textarea placeholder="e.g., Recent travel, injury, unusual stress" {...field} /></FormControl>
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => processStep("back")}
            disabled={currentStep === 0 || isSubmitting}
          >
            <ChevronLeft /> Back
          </Button>

          {currentStep < steps.length - 1 && (
            <Button type="button" onClick={() => processStep("next")}>
              Next <ChevronRight />
            </Button>
          )}

          {currentStep === steps.length - 1 && (
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" /> Analyzing...
                </>
              ) : (
                "Get Analysis"
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
