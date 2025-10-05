'use server';

/**
 * @fileOverview A flow that uses a genetic algorithm to suggest optimized shunting paths and patterns for train induction.
 *
 * - optimizeShuntingPaths - A function that handles the shunting path optimization process.
 * - OptimizeShuntingPathsInput - The input type for the optimizeShuntingPaths function.
 * - OptimizeShuntingPathsOutput - The return type for the optimizeShuntingPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeShuntingPathsInputSchema = z.object({
  depotLayout: z.string().describe('A description of the depot layout, including the number of tracks, switches, and platforms.'),
  trainsetCharacteristics: z.string().describe('A description of the trainsets to be inducted, including their length, width, and turning radius.'),
  inductionSchedule: z.string().describe('A description of the induction schedule, including the arrival times and destinations of the trainsets.'),
  optimizationGoals: z.string().describe('A description of the optimization goals, such as minimizing shunting time or maximizing throughput.'),
});
export type OptimizeShuntingPathsInput = z.infer<typeof OptimizeShuntingPathsInputSchema>;

const OptimizeShuntingPathsOutputSchema = z.object({
  optimizedPaths: z.string().describe('A description of the optimized shunting paths and patterns for train induction.'),
  performanceMetrics: z.string().describe('A description of the performance metrics for the optimized shunting paths, such as shunting time and throughput.'),
});
export type OptimizeShuntingPathsOutput = z.infer<typeof OptimizeShuntingPathsOutputSchema>;

export async function optimizeShuntingPaths(input: OptimizeShuntingPathsInput): Promise<OptimizeShuntingPathsOutput> {
  return optimizeShuntingPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeShuntingPathsPrompt',
  input: {schema: OptimizeShuntingPathsInputSchema},
  output: {schema: OptimizeShuntingPathsOutputSchema},
  prompt: `You are an expert in optimizing shunting paths and patterns for train induction using genetic algorithms.

You will use the following information to generate optimized shunting paths and patterns.

Depot Layout: {{{depotLayout}}}
Trainset Characteristics: {{{trainsetCharacteristics}}}
Induction Schedule: {{{inductionSchedule}}}
Optimization Goals: {{{optimizationGoals}}}

Consider the depot layout, trainset characteristics, induction schedule, and optimization goals to generate optimized shunting paths and patterns for train induction. The response should include a description of the optimized paths and patterns, as well as performance metrics such as shunting time and throughput.
`,
});

const optimizeShuntingPathsFlow = ai.defineFlow(
  {
    name: 'optimizeShuntingPathsFlow',
    inputSchema: OptimizeShuntingPathsInputSchema,
    outputSchema: OptimizeShuntingPathsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
