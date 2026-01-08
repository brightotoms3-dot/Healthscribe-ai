"use server";

import {
  analyzeSymptomsAndSuggestRelief,
  type SymptomAnalysisInput,
  type SymptomAnalysisOutput,
} from "@/ai/flows/analyze-symptoms-and-suggest-relief";
import { SymptomAnalysisFormSchema } from "@/lib/schemas";

export async function getAnalysis(
  data: SymptomAnalysisInput
): Promise<
  { success: true; data: SymptomAnalysisOutput } | { success: false; error: string }
> {
  const validatedFields = SymptomAnalysisFormSchema.safeParse(data);

  if (!validatedFields.success) {
    console.error("Validation failed:", validatedFields.error.flatten());
    return { success: false, error: "Invalid form data. Please check your inputs." };
  }

  try {
    const analysis = await analyzeSymptomsAndSuggestRelief(validatedFields.data);
    return { success: true, data: analysis };
  } catch (error) {
    console.error("AI analysis failed:", error);
    return {
      success: false,
      error: "An unexpected error occurred during analysis. Please try again later.",
    };
  }
}
