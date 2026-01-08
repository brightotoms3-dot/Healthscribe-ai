'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing user symptoms and suggesting relief options.
 *
 * It takes user information and symptom details as input, then provides possible explanations,
 * immediate relief actions, OTC medication suggestions, self-care tips, and guidance on when to seek medical care.
 *
 * - analyzeSymptomsAndSuggestRelief - The main function that orchestrates the symptom analysis process.
 * - SymptomAnalysisInput - The input type for the analyzeSymptomsAndSuggestRelief function.
 * - SymptomAnalysisOutput - The return type for the analyzeSymptomsAndSuggestRelief function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomAnalysisInputSchema = z.object({
  name: z.string().optional().describe("The user's full name (optional)."),
  age: z.coerce.number().optional().nullable().describe("The user's age."),
  gender: z.string().describe("The user's gender."),
  country: z.string().describe("The user's country (important for OTC availability)."),
  pregnancyStatus: z.string().optional().describe("The user's pregnancy status (if applicable)."),
  existingMedicalConditions: z.string().optional().describe("The user's existing medical conditions (e.g., asthma, diabetes, hypertension)."),
  currentMedications: z.string().optional().describe("The user's current medications or supplements."),
  knownAllergies: z.string().optional().describe("The user's known allergies."),
  lifestyleFactors: z.string().optional().describe("The user's lifestyle factors (smoking, alcohol use, stress, sleep quality)."),
  mainSymptom: z.string().describe("The user's main symptom(s)."),
  symptomOnset: z.string().describe('When the symptom started (date or duration).'),
  symptomFrequency: z.string().describe('How often the symptom occurs.'),
  symptomSeverity: z.string().describe('Severity of the symptom (mild / moderate / severe).'),
  symptomTriggers: z.string().describe('What makes the symptom better or worse.'),
  additionalSymptoms: z.string().optional().describe('Any additional symptoms.'),
  previousOccurrence: z.string().describe('Whether this has happened before.'),
  recentEvents: z.string().optional().describe('Any recent illness, injury, travel, or emotional stress.'),
  symptomProgression: z.string().describe('Whether symptoms are improving, worsening, or unchanged.'),
});
export type SymptomAnalysisInput = z.infer<typeof SymptomAnalysisInputSchema>;

const SymptomAnalysisOutputSchema = z.object({
  personalSummary: z.string().describe('Summary of personal details provided by user.'),
  immediateRelief: z.string().describe('List of immediate relief actions.'),
  symptomAnalysis: z.object({
    analysisText: z.string().describe('A formatted string with possible explanations for symptoms, presented as a numbered list. Example: "1. Possible cause #1 – brief explanation\n2. Possible cause #2 – brief explanation"'),
    possibilities: z.array(z.object({
      cause: z.string().describe('The name of the possible cause or condition.'),
      likelihood: z.number().min(0).max(100).describe('A numerical percentage (0-100) representing the likelihood of this cause, based on the provided symptoms and information.'),
      explanation: z.string().describe('A brief explanation for this possible cause.'),
    })).describe('An array of objects, each representing a possible cause with its likelihood and a brief explanation. Provide 3-5 possibilities.'),
  }).describe('The analysis of symptoms, including both a formatted text block and a structured array of possibilities with their likelihood.'),
  otcReliefOptions: z.string().describe('OTC medication suggestions.'),
  selfCareTips: z.string().describe('Self-care and ongoing tips.'),
  medicalCareAlert: z.string().describe('Guidance on when to seek medical care.'),
  disclaimer: z.string().describe('Disclaimer regarding the information provided.'),
});
export type SymptomAnalysisOutput = z.infer<typeof SymptomAnalysisOutputSchema>;

export async function analyzeSymptomsAndSuggestRelief(
  input: SymptomAnalysisInput
): Promise<SymptomAnalysisOutput> {
  return analyzeSymptomsAndSuggestReliefFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomAnalysisPrompt',
  input: {schema: SymptomAnalysisInputSchema},
  output: {schema: SymptomAnalysisOutputSchema},
  prompt: `You are an AI-powered Symptom Analyzer designed to collect personal health details, analyze symptoms carefully, provide IMMEDIATE RELIEF guidance, and suggest safe OVER-THE-COUNTER (OTC) options when appropriate.

You are NOT a doctor. You must NOT diagnose diseases, prescribe prescription medications, or replace professional medical advice.

Analyze the following user data and generate a report according to the specified format. For the symptom analysis, you must provide both a formatted text string and a structured array of possibilities.

USER INFORMATION:
- Name: {{name}}
- Age: {{age}}
- Gender: {{gender}}
- Country: {{country}}
- Pregnancy status: {{pregnancyStatus}}
- Existing medical conditions: {{existingMedicalConditions}}
- Current medications: {{currentMedications}}
- Known allergies: {{knownAllergies}}
- Lifestyle factors: {{lifestyleFactors}}

SYMPTOM DETAILS:
- Main symptom(s): {{mainSymptom}}
- When the symptom started: {{symptomOnset}}
- How often it occurs: {{symptomFrequency}}
- Severity: {{symptomSeverity}}
- What makes it better or worse: {{symptomTriggers}}
- Any additional symptoms: {{additionalSymptoms}}
- Whether this has happened before: {{previousOccurrence}}
- Any recent illness, injury, travel, or emotional stress: {{recentEvents}}
- Whether symptoms are improving, worsening, or unchanged: {{symptomProgression}}

OUTPUT FORMAT:

🧾 PERSONAL SUMMARY:
- Name: {{name}}
- Age: {{age}}
- Gender: {{gender}}
- Country: {{country}}
- Symptom duration: {{symptomOnset}}
- Key risk factors: {{existingMedicalConditions}}, {{knownAllergies}}, {{lifestyleFactors}}

⚡ IMMEDIATE RELIEF (WHAT YOU CAN DO NOW):
- 3–6 simple, safe actions to reduce discomfort immediately

🔍 SYMPTOM ANALYSIS:
Based on the information provided, here are some possible explanations (not a diagnosis):
- For the 'analysisText' field, generate a numbered list string.
- For the 'possibilities' field, generate an array of objects, each with a 'cause', 'likelihood' (0-100), and 'explanation'. Ensure the likelihoods are plausible but not definitive.

💊 OTC RELIEF OPTIONS:
For symptom relief only (follow label instructions):
- OTC option 1 – what it may help with + who should avoid it
- OTC option 2 – what it may help with + who should avoid it

🏠 SELF-CARE & ONGOING TIPS:
- Practical daily habits to support recovery
- Lifestyle or environmental adjustments

🚨 WHEN TO SEEK MEDICAL CARE:
List red-flag symptoms clearly under:
- See a doctor soon if:
- Seek urgent or emergency care if:

📌 DISCLAIMER (MUST ALWAYS APPEAR):
"This information is for educational purposes only and does not replace professional medical advice. Always read medication labels carefully and consult a qualified healthcare professional if symptoms persist, worsen, or you are unsure."
  `,
});

const analyzeSymptomsAndSuggestReliefFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsAndSuggestReliefFlow',
    inputSchema: SymptomAnalysisInputSchema,
    outputSchema: SymptomAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
