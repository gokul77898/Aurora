'use server';

/**
 * @fileOverview A flow that predicts potential maintenance needs for a trainset.
 *
 * - predictMaintenance - A function that handles the maintenance prediction process.
 * - PredictMaintenanceInput - The input type for the predictMaintenance function.
 * - PredictMaintenanceOutput - The return type for the predictMaintenance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictMaintenanceInputSchema = z.object({
  trainsetId: z.string().describe('The ID of the trainset.'),
  mileage: z.number().describe('The current mileage of the trainset.'),
  fitnessStatus: z.string().describe('The current fitness status of the trainset (e.g., Fit, Needs Check).'),
  slaPriority: z.string().describe('The Service Level Agreement priority (e.g., High, Medium, Low).'),
});
export type PredictMaintenanceInput = z.infer<typeof PredictMaintenanceInputSchema>;

const PredictMaintenanceOutputSchema = z.object({
    isMaintenanceLikely: z.boolean().describe('Whether maintenance is likely needed soon.'),
    reasoning: z.string().describe('The reasoning behind the prediction.'),
    suggestedAction: z.string().describe('A suggested action to take.'),
});
export type PredictMaintenanceOutput = z.infer<typeof PredictMaintenanceOutputSchema>;


export async function predictMaintenance(input: PredictMaintenanceInput): Promise<PredictMaintenanceOutput> {
  return predictMaintenanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictMaintenancePrompt',
  input: {schema: PredictMaintenanceInputSchema},
  output: {schema: PredictMaintenanceOutputSchema},
  prompt: `You are a predictive maintenance expert for a train fleet.
  Analyze the following trainset data to determine if it is at high risk for requiring maintenance soon.

  Trainset ID: {{trainsetId}}
  Mileage: {{mileage}}
  Fitness Status: {{fitnessStatus}}
  SLA Priority: {{slaPriority}}

  Consider high mileage (over 180,000 km) as a primary risk factor.
  A 'Needs Check' fitness status is also a strong indicator of potential issues.
  High SLA priority means the train is critical and downtime should be avoided.

  Based on these factors, determine if maintenance is likely. Provide your reasoning and a suggested action.
  For example, if mileage is high and fitness is 'Needs Check', maintenance is very likely.
  If mileage is low and fitness is 'Fit', it is not likely.
  `,
});

const predictMaintenanceFlow = ai.defineFlow(
  {
    name: 'predictMaintenanceFlow',
    inputSchema: PredictMaintenanceInputSchema,
    outputSchema: PredictMaintenanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
