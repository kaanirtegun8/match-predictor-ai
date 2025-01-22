import { db } from '../config/firebase';
import { doc, getDoc, collection, query, where, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { Match } from '../models/Match';
import { API_TOKEN, BASE_URL } from './footballApi';
import { AnalyzeResponseModel } from '../models/AnalyzeResponseModel';

export async function getMatchDetails(matchId: string): Promise<{
  details: Match;
  h2h: Match[];
  homeRecentMatches: Match[];
  awayRecentMatches: Match[];
} | null> {
  try {
    // Get from today's bulletin in Firestore
    const today = new Date().toISOString().split('T')[0];
    const matchDetailsRef = doc(db, 'dailyBulletins', today, 'matchDetails', matchId);
    const matchDetailsSnap = await getDoc(matchDetailsRef);
    
    if (matchDetailsSnap.exists()) {
      console.log('✅ Match details found in Firestore');
      const data = matchDetailsSnap.data() as {
        details: Match;
        h2h: Match[];
        homeRecentMatches: Match[];
        awayRecentMatches: Match[];
      };
      return data;
    }

    // If not in Firestore, fetch from API
    console.log('⚠️ Match details not found in Firestore, fetching from API...');
    
    const [matchDetails, h2h, homeMatches, awayMatches] = await Promise.all([
      fetchMatchFromAPI(Number(matchId)),
      fetchHeadToHeadFromAPI(Number(matchId)),
      fetchTeamMatchesFromAPI(Number(matchId), 'home'),
      fetchTeamMatchesFromAPI(Number(matchId), 'away')
    ]);

    console.log('✅ Successfully fetched match details from API');
    
    return {
      details: matchDetails,
      h2h: h2h.matches,
      homeRecentMatches: homeMatches,
      awayRecentMatches: awayMatches
    };

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

export const saveMatchAnalysis = async (matchId: string, analysis: AnalyzeResponseModel) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const matchRef = doc(db, 'dailyBulletins', today, 'matchDetails', matchId);
        
        await updateDoc(matchRef, {
            analysis: {
                description: analysis.description,
                predicts: analysis.predicts.map(predict => ({
                    type: predict.type,
                    prediction: predict.prediction,
                    probability: predict.probability,
                    evidence: predict.evidence
                })),
                analyzedAt: new Date().toISOString()
            }
        });

        console.log('✅ Match analysis saved successfully to Firestore:', matchId);
        return true;
    } catch (error) {
        console.error('❌ Error saving match analysis:', error);
        return false;
    }
};

export const getMatchAnalysis = async (matchId: string): Promise<AnalyzeResponseModel | null> => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const matchRef = doc(db, 'dailyBulletins', today, 'matchDetails', matchId);
        const matchSnap = await getDoc(matchRef);
        
        if (matchSnap.exists()) {
            const data = matchSnap.data();
            if (data.analysis) {
                console.log('✅ Analysis found for match:', matchId);
                return data.analysis as AnalyzeResponseModel;
            }
        }
        
        console.log('⚠️ No analysis found for match:', matchId);
        return null;
    } catch (error) {
        console.error('❌ Error getting match analysis:', error);
        return null;
    }
}; 