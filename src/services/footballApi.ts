export const API_TOKEN = process.env.EXPO_PUBLIC_FOOTBALL_DATA_API_KEY as string;
export const BASE_URL = 'http://api.football-data.org/v4';

if (!API_TOKEN) {
  throw new Error('EXPO_PUBLIC_FOOTBALL_DATA_API_KEY is not defined in environment variables');
}

export interface Competition {
  id: number;
  name: string;
  emblem: string;
  type: string;
}

export interface MatchAnalysisInput {
    homeTeam: string;
    awayTeam: string;
    score: string;
    stats?: any;
    highlights?: string[];
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface Player {
  id: number;
  name: string;
  position: string;
  shirtNumber?: number;
}

export interface Lineup {
  id: number;
  formation: string;
  startXI: Player[];
  bench: Player[];
  coach: {
    id: number;
    name: string;
    countryOfBirth?: string;
    nationality?: string;
  };
}

export interface Score {
  winner: string | null;
  duration: string;
  fullTime: {
    home: number | null;
    away: number | null;
  };
  halfTime: {
    home: number | null;
    away: number | null;
  };
}

export interface Match {
  id: number;
  utcDate: string;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  lastUpdated: string;
  score: Score;
  homeTeam: Team;
  awayTeam: Team;
  competition: Competition;
  venue?: string;
  homeTeamLineup?: Lineup;
  awayTeamLineup?: Lineup;
}

export interface MatchResponse {
  matches: Match[];
  resultSet: {
    count: number;
    competitions: string;
    first: string;
    last: string;
    played: number;
  };
}

export interface HeadToHead {
  aggregates: {
    numberOfMatches: number;
    totalGoals: number;
    homeTeam: {
      id: number;
      name: string;
      wins: number;
      draws: number;
      losses: number;
    };
    awayTeam: {
      id: number;
      name: string;
      wins: number;
      draws: number;
      losses: number;
    };
  };
  matches: Match[];
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