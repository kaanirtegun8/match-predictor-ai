import {onSchedule} from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import {defineSecret} from "firebase-functions/params";

const footballApiKey = defineSecret("FOOTBALL_API_KEY");

interface ApiMatch {
  id: number;
  status: string;
  [key: string]: any;
}

/**
 * Fetches matches for today and next 2 days from the football API and saves them to Firestore
 * After saving, triggers processMatchDetails to fetch match details
 */
export const fetchDailyBulletin = onSchedule({
  schedule: "0 4 * * *", // Her gün saat 04:00'te
  timeZone: "Europe/Istanbul",
  region: "europe-west1",
  secrets: [footballApiKey],
  maxInstances: 1,
  minInstances: 0,
  timeoutSeconds: 120, // 2 dakika yeterli olmalı
  memory: "256MiB",
  concurrency: 1,
}, async (context) => {
  try {
    console.log("\n🔄 Daily Bulletin Fetch Started");

    const today = new Date();
    const dateFrom = today.toISOString().split("T")[0];

    // Get next 2 days
    const dateTo = new Date(today);
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

    const bulletinRef = admin.firestore().collection("dailyBulletins").doc(dateFrom);
    await bulletinRef.set({
      matches,
      allDetailsProcessed: false,
      lastProcessedIndex: 0,
    });

    console.log("📥 Bulletin saved to Firestore");

    // Trigger processMatchDetails function with a unique document
    const triggerId = `${dateFrom}_${Date.now()}`;
    await admin.firestore().collection("triggers").doc(triggerId).set({
      type: "processMatchDetails",
      date: dateFrom,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "pending",
    });

    console.log("🔄 Triggered processMatchDetails function");
  } catch (error) {
    console.error(`❌ Error in fetchDailyBulletin: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
});
