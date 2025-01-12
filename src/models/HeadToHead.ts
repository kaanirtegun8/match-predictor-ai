import { Match } from './Match';

interface TeamStats {
  id: number;
  name: string;
  wins: number;
  draws: number;
  losses: number;
}

export interface HeadToHead {
  aggregates: {
    numberOfMatches: number;
    totalGoals: number;
    homeTeam: TeamStats;
    awayTeam: TeamStats;
  };
  matches: Match[];
} 