'use server';

/**
 * @fileOverview A flow for querying trainset data using natural language.
 *
 * - fleetCommandFlow - A function that handles natural language queries about the train fleet.
 * - FleetCommandInput - The input type for the fleetCommandFlow function.
 * - FleetCommandOutput - The return type for the fleetCommandFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { initialTrainData } from '@/lib/data';
import type { Trainset } from '@/lib/types';

// Define a tool for the AI to get trainset data
const getTrainsetDataTool = ai.defineTool(
  {
    name: 'get_trainset_data',
    description: 'Retrieves the current data for all trainsets in the fleet.',
    inputSchema: z.void(),
    outputSchema: z.array(z.object({
        id: z.string(),
        status: z.enum(['service', 'standby', 'maintenance', 'cleaning']),
        fitnessStatus: z.enum(['Fit', 'Needs Check', 'Unfit']),
        jobCardStatus: z.enum(['Open', 'Closed', 'In Progress']),
        mileage: z.number(),
        slaPriority: z.enum(['High', 'Medium', 'Low']),
    })),
  },
  async () => {
    // For this implementation, we'll return the static initial data.
    // In a production scenario, this could fetch from a live database.
    return initialTrainData;
  }
);


export const FleetCommandInputSchema = z.object({
  query: z.string().describe('The natural language query from the user.'),
});
export type FleetCommandInput = z.infer<typeof FleetCommandInputSchema>;

export const FleetCommandOutputSchema = z.object({
  response: z.string().describe('The AI-generated response to the query.'),
});
export type FleetCommandOutput = z.infer<typeof FleetCommandOutputSchema>;

const prompt = ai.definePrompt({
    name: 'fleetCommandPrompt',
    input: { schema: FleetCommandInputSchema },
    output: { schema: FleetCommandOutputSchema },
    tools: [getTrainsetDataTool],
    prompt: `You are a helpful assistant for the Aurora Metro Induction Planner.
    Your role is to answer questions about the train fleet based on the data provided by your tools.
    Be concise and clear in your answers.

    User query: "{{query}}"
    `,
});


export const fleetCommandFlow = ai.defineFlow(
  {
    name: 'fleetCommandFlow',
    inputSchema: FleetCommandInputSchema,
    outputSchema: FleetCommandOutputSchema,
  },
  async (input) => {
    const llmResponse = await prompt(input);
    
    return {
      response: llmResponse.text,
    };
  }
);
