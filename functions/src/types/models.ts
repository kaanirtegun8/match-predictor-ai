import {FieldValue} from "firebase-admin/firestore";

// Basic match info used in bulletin
export interface Match {
  id: number;
  kickoff: string; // was utcDate
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
    winner: string | null;
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

// API response types
export interface ApiMatch {
  id: number;
  utcDate: string;
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
    winner: string | null;
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

export interface ApiMatchResponse {
  matches: ApiMatch[];
}

export interface MatchResponse {
  matches: Match[];
}

// Match details stored in subcollection
export interface MatchDetails {
  details: Match;
  h2h: Match[];
  homeRecentMatches: Match[];
  awayRecentMatches: Match[];
  lastUpdated: FieldValue; // Firestore server timestamp
}
