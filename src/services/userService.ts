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

export async function incrementAnalysisCount(userId: string): Promise<void> {
  const analysesRef = collection(db, 'users', userId, 'analyses');
  await addDoc(analysesRef, {
    createdAt: serverTimestamp(),
  });
} 