export type TrainStatus = "service" | "standby" | "maintenance" | "cleaning";

export interface Trainset {
  id: string; // Document ID from Firestore
  status: TrainStatus;
  fitnessStatus: "Fit" | "Needs Check" | "Unfit";
  jobCardStatus: "Open" | "Closed" | "In Progress";
  mileage: number;
  slaPriority: "High" | "Medium" | "Low";
}

export type TrainsetDocument = Omit<Trainset, 'id'>;
