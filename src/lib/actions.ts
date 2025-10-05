'use server';

import {
  explainTrainAssignment,
  type ExplainTrainAssignmentInput,
} from '@/ai/flows/explain-train-assignment';
import {
  predictMaintenance,
  type PredictMaintenanceInput,
  type PredictMaintenanceOutput,
} from '@/ai/flows/predict-maintenance';

export async function getExplanation(
  input: ExplainTrainAssignmentInput
): Promise<string> {
  try {
    const result = await explainTrainAssignment(input);
    return result.explanation;
  } catch (error) {
    console.error(error);
    return 'An error occurred while generating the explanation. Please try again.';
  }
}

export async function getMaintenancePrediction(
  input: PredictMaintenanceInput
): Promise<PredictMaintenanceOutput | null> {
  try {
    const result = await predictMaintenance(input);
    return result;
  } catch (error) {
    console.error('Error in getMaintenancePrediction:', error);
    return null;
  }
}
