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

export async function analyzeMatch(matchData: {
    details: Match;
    h2h: Match[];
    homeRecentMatches: Match[];
    awayRecentMatches: Match[];
    standings?: any;
}): Promise<AnalyzeResponseModel> {
    try {
        const homeForm = matchData.homeRecentMatches.map(m => {
            const isHome = m.homeTeam.id === matchData.details.homeTeam.id;
            return {
                score: `${m.score.fullTime.home}-${m.score.fullTime.away}`,
                result: m.score.winner,
                position: isHome ? "HOME" : "AWAY",
                wasWinner: isHome ? m.score.winner === "HOME_TEAM" : m.score.winner === "AWAY_TEAM"
            };
        });

        const awayForm = matchData.awayRecentMatches.map(m => {
            const isHome = m.homeTeam.id === matchData.details.awayTeam.id;
            return {
                score: `${m.score.fullTime.home}-${m.score.fullTime.away}`,
                result: m.score.winner,
                position: isHome ? "HOME" : "AWAY",
                wasWinner: isHome ? m.score.winner === "HOME_TEAM" : m.score.winner === "AWAY_TEAM"
            };
        });

        const h2h = matchData.h2h.map(m => ({
            score: `${m.score.fullTime.home}-${m.score.fullTime.away}`,
            winner: m.score.winner,
            date: m.utcDate
        }));

        const standings = {
            homeTeam: matchData.standings.standings[0].table.find((t: any) => t.team.id === matchData.details.homeTeam.id),
            awayTeam: matchData.standings.standings[0].table.find((t: any) => t.team.id === matchData.details.awayTeam.id)
        };

        const prompt = `You are a football match analyzer. Analyze this match and provide predictions.
        Respond with a valid JSON object only.
        
        Match: ${matchData.details.homeTeam.name} vs ${matchData.details.awayTeam.name}
        Competition: ${matchData.details.competition.name}
        Date: ${matchData.details.utcDate}
        
        Home Team Recent Form (Last 5): ${JSON.stringify(matchData.homeRecentMatches.map(m => ({
            score: m.score.fullTime.home + '-' + m.score.fullTime.away,
            result: m.score.winner
        })))}
        
        Away Team Recent Form (Last 5): ${JSON.stringify(matchData.awayRecentMatches.map(m => ({
            score: m.score.fullTime.home + '-' + m.score.fullTime.away,
            result: m.score.winner
        })))}
        
        Head to Head: ${JSON.stringify(matchData.h2h.map(m => ({
            score: m.score.fullTime.home + '-' + m.score.fullTime.away,
            winner: m.score.winner,
            date: m.utcDate
        })))}
        
        Standings Summary: ${JSON.stringify({
            homeTeam: matchData.standings.standings[0].table.find((t: any) => t.team.id === matchData.details.homeTeam.id),
            awayTeam: matchData.standings.standings[0].table.find((t: any) => t.team.id === matchData.details.awayTeam.id)
        })}

        Return this JSON structure:
        {
            "description": "Brief match situation overview",
            "predicts": [
                {
                    "id": "match-result",
                    "type": "Match Result",
                    "prediction": "1 or X or 2",
                    "probability": 0.75,
                    "evidence": "• Key point 1\\n• Key point 2"
                },
                {
                    "id": "total-goals",
                    "type": "Total Goals",
                    "prediction": "Over/Under 2.5",
                    "probability": 0.65,
                    "evidence": "• Points"
                },
                {
                    "id": "both-teams-to-score",
                    "type": "Both Teams to Score",
                    "prediction": "Yes/No",
                    "probability": 0.70,
                    "evidence": "• Points"
                },
                {
                    "id": "home-team-goals",
                    "type": "Home Team Goals",
                    "prediction": "Over/Under 1.5",
                    "probability": 0.60,
                    "evidence": "• Points"
                },
                {
                    "id": "away-team-goals",
                    "type": "Away Team Goals",
                    "prediction": "Over/Under 1.5",
                    "probability": 0.60,
                    "evidence": "• Points"
                },
                {
                    "id": "first-goal",
                    "type": "First Goal",
                    "prediction": "Home/Away/No Goal",
                    "probability": 0.55,
                    "evidence": "• Points"
                }
            ]
        }

        Rules:
        1. JSON only, no extra text
        2. Probabilities between 0-1
        3. Use bullet points with •`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-0613",
            temperature: 0.7,
            max_tokens: 2000
        });

        const content = completion.choices[0].message.content;
        
        if (!content) {
            throw new Error('No content in OpenAI response');
        }

        try {
            const jsonStart = content.indexOf('{');
            const jsonEnd = content.lastIndexOf('}') + 1;
            const jsonContent = content.slice(jsonStart, jsonEnd);
            
            if (jsonStart === -1 || jsonEnd === 0 || jsonContent.trim() === '') {
                console.error('❌ No valid JSON found in response');
                throw new Error('No valid JSON found in response');
            }

            try {
                const parsedContent = JSON.parse(jsonContent);
                
                if (!parsedContent.description || !Array.isArray(parsedContent.predicts)) {
                    console.error('❌ Invalid response structure');
                    throw new Error('Invalid response structure');
                }

                const transformedResponse = {
                    ...parsedContent as OpenAIResponse,
                    predicts: (parsedContent as OpenAIResponse).predicts.map(predict => ({
                        ...predict,
                        isRisky: calculateRiskLevel(predict.probability)
                    }))
                };

                return transformedResponse;
            } catch (jsonError: any) {
                console.error('❌ JSON Parse Error:', jsonError.message);
                throw new Error('Invalid JSON response from OpenAI');
            }
        } catch (parseError) {
            console.error('❌ Failed to parse OpenAI response');
            throw new Error('Invalid JSON response from OpenAI');
        }
    } catch (error) {
        console.error('❌ Error analyzing match:', error);
        throw new Error('Failed to analyze match');
    }
} 