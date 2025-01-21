import fetch from "node-fetch";
import {ApiMatch, ApiMatchResponse} from "../types/models";

const BASE_URL = "http://api.football-data.org/v4";

/**
 * Fetches football matches from the API for a given date range
 * @param {string} apiKey - The API key for authentication
 * @param {string} dateFrom - Start date in YYYY-MM-DD format
 * @param {string} dateTo - End date in YYYY-MM-DD format
 * @return {Promise<ApiMatch[]>} Array of matches
 */
export async function fetchMatches(
  apiKey: string,
  dateFrom: string,
  dateTo: string
): Promise<ApiMatch[]> {
  const response = await fetch(
    `${BASE_URL}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
    {headers: {"X-Auth-Token": apiKey}}
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as ApiMatchResponse;
  return data.matches.filter(
    (match) => match.status === "TIMED" || match.status === "SCHEDULED"
  );
}

/**
 * Fetches detailed information for a specific match
 * @param {string} apiKey - The API key for authentication
 * @param {number} matchId - The ID of the match to fetch
 * @return {Promise<ApiMatch>} Match details
 */
export async function getMatchDetail(
  apiKey: string,
  matchId: number
): Promise<ApiMatch> {
  const response = await fetch(
    `${BASE_URL}/matches/${matchId}`,
    {headers: {"X-Auth-Token": apiKey}}
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return await response.json() as ApiMatch;
}

/**
 * Fetches head-to-head statistics for two teams
 * @param {string} apiKey - The API key for authentication
 * @param {number} matchId - The ID of the match to fetch H2H stats for
 * @return {Promise<ApiMatch[]>} Head to head matches
 */
export async function getHeadToHead(
  apiKey: string,
  matchId: number
): Promise<ApiMatch[]> {
  const response = await fetch(
    `${BASE_URL}/matches/${matchId}/head2head`,
    {headers: {"X-Auth-Token": apiKey}}
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.matches;
}

/**
 * Fetches recent matches for a specific team
 * @param {string} apiKey - The API key for authentication
 * @param {number} teamId - The ID of the team to fetch matches for
 * @return {Promise<ApiMatch[]>} Array of recent matches
 */
export async function getTeamRecentMatches(
  apiKey: string,
  teamId: number
): Promise<ApiMatch[]> {
  const response = await fetch(
    `${BASE_URL}/teams/${teamId}/matches?limit=5&status=FINISHED`,
    {headers: {"X-Auth-Token": apiKey}}
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as ApiMatchResponse;
  return data.matches;
}
