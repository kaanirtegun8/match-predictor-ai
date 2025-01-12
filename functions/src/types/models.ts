export interface Match {
  id: number;
  status: string;
  utcDate: string;
}

export interface MatchResponse {
  matches: Match[];
}

export interface MatchError extends Error {
  code?: string;
  response?: {
    status?: number;
    statusText?: string;
  };
}
