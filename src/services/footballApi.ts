import { MatchResponse } from 'functions/src/types/models';
import { Match, HeadToHead, StandingsResponse } from '../models';

export const API_TOKEN = process.env.EXPO_PUBLIC_FOOTBALL_DATA_API_KEY as string;
export const BASE_URL = 'https://api.football-data.org/v4';

if (!API_TOKEN) {
  throw new Error('EXPO_PUBLIC_FOOTBALL_DATA_API_KEY is not defined in environment variables');
}

export async function getWeeklyMatches(dateFrom: string, dateTo: string): Promise<MatchResponse> {
  try {
    const response = await fetch(
      `${BASE_URL}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      {
        headers: {
          'X-Auth-Token': API_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
}

export async function getHeadToHead(matchId: number): Promise<HeadToHead> {
  try {
    const response = await fetch(
      `${BASE_URL}/matches/${matchId}/head2head`,
      {
        headers: {
          'X-Auth-Token': API_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching head to head:', error);
    throw error;
  }
}

export async function getTeamRecentMatches(teamId: number, limit: number = 5): Promise<Match[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/teams/${teamId}/matches?limit=${limit}&status=FINISHED`,
      {
        headers: {
          'X-Auth-Token': API_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.matches;
  } catch (error) {
    console.error('Error fetching team matches:', error);
    throw error;
  }
}

export async function GetMatchDetail(matchId: number): Promise<Match> {
    const response = await fetch(`${BASE_URL}/matches/${matchId}`, {
        headers: { 'X-Auth-Token': API_TOKEN },
    });
    return response.json();
}

export async function getLeagueStandings(leagueId: number): Promise<StandingsResponse> {
  const response = await fetch(`${BASE_URL}/competitions/${leagueId}/standings`, {
    headers: {
      'X-Auth-Token': API_TOKEN,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch standings');
  }

  const data = await response.json();
  return data;
}