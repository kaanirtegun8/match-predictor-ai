import { db } from '../config/firebase';
import { doc, getDoc, collection, setDoc } from 'firebase/firestore';
import { Match } from '../models';
import { getWeeklyMatches, GetMatchDetail, getHeadToHead, getTeamRecentMatches } from './footballApi';
import { HeadToHead } from '../models';

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

export async function getMatchDetails(matchId: string): Promise<Match | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bulletinRef = doc(db, 'dailyBulletins', today);
    const bulletinSnap = await getDoc(bulletinRef);
    
    if (bulletinSnap.exists()) {
      const data = bulletinSnap.data();
      if (data.matchDetails?.[matchId]?.details) {
        return data.matchDetails[matchId].details as Match;
      }
    }
    
    // API'den veriyi çek
    console.log('No valid match data in Firebase, fetching from API...');
    const matchDetails = await GetMatchDetail(Number(matchId));
    const h2hData = await getHeadToHead(Number(matchId));
    const homeTeamMatches = await getTeamRecentMatches(matchDetails.homeTeam.id);
    const awayTeamMatches = await getTeamRecentMatches(matchDetails.awayTeam.id);
    
    // Doğru formatta kaydet
    const processedData = {
      details: matchDetails,
      h2h: h2hData,
      [`recentMatches_${matchDetails.homeTeam.id}`]: homeTeamMatches,
      [`recentMatches_${matchDetails.awayTeam.id}`]: awayTeamMatches
    };
    
    // Firebase'e kaydet
    try {
      await setDoc(bulletinRef, {
        matchDetails: {
          [matchId]: processedData
        }
      }, { merge: true });
    } catch (error) {
      console.error('Failed to save match data to Firebase:', error);
    }
    
    return matchDetails;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw error;
  }
}

export async function getHeadToHeadFromCache(matchId: string): Promise<HeadToHead | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bulletinRef = doc(db, 'dailyBulletins', today);
    const bulletinSnap = await getDoc(bulletinRef);
    
    if (bulletinSnap.exists()) {
      const data = bulletinSnap.data();
      if (data.matchDetails?.[matchId]?.h2h) {
        return data.matchDetails[matchId].h2h as HeadToHead;
      }
    }
    
    // If no valid data in Firebase, fetch from API
    console.log('No valid H2H data in Firebase, fetching from API...');
    const h2hData = await getHeadToHead(Number(matchId));
    
    // Save to Firebase for future use
    try {
      await setDoc(bulletinRef, {
        matchDetails: {
          [matchId]: {
            h2h: h2hData
          }
        }
      }, { merge: true });
    } catch (error) {
      console.error('Failed to save H2H data to Firebase:', error);
    }
    
    return h2hData;
  } catch (error) {
    console.error('Error fetching H2H data:', error);
    throw error;
  }
}

export async function getTeamRecentMatchesFromCache(matchId: string, teamId: number): Promise<Match[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bulletinRef = doc(db, 'dailyBulletins', today);
    const bulletinSnap = await getDoc(bulletinRef);
    
    const recentMatchesKey = `recentMatches_${teamId}`;
    
    if (bulletinSnap.exists()) {
      const data = bulletinSnap.data();
      if (data.matchDetails?.[matchId]?.[recentMatchesKey]) {
        return data.matchDetails[matchId][recentMatchesKey] as Match[];
      }
    }
    
    // If no valid data in Firebase, fetch from API
    console.log('No valid recent matches in Firebase, fetching from API...');
    const recentMatches = await getTeamRecentMatches(teamId);
    
    // Save to Firebase for future use
    try {
      await setDoc(bulletinRef, {
        matchDetails: {
          [matchId]: {
            [recentMatchesKey]: recentMatches
          }
        }
      }, { merge: true });
    } catch (error) {
      console.error('Failed to save recent matches to Firebase:', error);
    }
    
    return recentMatches;
  } catch (error) {
    console.error('Error fetching recent matches:', error);
    throw error;
  }
} 