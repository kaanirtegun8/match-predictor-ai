import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Match } from '../models';

export async function getDailyBulletin(): Promise<{ matches: Match[] } | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bulletinRef = doc(db, 'dailyBulletins', today);
    const bulletinSnap = await getDoc(bulletinRef);
    
    if (bulletinSnap.exists()) {
      return bulletinSnap.data() as { matches: Match[] };
    }
    return null;
  } catch (error) {
    console.error('Error fetching bulletin:', error);
    throw error;
  }
} 