/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onSchedule} from "firebase-functions/v2/scheduler";
import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import {defineSecret} from "firebase-functions/params";

admin.initializeApp();

interface Match {
  id: number;
  status: string;
  utcDate: string;
}

interface MatchResponse {
  matches: Match[];
}

interface MatchDetails {
  id: number;
  status: string;
  utcDate: string;
  homeTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crest: string;
  };
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
  score: {
    winner: string | null;
    duration: string;
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

const footballApiKey = defineSecret("FOOTBALL_API_KEY");

interface HeadToHead {
  aggregates: {
    numberOfMatches: number;
    totalGoals: number;
    homeTeam: {
      wins: number;
      draws: number;
      losses: number;
    };
    awayTeam: {
      wins: number;
      draws: number;
      losses: number;
    };
  };
  matches: Match[];
}

interface ProcessedMatchData {
  details: MatchDetails;
  h2h: HeadToHead;
  [key: `recentMatches_${number}`]: Match[];
}

// Add BASE_URL constant at the top
const BASE_URL = "http://api.football-data.org/v4";

/**
 * Fetches weekly matches from the football API
 * @return {Promise<Match[]>} Array of matches
 */
async function fetchWeeklyMatches(): Promise<Match[]> {
  const apiKey = footballApiKey.value();
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const dateFrom = today.toISOString().split("T")[0];
  const dateTo = nextWeek.toISOString().split("T")[0];

  console.log(`Fetching matches from ${dateFrom} to ${dateTo}`);

  const response = await fetch(
    `${BASE_URL}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
    {headers: {"X-Auth-Token": apiKey}},
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as MatchResponse;
  return data.matches.filter((match) =>
    match.status === "TIMED" || match.status === "SCHEDULED",
  );
}

/**
 * Processes a single match by fetching its details
 * @param {number} matchId - The ID of the match to process
 * @return {Promise<ProcessedMatchData>} Match details and related data
 */
async function processMatch(matchId: number): Promise<ProcessedMatchData> {
  const apiKey = footballApiKey.value();

  try {
    // Fetch match details
    const detailsResponse = await fetch(
      `http://api.football-data.org/v4/matches/${matchId}`,
      {headers: {"X-Auth-Token": apiKey}},
    );

    if (!detailsResponse.ok) {
      throw new Error(
        `API error: ${detailsResponse.status} ${detailsResponse.statusText}`
      );
    }

    const matchDetails = await detailsResponse.json();

    // Fetch head to head
    const h2hResponse = await fetch(
      `http://api.football-data.org/v4/matches/${matchId}/head2head`,
      {headers: {"X-Auth-Token": apiKey}},
    );

    if (!h2hResponse.ok) {
      throw new Error(
        `API error: ${h2hResponse.status} ${h2hResponse.statusText}`
      );
    }

    const h2hData = await h2hResponse.json();

    // Fetch recent matches for both teams
    const [homeTeamResponse, awayTeamResponse] = await Promise.all([
      fetch(
        `http://api.football-data.org/v4/teams/${matchDetails.homeTeam.id}/matches?limit=5&status=FINISHED`,
        {headers: {"X-Auth-Token": apiKey}},
      ),
      fetch(
        `http://api.football-data.org/v4/teams/${matchDetails.awayTeam.id}/matches?limit=5&status=FINISHED`,
        {headers: {"X-Auth-Token": apiKey}},
      ),
    ]);

    if (!homeTeamResponse.ok || !awayTeamResponse.ok) {
      throw new Error("Failed to fetch recent matches");
    }

    const homeTeamMatches = await homeTeamResponse.json();
    const awayTeamMatches = await awayTeamResponse.json();

    // Return all the data
    return {
      details: matchDetails,
      h2h: h2hData,
      [`recentMatches_${matchDetails.homeTeam.id}`]: homeTeamMatches.matches,
      [`recentMatches_${matchDetails.awayTeam.id}`]: awayTeamMatches.matches,
    };
  } catch (error) {
    console.error(`Error processing match ${matchId}:`, error);
    throw error;
  }
}

/**
 * Creates chunks of an array
 * @template T The type of array elements
 * @param {T[]} arr - Array to chunk
 * @param {number} size - Size of each chunk
 * @return {Array<T[]>} Array of chunks
 */
function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from(
    {length: Math.ceil(arr.length / size)},
    (_, i) => arr.slice(i * size, i * size + size),
  );
}

