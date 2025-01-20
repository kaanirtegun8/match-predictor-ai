import OpenAI from 'openai';
import { Match } from '@/models';
import { AnalyzeResponseModel, RiskLevel, Prediction } from '@/models/AnalyzeResponseModel';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

interface OpenAIPrediction extends Omit<Prediction, 'isRisky'> {
  isRisky: boolean;
}

interface OpenAIResponse {
  description: string;
  predicts: Array<{
    id: string;
    type: string;
    prediction: string;
    probability: number;
    evidence: string;
    isRisky: RiskLevel;
  }>;
}

const calculateRiskLevel = (probability: number): RiskLevel => {
  if (probability >= 0.75) return 'SAFE';
  if (probability >= 0.60) return 'MODERATE';
  return 'RISKY';
};

export async function analyzeMatch(matchData: Match): Promise<AnalyzeResponseModel> {
    try {
        const prompt = `You are a football match analyzer. Your task is to analyze this match and provide predictions.
        You must respond with a valid JSON object and nothing else.
        
        Match Details: ${JSON.stringify(matchData)}

        Return this exact JSON structure, replacing the example values with your analysis:
        {
            "description": "Brief 2-3 sentence overview of the match situation",
            "predicts": [
                {
                    "id": "match-result",
                    "type": "Match Result",
                    "prediction": "1 or X or 2",
                    "probability": 0.75,
                    "evidence": "• Key point 1\\n• Key point 2",
                    "isRisky": false
                },
                {
                    "id": "total-goals",
                    "type": "Total Goals",
                    "prediction": "Over/Under 2.5",
                    "probability": 0.65,
                    "evidence": "• Historical data\\n• Current form",
                    "isRisky": false
                },
                {
                    "id": "both-teams-to-score",
                    "type": "Both Teams to Score",
                    "prediction": "Yes/No",
                    "probability": 0.70,
                    "evidence": "• Attacking stats\\n• Defense performance",
                    "isRisky": false
                },
                {
                    "id": "home-team-goals",
                    "type": "Home Team Goals",
                    "prediction": "Over/Under 1.5",
                    "probability": 0.60,
                    "evidence": "• Home scoring record\\n• Opposition defense",
                    "isRisky": false
                },
                {
                    "id": "away-team-goals",
                    "type": "Away Team Goals",
                    "prediction": "Over/Under 1.5",
                    "probability": 0.60,
                    "evidence": "• Away scoring record\\n• Opposition defense",
                    "isRisky": false
                },
                {
                    "id": "first-goal",
                    "type": "First Goal",
                    "prediction": "Home/Away/No Goal",
                    "probability": 0.55,
                    "evidence": "• First goal statistics\\n• Starting strength",
                    "isRisky": false
                }
            ]
        }

        Rules:
        1. Respond ONLY with the JSON object, no additional text
        2. Keep probability values between 0 and 1
        3. Use exactly the prediction values shown in the example
        4. Use bullet points with • character in evidence
        5. Make sure the JSON is valid and properly formatted`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4",
            temperature: 0.7
        });

        const content = completion.choices[0].message.content;
        
        if (!content) {
            throw new Error('No content in OpenAI response');
        }

        try {
            // Remove any potential non-JSON text before parsing
            const jsonStart = content.indexOf('{');
            const jsonEnd = content.lastIndexOf('}') + 1;
            const jsonContent = content.slice(jsonStart, jsonEnd);
            
            const parsedContent = JSON.parse(jsonContent);
            
            // Validate the response structure
            if (!parsedContent.description || !Array.isArray(parsedContent.predicts)) {
                throw new Error('Invalid response structure');
            }

            // Transform the response to include calculated risk levels
            const transformedResponse = {
                ...parsedContent as OpenAIResponse,
                predicts: (parsedContent as OpenAIResponse).predicts.map(predict => ({
                    ...predict,
                    isRisky: calculateRiskLevel(predict.probability)
                }))
            };

            return transformedResponse;
        } catch (parseError) {
            console.error('Failed to parse OpenAI response:', content);
            throw new Error('Invalid JSON response from OpenAI');
        }
    } catch (error) {
        console.error('Error analyzing match:', error);
        throw new Error('Failed to analyze match');
    }
} 