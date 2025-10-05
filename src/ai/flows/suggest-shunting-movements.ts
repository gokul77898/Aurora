'use server';

/**
 * @fileOverview A flow that suggests concrete shunting movements for trains in a depot.
 *
 * - suggestShuntingMovements - A function that suggests train movements.
 * - SuggestShuntingMovementsInput - The input type for the suggestShuntingMovements function.
 * - SuggestShuntingMovementsOutput - The return type for the suggestShuntingMovements function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TrainStateSchema = z.object({
  id: z.string().describe('The ID of the trainset.'),
  track: z.number().describe('The current track number the train is on.'),
  status: z.string().describe('The current operational status of the train (e.g., service, maintenance).'),
  destination: z.string().describe('The intended destination or next required location (e.g., Exit, Maintenance Bay, Cleaning Bay).'),
});

const SuggestShuntingMovementsInputSchema = z.object({
  trains: z.array(TrainStateSchema).describe('An array of the current state of all trains in the depot.'),
  depotLayout: z.string().describe('A description of the depot layout, including track connections, bay locations, and exit points.'),
});
export type SuggestShuntingMovementsInput = z.infer<typeof SuggestShuntingMovementsInputSchema>;

const MovementSchema = z.object({
    trainId: z.string().describe('The ID of the trainset to move.'),
    fromTrack: z.number().describe('The track number the train is moving from.'),
    toTrack: z.number().describe('The track number the train is moving to.'),
    reason: z.string().describe('The reason for this movement (e.g., "Move to maintenance bay for repairs").'),
});
export type Movement = z.infer<typeof MovementSchema>;

const SuggestShuntingMovementsOutputSchema = z.object({
  movements: z.array(MovementSchema).describe('A prioritized, step-by-step list of train movements to perform.'),
  summary: z.string().describe('A brief summary of the overall shunting plan.'),
});
export type SuggestShuntingMovementsOutput = z.infer<typeof SuggestShuntingMovementsOutputSchema>;

export async function suggestShuntingMovements(input: SuggestShuntingMovementsInput): Promise<SuggestShuntingMovementsOutput> {
  return suggestShuntingMovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestShuntingMovementsPrompt',
  input: { schema: SuggestShuntingMovementsInputSchema },
  output: { schema: SuggestShuntingMovementsOutputSchema },
  prompt: `You are an expert railway depot controller responsible for optimizing shunting operations.
  Your task is to create a safe and efficient sequence of train movements based on the current state of the depot and the requirements of each train.

  Current Depot State:
  - Layout: {{{depotLayout}}}
  - Trains:
  {{#each trains}}
    - Train {{id}} is on Track {{track}}, status is {{status}}, needs to go to {{destination}}.
  {{/each}}

  Instructions:
  1. Analyze the position and status of all trains.
  2. Prioritize movements that clear paths for other trains or move trains to their required destinations (Maintenance, Cleaning, Exit).
  3. Generate a sequence of concrete, step-by-step movements. Each movement must be from one track to another.
  4. Ensure the plan is logical and avoids conflicts. Do not suggest two trains occupy the same track at the same time.
  5. For each movement, provide a clear reason.
  6. Provide a concise summary of your overall strategy.

  Generate the list of movements and the summary.
  `,
});

const suggestShuntingMovementsFlow = ai.defineFlow(
  {
    name: 'suggestShuntingMovementsFlow',
    inputSchema: SuggestShuntingMovementsInputSchema,
    outputSchema: SuggestShuntingMovementsOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
