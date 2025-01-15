import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DailyBulletin, Match } from '../models/Match';
import { API_TOKEN, BASE_URL } from './footballApi';

export async function getDailyBulletin(): Promise<DailyBulletin | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bulletinRef = doc(db, 'dailyBulletins', today);
    const bulletinSnap = await getDoc(bulletinRef);
    
    if (bulletinSnap.exists()) {
      console.log('✅ Daily bulletin found in Firestore');
      return bulletinSnap.data() as DailyBulletin;
    }

    // If not in Firestore, fetch from API
    console.log('⚠️ Daily bulletin not found in Firestore, fetching from API...');
    
    const response = await fetch(
      `${BASE_URL}/matches?dateFrom=${today}&dateTo=${today}`,
      {
        headers: {
          'X-Auth-Token': API_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch matches from API');
    }

    const data = await response.json();
    console.log('✅ Successfully fetched matches from API');
    
    return {
      fetchDate: today,
      matches: data.matches,
    };

  } catch (error) {
    console.error('❌ Error fetching daily bulletin:', error);
    throw error;
  }
}

export async function getMatchDetails(matchId: string): Promise<{
  details: Match;
  h2h: Match[];
  homeRecentMatches: Match[];
  awayRecentMatches: Match[];
} | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const matchDetailsRef = doc(db, 'dailyBulletins', today, 'matchDetails', matchId);
    const matchDetailsSnap = await getDoc(matchDetailsRef);
    
    if (matchDetailsSnap.exists()) {
      return matchDetailsSnap.data() as {
        details: Match;
        h2h: Match[];
        homeRecentMatches: Match[];
        awayRecentMatches: Match[];
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw error;
  }
} 