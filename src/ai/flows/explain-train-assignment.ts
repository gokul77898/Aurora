'use server';

/**
 * @fileOverview Explains the reasoning behind a train's current assignment.
 *
 * - explainTrainAssignment - A function that explains the reasoning behind a train's current assignment.
 * - ExplainTrainAssignmentInput - The input type for the explainTrainAssignment function.
 * - ExplainTrainAssignmentOutput - The return type for the explainTrainAssignment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTrainAssignmentInputSchema = z.object({
  trainsetId: z.string().describe('The ID of the trainset.'),
  status: z.enum(['service', 'standby', 'maintenance', 'cleaning']).describe('The current status of the trainset.'),
  fitnessStatus: z.string().describe('The fitness status of the trainset.'),
  jobCardStatus: z.string().describe('The job card status of the trainset.'),
  mileage: z.number().describe('The mileage of the trainset.'),
  slaPriority: z.string().describe('The SLA priority of the trainset.'),
});
export type ExplainTrainAssignmentInput = z.infer<typeof ExplainTrainAssignmentInputSchema>;

const ExplainTrainAssignmentOutputSchema = z.object({
  explanation: z.string().describe('The explanation for the train assignment.'),
});
export type ExplainTrainAssignmentOutput = z.infer<typeof ExplainTrainAssignmentOutputSchema>;

export async function explainTrainAssignment(input: ExplainTrainAssignmentInput): Promise<ExplainTrainAssignmentOutput> {
  return explainTrainAssignmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTrainAssignmentPrompt',
  input: {schema: ExplainTrainAssignmentInputSchema},
  output: {schema: ExplainTrainAssignmentOutputSchema},
  prompt: `You are an expert in train scheduling and maintenance.

  Explain the reasoning behind the current assignment of trainset {{trainsetId}} based on the following information:

  Status: {{status}}
  Fitness Status: {{fitnessStatus}}
  Job Card Status: {{jobCardStatus}}
  Mileage: {{mileage}}
  SLA Priority: {{slaPriority}}

  Provide a concise and easy-to-understand explanation for why the train is currently assigned this status.
  Why is the train in "{{status}}" status? Focus on the most pertinent information and draw reasonable relationships to come to a conclusion.
  `,
});

const explainTrainAssignmentFlow = ai.defineFlow(
  {
    name: 'explainTrainAssignmentFlow',
    inputSchema: ExplainTrainAssignmentInputSchema,
    outputSchema: ExplainTrainAssignmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
