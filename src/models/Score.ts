interface ScoreDetail {
  home: number | null;
  away: number | null;
}

export interface Score {
  winner: string | null;
  duration: string;
  fullTime: ScoreDetail;
  halfTime: ScoreDetail;
} 