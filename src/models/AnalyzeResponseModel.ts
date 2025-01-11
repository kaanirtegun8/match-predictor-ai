export interface AnalyzeResponseModel {
    description: string;
    predicts: Predict[];
}

export interface Predict {
    id: string;
    type: string;
    prediction: string;
    probability: number;
    evidence: string;
    isRisky: boolean;
} 