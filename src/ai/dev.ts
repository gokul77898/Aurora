import { config } from 'dotenv';
config();

import '@/ai/flows/explain-train-assignment.ts';
import '@/ai/flows/optimize-shunting-paths.ts';
import '@/ai/flows/predict-maintenance.ts';