/**
 * Delays execution
 * @param {number} ms - Milliseconds to delay
 * @return {Promise<void>}
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface QueueMatch {
  id: number;
  status: "pending" | "processing" | "completed" | "error";
  retryCount: number;
}

interface QueueDocument {
  date: string;
  status: string;
  matches: QueueMatch[];
  createdAt: admin.firestore.Timestamp;
  lastUpdated: admin.firestore.Timestamp;
}

// First function: Scheduled to run daily and fetch matches
export const updateDailyBulletin = onSchedule({
  schedule: "0 0 * * *",
  timeZone: "Europe/Istanbul",
  secrets: [footballApiKey],
  timeoutSeconds: 540,
}, async () => {
  try {
    console.log("Starting daily bulletin update");

    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Fetch weekly matches
    const matches = await fetchWeeklyMatches();
    console.log(`Fetched ${matches.length} matches`);

    // Create daily bulletin
    await admin.firestore()
      .collection("dailyBulletins")
      .doc(today)
      .set({
        matches,
        matchDetails: {},
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });

    // Create match queue
    await admin.firestore()
      .collection("matchQueue")
      .doc("current")
      .set({
        date: today,
        status: "pending",
        matches: matches.map((m) => ({
          id: m.id,
          status: "pending",
          retryCount: 0,
        })),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });

    console.log("Successfully created daily bulletin and queue");
  } catch (error) {
    console.error("Error in updateDailyBulletin:", error);
    throw error;
  }
});

// Second function: Process match details in groups
export const processMatchGroups = onDocumentCreated({
  document: "matchQueue/{docId}",
  secrets: [footballApiKey],
  timeoutSeconds: 540,
  memory: "256MiB",
}, async (event) => {
  try {
    const data = event.data?.data() as QueueDocument | undefined;
    if (!data || !data.matches) {
      console.log("No matches to process");
      return;
    }

    const {date, matches} = data;
    const pendingMatches = matches.filter(
      (m: QueueMatch) => m.status === "pending",
    );

    // Calculate how many matches we can process in this run
    const MAX_MINUTES = 8; // Leave 1 minute buffer
    const SECONDS_PER_GROUP = 75;
    const MAX_GROUPS = Math.floor((MAX_MINUTES * 60) / SECONDS_PER_GROUP);
    const MAX_MATCHES = MAX_GROUPS * 2;

    console.log(
      `Can process ${MAX_GROUPS} groups (${MAX_MATCHES} matches) in this run`
    );
    console.log(`Total pending matches: ${pendingMatches.length}`);

    // Take only what we can process in this run
    const matchesToProcess = pendingMatches.slice(0, MAX_MATCHES);
    const remainingMatches = pendingMatches.slice(MAX_MATCHES);
    const matchGroups = chunk(matchesToProcess, 2);

    console.log(
      `Processing ${matchesToProcess.length} matches in ${matchGroups.length} ` +
      "groups"
    );
    if (remainingMatches.length > 0) {
      console.log(
        `${remainingMatches.length} matches will be processed in next run`
      );
    }

    for (const [index, group] of matchGroups.entries()) {
      console.log(`Processing group ${index + 1}/${matchGroups.length}`);

      try {
        // Update status to processing
        const updatePromises = group.map((match: QueueMatch) => {
          const matchIndex = matches.findIndex(
            (m: QueueMatch) => m.id === match.id
          );
          return event.data?.ref.update({
            [`matches.${matchIndex}.status`]: "processing",
            lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
          });
        });
        await Promise.all(updatePromises);

        // Process matches
        await Promise.all(
          group.map(async (match: QueueMatch) => {
            try {
              const processedData = await processMatch(match.id);
              const matchIndex = matches.findIndex(
                (m: QueueMatch) => m.id === match.id
              );

              // Update bulletin
              await admin.firestore()
                .collection("dailyBulletins")
                .doc(date)
                .update({
                  [`matchDetails.${match.id}`]: processedData,
                  lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
                });

              // Update queue status
              await event.data?.ref.update({
                [`matches.${matchIndex}.status`]: "completed",
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
              });
            } catch (error) {
              const matchIndex = matches.findIndex(
                (m: QueueMatch) => m.id === match.id
              );
              await event.data?.ref.update({
                [`matches.${matchIndex}.status`]: "error",
                [`matches.${matchIndex}.retryCount`]:
                  admin.firestore.FieldValue.increment(1),
                lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
              });
              console.error(`Error processing match ${match.id}:`, error);
            }
          })
        );

        console.log(`Successfully processed group ${index + 1}`);

        if (index < matchGroups.length - 1) {
          console.log("Waiting 60 seconds before next group...");
          await delay(60000);
        }
      } catch (error) {
        console.error(`Error processing group ${index + 1}:`, error);
      }
    }

    // If there are remaining matches, create a new queue with a different name
    if (remainingMatches.length > 0) {
      console.log(
        `Creating new queue for remaining ${remainingMatches.length} matches`
      );
      const newQueueId = `next_${Date.now()}`;
      await admin.firestore()
        .collection("matchQueue")
        .doc(newQueueId)
        .set({
          date,
          status: "pending",
          matches: remainingMatches,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        });
    } else {
      // All matches are processed
      await event.data?.ref.update({
        status: "completed",
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log("Completed processing all match groups");
    }
  } catch (error) {
    console.error("Error in processMatchGroups:", error);

    if (event.data) {
      await event.data.ref.update({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    throw error;
  }
});
