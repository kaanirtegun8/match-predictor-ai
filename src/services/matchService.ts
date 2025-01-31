import { db } from '../config/firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Match } from '../models/Match';
import { API_TOKEN, BASE_URL } from './footballApi';
import { AnalyzeResponseModel } from '../models/AnalyzeResponseModel';
import { auth } from '@/config/firebase';
import { BilingualAnalysis } from '../models/BilingualAnalysis';

export async function getMatchDetails(matchId: string): Promise<{
  details: Match;
  h2h: Match[];
  homeRecentMatches: Match[];
  awayRecentMatches: Match[];
  standings?: any;
} | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const matchDetailsRef = doc(db, 'dailyBulletins', today, 'matchDetails', matchId);
    const matchDetailsSnap = await getDoc(matchDetailsRef);
    
    if (matchDetailsSnap.exists()) {
      console.log('✅ Match details found in Firestore');
      const matchData = matchDetailsSnap.data() as {
        details: Match;
        h2h: Match[];
        homeRecentMatches: Match[];
        awayRecentMatches: Match[];
      };

      // Get standings from the correct collection
      let standings = null;
      if (matchData.details.competition.id) {
        const standingsRef = doc(db, 'dailyBulletins', today, 'standings', matchData.details.competition.id.toString());
        const standingsSnap = await getDoc(standingsRef);
        if (standingsSnap.exists()) {
          standings = standingsSnap.data();
        }
      }

      return {
        ...matchData,
        standings
      };
    }

    console.log('❌ Match details not found in Firestore');
    return null;

  } catch (error) {
    console.error('❌ Error fetching match details:', error);
    throw error;
  }
}

async function fetchMatchFromAPI(matchId: number): Promise<Match> {
  const response = await fetch(`${BASE_URL}/matches/${matchId}`, {
    headers: { 'X-Auth-Token': API_TOKEN },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch match details from API');
  }
  
  return response.json();
}

async function fetchHeadToHeadFromAPI(matchId: number): Promise<{ matches: Match[] }> {
  const response = await fetch(`${BASE_URL}/matches/${matchId}/head2head`, {
    headers: { 'X-Auth-Token': API_TOKEN },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch head to head from API');
  }
  
  return response.json();
}

async function fetchTeamMatchesFromAPI(matchId: number, type: 'home' | 'away'): Promise<Match[]> {
  // First get the match to get team ID
  const match = await fetchMatchFromAPI(matchId);
  const teamId = type === 'home' ? match.homeTeam.id : match.awayTeam.id;
  
  const response = await fetch(
    `${BASE_URL}/teams/${teamId}/matches?limit=5&status=FINISHED`,
    {
      headers: { 'X-Auth-Token': API_TOKEN },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} team matches from API`);
  }
  
  const data = await response.json();
  return data.matches;
}

async function fetchLeagueStandingsFromAPI(leagueId: number): Promise<any> {
  const response = await fetch(
    `${BASE_URL}/competitions/${leagueId}/standings`,
    {
      headers: { 'X-Auth-Token': API_TOKEN },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch league standings from API');
  }
  
  const data = await response.json();
  return data.standings[0].table; // Getting the total standings table
}

export const saveMatchAnalysis = async (matchId: string, analysis: BilingualAnalysis): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const matchRef = doc(db, 'dailyBulletins', today, 'matchDetails', matchId);
    await setDoc(matchRef, { analysis }, { merge: true });
    console.log('✅ Analysis saved successfully');
    return true;
  } catch (error) {
    console.error('❌ Error saving analysis:', error);
    return false;
  }
};

export const getMatchAnalysis = async (matchId: string): Promise<BilingualAnalysis | null> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const matchRef = doc(db, 'dailyBulletins', today, 'matchDetails', matchId);
    const matchSnap = await getDoc(matchRef);
    
    if (matchSnap.exists()) {
      const data = matchSnap.data();
      if (data.analysis) {
        console.log('✅ Analysis found in cache');
        return data.analysis as BilingualAnalysis;
      }
    }
    console.log('⚠️ No cached analysis found');
    return null;
  } catch (error) {
    console.error('❌ Error getting analysis:', error);
    return null;
  }
}; 