import { Competition } from './Competition';

interface TeamStanding {
  id: number;
  name: string;
  crest: string;
  shortName: string;
}

export interface Standing {
  position: number;
  team: TeamStanding;
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface StandingsResponse {
  competition: Competition;
  standings: {
    table: Standing[];
  }[];
} 