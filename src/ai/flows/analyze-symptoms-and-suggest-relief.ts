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
  name: z.string().optional().describe('The user\'s full name (optional).'),
  age: z.number().describe('The user\'s age.'),
  gender: z.string().describe('The user\'s gender.'),
  country: z.string().describe('The user\'s country (important for OTC availability).'),
  pregnancyStatus: z.string().optional().describe('The user\'s pregnancy status (if applicable).'),
  existingMedicalConditions: z.string().optional().describe('The user\'s existing medical conditions (e.g., asthma, diabetes, hypertension).'),
  currentMedications: z.string().optional().describe('The user\'s current medications or supplements.'),
  knownAllergies: z.string().optional().describe('The user\'s known allergies.'),
  lifestyleFactors: z.string().optional().describe('The user\'s lifestyle factors (smoking, alcohol use, stress, sleep quality).'),
  mainSymptom: z.string().describe('The user\'s main symptom(s).'),
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
  symptomAnalysis: z.string().describe('Possible explanations for symptoms.'),
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

Analyze the following user data and generate a report according to the specified format.

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
1. Possible cause #1 – brief explanation
2. Possible cause #2 – brief explanation
3. Possible cause #3 – brief explanation

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
