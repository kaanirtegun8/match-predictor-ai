export interface Match {
  id: number;
  kickoff: string;
  status: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    crest: string;
  };
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
  score?: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
  venue?: string;
  matchday?: number;
  utcDate?: string;
}

export interface DailyBulletin {
  fetchDate: string;
  matches: Match[];
} 