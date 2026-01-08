import { z } from "zod";

export const SymptomAnalysisFormSchema = z.object({
  name: z.string().optional(),
  age: z.coerce
    .number({ invalid_type_error: "Age must be a number." })
    .positive("Age must be a positive number.")
    .max(120, "Please enter a valid age."),
  gender: z.string().min(1, "Gender is required."),
  country: z.string().min(1, "Country is required."),
  pregnancyStatus: z.string().optional(),
  existingMedicalConditions: z.string().optional(),
  currentMedications: z.string().optional(),
  knownAllergies: z.string().optional(),
  lifestyleFactors: z.string().optional(),
  mainSymptom: z.string().min(3, "Main symptom is required."),
  symptomOnset: z.string().min(1, "Symptom onset is required."),
  symptomFrequency: z.string().min(1, "Symptom frequency is required."),
  symptomSeverity: z.string().min(1, "Symptom severity is required."),
  symptomTriggers: z.string().min(3, "Symptom triggers are required."),
  additionalSymptoms: z.string().optional(),
  previousOccurrence: z.string().min(1, "This field is required."),
  recentEvents: z.string().optional(),
  symptomProgression: z.string().min(1, "Symptom progression is required."),
});
