import {onSchedule} from "firebase-functions/v2/scheduler";
import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {defineSecret} from "firebase-functions/params";

const footballApiKey = defineSecret("FOOTBALL_API_KEY");
const BASE_URL = "https://api.football-data.org/v4";

interface ApiMatch {
  id: number;
  status: string;
  competition: {
    id: number;
    name: string;
  };
  homeTeam: {
    id: number;
    name: string;
  };
  awayTeam: {
    id: number;
    name: string;
  };
  score?: {
    fullTime: {
      home: number | null;
      away: number | null;
    };
  };
}

/**
 * Helper function to fetch and save bulletin data
 * Fetches matches, standings and triggers match details processing
 * @param {string} dateFrom - The date to fetch bulletin for (YYYY-MM-DD)
 */
async function fetchAndSaveBulletin(dateFrom: string) {
  console.log("\n🔄 Daily Bulletin Fetch Started");

  // Get next 2 days
  const dateTo = new Date(dateFrom);
  dateTo.setDate(dateTo.getDate() + 2);
  const dateToStr = dateTo.toISOString().split("T")[0];

  console.log(`📅 Fetching matches from ${dateFrom} to ${dateToStr}`);

  const response = await fetch(
    `https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateToStr}`,
    {
      headers: {
        "X-Auth-Token": footballApiKey.value(),
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const matches: ApiMatch[] = data.matches;

  // Get unique competition IDs
  const competitionIds = [...new Set(matches.map((match) => match.competition.id))];

  const bulletinRef = admin.firestore().collection("dailyBulletins").doc(dateFrom);
  await bulletinRef.set({
    matches,
    allDetailsProcessed: false,
    lastProcessedIndex: 0,
    standings: {},
  });

  console.log("📥 Bulletin saved to Firestore");

  // Fetch standings for each competition
  for (const competitionId of competitionIds) {
    try {
      const standingsResponse = await fetch(
        `${BASE_URL}/competitions/${competitionId}/standings`,
        {headers: {"X-Auth-Token": footballApiKey.value()}}
      );

      if (standingsResponse.ok) {
        const standingsData = await standingsResponse.json();
        await bulletinRef.collection("standings").doc(competitionId.toString()).set(standingsData);
        console.log(`📊 Standings saved for competition ${competitionId}`);

        // Rate limiting delay
        await new Promise((resolve) => setTimeout(resolve, 6000)); // 6 seconds delay
      }
    } catch (error) {
      console.error(`❌ Error fetching standings for competition ${competitionId}:`, error);
    }
  }

  // Wait for 30 seconds before triggering match details to respect API rate limits
  console.log("⏳ Waiting 50 seconds before triggering match details...");
  await new Promise((resolve) => setTimeout(resolve, 50000));

  // Trigger processMatchDetails function with a unique document
  const triggerId = `${dateFrom}_${Date.now()}`;
  await admin.firestore().collection("triggers").doc(triggerId).set({
    type: "processMatchDetails",
    date: dateFrom,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    status: "pending",
  });

  console.log("🔄 Triggered processMatchDetails function");
}

/**
 * Scheduled function that runs daily at 04:00 to fetch new bulletin
 */
export const fetchDailyBulletin = onSchedule({
  schedule: "0 4 * * *", // Her gün saat 04:00'te
  timeZone: "Europe/Istanbul",
  region: "europe-west1",
  secrets: [footballApiKey],
  maxInstances: 1,
  minInstances: 0,
  timeoutSeconds: 120,
  memory: "256MiB",
  concurrency: 1,
}, async () => {
  try {
    const today = new Date();
    const dateFrom = today.toISOString().split("T")[0];
    await fetchAndSaveBulletin(dateFrom);
  } catch (error) {
    console.error(`❌ Error in fetchDailyBulletin: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
});

/**
 * HTTP endpoint for manual testing of bulletin fetching
 * Can be triggered with a specific date parameter
 */
export const manualFetchBulletin = onRequest({
  region: "europe-west1",
  secrets: [footballApiKey],
}, async (req, res) => {
  try {
    const date = req.query.date as string || new Date().toISOString().split("T")[0];
    await fetchAndSaveBulletin(date);
    res.json({success: true, message: "Bulletin fetched successfully"});
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});
