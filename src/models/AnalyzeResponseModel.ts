export type RiskLevel = 'RISKY' | 'MODERATE' | 'SAFE';

export interface Prediction {
    id: string;
    type: string;
    prediction: string;
    probability: number;
    evidence: string;
    isRisky: RiskLevel;
}

export interface AnalyzeResponseModel {
    description: string;
    predicts: Prediction[];
} 