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

interface BilingualAnalysis {
  en: {
    description: string;
    predicts: Array<{
      id: string;
      type: string;
      prediction: string;
      probability: number;
      evidence: string;
      isRisky: RiskLevel;
    }>;
  };
  tr: {
    description: string;
    predicts: Array<{
      id: string;
      type: string;
      prediction: string;
      probability: number;
      evidence: string;
      isRisky: RiskLevel;
    }>;
  };
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
}): Promise<BilingualAnalysis> {
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

        const prompt = `You are a bilingual (English and Turkish) football match analyzer. Analyze this match and provide predictions in both languages.
        Respond with a valid JSON object only, containing both English and Turkish analysis.
        
        Match: ${matchData.details.homeTeam.name} vs ${matchData.details.awayTeam.name}
        Competition: ${matchData.details.competition.name}
        Date: ${matchData.details.utcDate}
        
        Home Team Recent Form (Last 5): ${JSON.stringify(homeForm)}
        Away Team Recent Form (Last 5): ${JSON.stringify(awayForm)}
        Head to Head: ${JSON.stringify(h2h)}
        Standings Summary: ${JSON.stringify(standings)}

        Return this JSON structure:
        {
            "en": {
                "description": "Match situation overview in English",
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
            },
            "tr": {
                "description": "Maç durumu özeti Türkçe",
                "predicts": [
                    {
                        "id": "match-result",
                        "type": "Maç Sonucu",
                        "prediction": "1 veya X veya 2",
                        "probability": 0.75,
                        "evidence": "• Anahtar nokta 1\\n• Anahtar nokta 2"
                    },
                    {
                        "id": "total-goals",
                        "type": "Toplam Gol",
                        "prediction": "Over/Under 2.5",
                        "probability": 0.65,
                        "evidence": "• Points"
                    },
                    {
                        "id": "both-teams-to-score",
                        "type": "Karşılıklı Gol",
                        "prediction": "Yes/No",
                        "probability": 0.70,
                        "evidence": "• Points"
                    },
                    {
                        "id": "home-team-goals",
                        "type": "Ev Sahibi Gol",
                        "prediction": "Over/Under 1.5",
                        "probability": 0.60,
                        "evidence": "• Points"
                    },
                    {
                        "id": "away-team-goals",
                        "type": "Deplasman Gol",
                        "prediction": "Over/Under 1.5",
                        "probability": 0.60,
                        "evidence": "• Points"
                    },
                    {
                        "id": "first-goal",
                        "type": "İlk Gol",
                        "prediction": "Ev Sahibi/Deplasman/Gol Yok",
                        "probability": 0.55,
                        "evidence": "• Points"
                    }
                ]
            }
        }

        Rules for Turkish translation:
        - Match Result -> Maç Sonucu
        - Total Goals -> Toplam Gol
        - Both Teams to Score -> Karşılıklı Gol
        - Home Team Goals -> Ev Sahibi Gol
        - Away Team Goals -> Deplasman Gol
        - First Goal -> İlk Gol
        
        Prediction value translations:
        - "Over X.X" -> "X.X Üstü"
        - "Under X.X" -> "X.X Altı"
        - "Yes" -> "Evet"
        - "No" -> "Hayır"
        - "Home" -> "Ev Sahibi"
        - "Away" -> "Deplasman"
        - "No Goal" -> "Gol Yok"
        
        Rules:
        1. JSON only, no extra text
        2. Probabilities between 0-1
        3. Use bullet points with •
        4. Provide analysis in both languages
        5. Keep prediction IDs same in both languages
        6. Use Turkish prediction values for Turkish analysis`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4-0125-preview",
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
                
                if (!parsedContent.en || !parsedContent.tr || !Array.isArray(parsedContent.en.predicts) || !Array.isArray(parsedContent.tr.predicts)) {
                    console.error('❌ Invalid response structure');
                    throw new Error('Invalid response structure');
                }

                const transformedResponse = {
                    en: {
                        ...parsedContent.en,
                        predicts: parsedContent.en.predicts.map((predict: { id: string; type: string; prediction: string; probability: number; evidence: string }) => ({
                            ...predict,
                            isRisky: calculateRiskLevel(predict.probability)
                        }))
                    },
                    tr: {
                        ...parsedContent.tr,
                        predicts: parsedContent.tr.predicts.map((predict: { id: string; type: string; prediction: string; probability: number; evidence: string }) => ({
                            ...predict,
                            isRisky: calculateRiskLevel(predict.probability)
                        }))
                    }
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