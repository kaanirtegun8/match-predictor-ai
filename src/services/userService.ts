import { doc, getDoc, updateDoc, increment, collection, query, getDocs, setDoc, serverTimestamp, where, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function getMonthlyAnalysisCount(userId: string): Promise<number> {
  // Get first day of current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const analysesRef = collection(db, 'users', userId, 'analyses');
  const monthlyQuery = query(
    analysesRef,
    where('createdAt', '>=', startOfMonth)
  );
  
  const analysesSnapshot = await getDocs(monthlyQuery);
  const count = analysesSnapshot.size;

  console.log(`👤 User ${userId} has performed ${count} analyses this month`);
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

  // Count monthly analyses for free users
  const monthlyCount = await getMonthlyAnalysisCount(userId);
  console.log(`Checking limit: User has ${monthlyCount} analyses this month, limit is 3`);

  // Free users have 3 analyses limit per month
  return monthlyCount <= 3;
}

export async function incrementAnalysisCount(userId: string): Promise<void> {
  const analysesRef = collection(db, 'users', userId, 'analyses');
  await addDoc(analysesRef, {
    createdAt: serverTimestamp(),
  });
} 