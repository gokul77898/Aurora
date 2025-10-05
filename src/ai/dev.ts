import { config } from 'dotenv';
config();

import '@/ai/flows/explain-train-assignment.ts';
import '@/ai/flows/predict-maintenance.ts';
import '@/ai/flows/fleet-command-flow.ts';
import '@/ai/flows/suggest-shunting-movements.ts';
