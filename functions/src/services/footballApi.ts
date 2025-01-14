import fetch from "node-fetch";
import {Match, MatchResponse} from "../types/models";

const BASE_URL = "https://api.football-data.org/v4/matches";

/**
 * Fetches weekly matches from the football API.
 * @param {string} apiKey - The API key for authentication
 * @param {string} dateFrom - Start date in YYYY-MM-DD format
 * @param {string} dateTo - End date in YYYY-MM-DD format
 * @return {Promise<Match[]>} Array of matches
 */
export async function fetchWeeklyMatches(
  apiKey: string,
  dateFrom: string,
  dateTo: string
): Promise<Match[]> {
  const url = `${BASE_URL}?dateFrom=${dateFrom}&dateTo=${dateTo}`;
  const response = await fetch(url, {
    headers: {
      "X-Auth-Token": apiKey,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `API error: ${response.statusText}. ` +
      `Status: ${response.status}. Body: ${errorText}`
    );
  }

  const data = await response.json() as MatchResponse;
  return data.matches;
}

/**
 * Fetches detailed information for a specific match.
 * @param {string} apiKey - The API key for authentication
 * @param {number} matchId - The ID of the match
 * @return {Promise<Match>} Detailed match information
 */
export async function fetchMatchDetails(
  apiKey: string,
  matchId: number
): Promise<Match> {
  const response = await fetch(
    `${BASE_URL}/${matchId}`,
    {
      headers: {
        "X-Auth-Token": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch match details: ${response.statusText}`
    );
  }

  return response.json();
}
