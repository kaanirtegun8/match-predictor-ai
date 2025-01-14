import { Competition } from './Competition';
import { Team } from './Team';
import { Score } from './Score';
import { Lineup } from './Lineup';

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

export interface MatchAnalysisInput {
  homeTeam: string;
  awayTeam: string;
  score: string;
  stats?: any;
  highlights?: string[];
} 