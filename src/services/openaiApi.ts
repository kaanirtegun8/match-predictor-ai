import OpenAI from 'openai';
import { Match } from '../models';
import { AnalyzeResponseModel } from '../models';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
});

export async function analyzeMatch(matchData: Match): Promise<AnalyzeResponseModel> {
    try {
        const prompt = `Analyze this football match and respond in JSON format:
        Match Details: ${JSON.stringify(matchData)}

Please provide a concise analysis in the following JSON structure:
{
    "description": "Brief 2-3 sentence overview of the match situation",
    "predicts": [
        {
            "id": "match-result",
            "type": "Match Result",
            "prediction": "1 or X or 2",
            "probability": percantage number like 0.75,
            "evidence": "• Key point 1\\n• Key point 2",
            "isRisky": false or true
        },
        {
            "id": "total-goals",
            "type": "Total Goals",
            "prediction": "Over/Under 2.5 or Over/Under 3.5 or ..",
            "probability": percantage number like 0.65,
            "evidence": "• Historical data\\n• Current form",
            "isRisky": false or true
        },
        {
            "id": "both-teams-to-score",
            "type": "Both Teams to Score",
            "prediction": "Yes/No",
            "probability": percantage number like 0.70,
            "evidence": "• Attacking stats\\n• Defense performance",
            "isRisky": false or true
        },
        {
            "id": "home-team-goals",
            "type": "Home Team Goals",
            "prediction": "Over/Under 1.5",
            "probability": percantage number like 0.60,
            "evidence": "• Home scoring record\\n• Opposition defense",
            "isRisky": false or true
        },
        {
            "id": "away-team-goals",
            "type": "Away Team Goals",
            "prediction": "Over/Under 1.5",
            "probability": percantage number like 0.60,
            "evidence": "• Away scoring record\\n• Opposition defense",
            "isRisky": false or true
        },
        {
            "id": "first-goal",
            "type": "First Goal",
            "prediction": "Home/Away/No Goal",
            "probability": percantage number like 0.55,
            "evidence": "• First goal statistics\\n• Starting strength",
            "isRisky": false or true
        },
        {
            "id": "top-scorers",
            "type": "Top Scorers",
            "prediction": "Top 3 likely scorers in lineups",
            "probability": percantage number like 0.65,
            "evidence": "1. Player Name (75%)\\n2. Player Name (60%)\\n3. Player Name (45%)",
            "isRisky": false or true
        }
    ]
}
Provide clear, concise evidence for each prediction based on recent form, head-to-head records, and team statistics.`;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4",
        });

        const content = completion.choices[0].message.content;
        // Parse the response manually since it should be in JSON format
        return content ? JSON.parse(content) as AnalyzeResponseModel : {
            description: "No analysis available",
            predicts: [],
        };
    } catch (error) {
        console.error('Error analyzing match:', error);
        throw new Error('Failed to analyze match');
    }
} 