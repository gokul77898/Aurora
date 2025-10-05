import type { Trainset } from './types';

export const initialTrainData: Trainset[] = [
  { id: 'T-801', status: 'service', fitnessStatus: 'Fit', jobCardStatus: 'Closed', mileage: 120500, slaPriority: 'High' },
  { id: 'T-802', status: 'service', fitnessStatus: 'Fit', jobCardStatus: 'Closed', mileage: 95200, slaPriority: 'High' },
  { id: 'T-803', status: 'standby', fitnessStatus: 'Fit', jobCardStatus: 'Closed', mileage: 500, slaPriority: 'Medium' },
  { id: 'T-804', status: 'maintenance', fitnessStatus: 'Needs Check', jobCardStatus: 'Open', mileage: 210300, slaPriority: 'High' },
  { id: 'T-805', status: 'service', fitnessStatus: 'Fit', jobCardStatus: 'Closed', mileage: 150000, slaPriority: 'Medium' },
  { id: 'T-806', status: 'cleaning', fitnessStatus: 'Fit', jobCardStatus: 'In Progress', mileage: 75600, slaPriority: 'Low' },
  { id: 'T-807', status: 'standby', fitnessStatus: 'Fit', jobCardStatus: 'Closed', mileage: 1200, slaPriority: 'Low' },
  { id: 'T-808', status: 'maintenance', fitnessStatus: 'Unfit', jobCardStatus: 'Open', mileage: 300100, slaPriority: 'High' },
  { id: 'T-809', status: 'service', fitnessStatus: 'Fit', jobCardStatus: 'Closed', mileage: 88000, slaPriority: 'Medium' },
  { id: 'T-810', status: 'service', fitnessStatus: 'Fit', jobCardStatus: 'Closed', mileage: 45000, slaPriority: 'Medium' },
];
