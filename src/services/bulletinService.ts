import { db } from '../config/firebase';
import { doc, getDoc, collection } from 'firebase/firestore';
import { DailyBulletin, Match } from '../models/Match';
import { API_TOKEN, BASE_URL } from './footballApi';

// Helper function to check if a match has started
function hasMatchStarted(match: Match): boolean {
  const now = new Date();
  const matchDate = new Date(match.kickoff ?? match.utcDate);
  return now > matchDate;
}

export async function getDailyBulletin(): Promise<DailyBulletin | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bulletinRef = doc(db, 'dailyBulletins', today);
    const bulletinSnap = await getDoc(bulletinRef);
    
    if (bulletinSnap.exists()) {
      console.log('✅ Daily bulletin found in Firestore');
      const bulletin = bulletinSnap.data() as DailyBulletin;
      
      // Filter matches that are TIMED and haven't started yet
      const upcomingMatches = bulletin.matches.filter((match: Match) => 
        match.status === 'TIMED' && !hasMatchStarted(match)
      );
      console.log(`✅ Found ${upcomingMatches.length} upcoming matches that haven't started yet`);
      
      return {
        ...bulletin,
        matches: upcomingMatches
      };
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
    
    // Filter API response matches that are TIMED and haven't started yet
    const upcomingMatches = data.matches.filter((match: Match) => 
      match.status === 'TIMED' && !hasMatchStarted(match)
    );
    console.log(`✅ Found ${upcomingMatches.length} upcoming matches that haven't started yet from API`);
    
    return {
      fetchDate: today,
      matches: upcomingMatches,
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
    const bulletinRef = doc(db, 'dailyBulletins', today);
    const matchDetailsRef = doc(collection(bulletinRef, 'matchDetails'), matchId);
    const matchDetailsSnap = await getDoc(matchDetailsRef);
    
    if (matchDetailsSnap.exists()) {
      return matchDetailsSnap.data() as {
        details: Match;
        h2h: Match[];
        homeRecentMatches: Match[];
        awayRecentMatches: Match[];
      };
    }

    console.log('⚠️ Match details not found in Firestore');
    return null;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw error;
  }
} 