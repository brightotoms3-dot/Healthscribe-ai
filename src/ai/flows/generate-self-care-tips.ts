'use server';

/**
 * @fileOverview Generates personalized self-care tips based on user's symptoms, medical history and lifestyle.
 *
 * - generateSelfCareTips - A function that generates self-care tips.
 * - GenerateSelfCareTipsInput - The input type for the generateSelfCareTips function.
 * - GenerateSelfCareTipsOutput - The return type for the generateSelfCareTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSelfCareTipsInputSchema = z.object({
  name: z.string().optional().describe('The full name of the user.'),
  age: z.number().describe('The age of the user.'),
  gender: z.string().describe('The gender of the user.'),
  country: z.string().describe('The country of the user.'),
  symptomDuration: z.string().describe('The duration of the symptoms.'),
  keyRiskFactors: z.string().optional().describe('Key risk factors of the user.'),
  mainSymptom: z.string().describe('The main symptom reported by the user.'),
  symptoms: z.string().describe('A list of symptoms the user is experiencing.'),
  medicalConditions: z.string().optional().describe('Existing medical conditions of the user.'),
  medications: z.string().optional().describe('Current medications or supplements the user is taking.'),
  allergies: z.string().optional().describe('Known allergies of the user.'),
  lifestyleFactors: z.string().optional().describe('Lifestyle factors such as smoking, alcohol use, stress, and sleep quality.'),
});

export type GenerateSelfCareTipsInput = z.infer<typeof GenerateSelfCareTipsInputSchema>;

const GenerateSelfCareTipsOutputSchema = z.object({
  selfCareTips: z.string().describe('Personalized self-care tips for the user.'),
});

export type GenerateSelfCareTipsOutput = z.infer<typeof GenerateSelfCareTipsOutputSchema>;

export async function generateSelfCareTips(input: GenerateSelfCareTipsInput): Promise<GenerateSelfCareTipsOutput> {
  return generateSelfCareTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSelfCareTipsPrompt',
  input: {schema: GenerateSelfCareTipsInputSchema},
  output: {schema: GenerateSelfCareTipsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized self-care tips to users based on their symptoms, medical history, and lifestyle.

  Consider the following information about the user:
  {{#if name}}Name: {{{name}}}{{/if}}
  Age: {{{age}}}
  Gender: {{{gender}}}
  Country: {{{country}}}
  Symptom Duration: {{{symptomDuration}}}
  {{#if keyRiskFactors}}Key Risk Factors: {{{keyRiskFactors}}}{{/if}}
  Main Symptom: {{{mainSymptom}}}
  Symptoms: {{{symptoms}}}
  {{#if medicalConditions}}Medical Conditions: {{{medicalConditions}}}{{/if}}
  {{#if medications}}Medications: {{{medications}}}{{/if}}
  {{#if allergies}}Allergies: {{{allergies}}}{{/if}}
  {{#if lifestyleFactors}}Lifestyle Factors: {{{lifestyleFactors}}}{{/if}}

  Generate practical and actionable self-care tips that the user can implement to support their recovery and manage their symptoms. These tips should be tailored to the user's specific situation and consider their medical history, lifestyle factors, and any allergies or medications they are taking.

  Focus on suggesting daily habits and lifestyle adjustments that can help alleviate symptoms and promote overall well-being.

  OUTPUT:
  {{selfCareTips}}`,
});

const generateSelfCareTipsFlow = ai.defineFlow(
  {
    name: 'generateSelfCareTipsFlow',
    inputSchema: GenerateSelfCareTipsInputSchema,
    outputSchema: GenerateSelfCareTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
