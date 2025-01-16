export interface Match {
  id: number;
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
  kickoff: string;
  status: string;
  matchday: number;
  utcDate?: string;
  venue?: string;
  score?: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
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
}

export interface DailyBulletin {
  fetchDate: string;
  matches: Match[];
} 