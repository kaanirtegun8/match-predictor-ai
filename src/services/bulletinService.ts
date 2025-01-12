import { db } from '../config/firebase';
import { doc, getDoc, collection, setDoc } from 'firebase/firestore';
import { Match } from '../models';
import { getWeeklyMatches } from './footballApi';

export async function getDailyBulletin(): Promise<{ matches: Match[] } | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bulletinRef = doc(db, 'dailyBulletins', today);
    const bulletinSnap = await getDoc(bulletinRef);
    
    if (bulletinSnap.exists()) {
      return bulletinSnap.data() as { matches: Match[] };
    }

    // Firebase'den veri gelmezse API'den çekmeyi dene
    console.log('No bulletin found in Firebase, trying API directly...');
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateTo = nextWeek.toISOString().split('T')[0];

    const weeklyMatches = await getWeeklyMatches(today, dateTo);
    const timedMatches = weeklyMatches.matches.filter(match =>
      match.status === 'TIMED' || match.status === 'SCHEDULED'
    );

    // API'den veri başarıyla gelirse Firebase'e kaydet
    try {
      const bulletinDocRef = doc(db, 'dailyBulletins', today);
      await setDoc(bulletinDocRef, {
        matches: timedMatches,
        lastUpdated: new Date(),
        source: 'api_fallback'
      });
    } catch (error) {
      console.error('Failed to save API data to Firebase:', error);
    }

    return { matches: timedMatches };
  } catch (error) {
    console.error('Error fetching bulletin:', error);
    throw error;
  }
} 