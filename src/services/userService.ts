import { doc, getDoc, updateDoc, increment, collection, query, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function getAnalysisCount(userId: string): Promise<number> {
  const analysesRef = collection(db, 'users', userId, 'analyses');
  const analysesSnapshot = await getDocs(analysesRef);
  const count = analysesSnapshot.size;
  console.log(`👤 User ${userId} has performed ${count} analyses`);
  return count;
}

export async function checkAnalysisLimit(userId: string): Promise<boolean> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  
  // If user document doesn't exist, create it with default values
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      isPremium: false,
      createdAt: serverTimestamp()
    });
    return true; // New users can analyze
  }

  const userData = userDoc.data();
  const isPremium = userData.isPremium || false;

  // Premium users have no limit
  if (isPremium) {
    return true;
  }

  // Count actual analyses for free users
  const count = await getAnalysisCount(userId);
  console.log(`Checking limit: User has ${count} analyses, limit is 3`);

  // Free users have 3 analyses limit
  return count < 3;
}

export async function incrementAnalysisCount(userId: string): Promise<void> {
  // This function is no longer needed since we're counting actual analyses
  // But keeping it for backward compatibility
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    analysisCount: increment(1)
  });
} 