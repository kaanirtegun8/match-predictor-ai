import { AnalyzeResponseModel } from './AnalyzeResponseModel';

export interface Match {
  area: {
    id: number;
    name: string;
    code: string;
    flag?: string;
  };
  venue?: string;
  competition: {
    id: number;
    name: string;
    code: string;
    type: string;
    emblem: string;
  };
  season: {
    id: number;
    startDate: string;
    endDate: string;
    currentMatchday: number;
    winner?: any;
  };
  id: number;
  utcDate: string;
  kickoff?: string;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  score: {
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
  };
  odds: {
    msg: string;
  };
  referees: Array<{
    id: number;
    name: string;
    type: string;
    nationality: string;
  }>;
  analysis?: AnalyzeResponseModel;
}

export interface DailyBulletin {
  fetchDate: string;
  matches: Match[];
} 