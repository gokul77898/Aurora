'use client';
import { Firestore, collection, writeBatch } from 'firebase/firestore';
import { initialTrainData } from './data';
import { TrainsetDocument } from './types';
import { doc } from 'firebase/firestore';

export async function seedInitialData(db: Firestore) {
  const batch = writeBatch(db);
  const trainsetsCollection = collection(db, 'trainsets');

  initialTrainData.forEach((train) => {
    const { id, ...data } = train;
    const trainRef = doc(trainsetsCollection, id);
    batch.set(trainRef, data as TrainsetDocument);
  });

  await batch.commit();
  console.log('Initial data seeded successfully!');
}
