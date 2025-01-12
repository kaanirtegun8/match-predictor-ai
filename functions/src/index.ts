/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onSchedule} from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import {defineSecret} from "firebase-functions/params";

const footballApiKey = defineSecret("FOOTBALL_API_KEY");

admin.initializeApp();

export const updateDailyBulletin = onSchedule({
  schedule: "0 0 * * *",
  timeZone: "Europe/Istanbul",
  secrets: [footballApiKey],
}, async () => {
  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const dateFrom = today.toISOString().split("T")[0];
    const dateTo = nextWeek.toISOString().split("T")[0];

    // Football API key'i secrets'dan al
    const apiKey = footballApiKey.value();
    console.log("API Key exists:", !!apiKey);

    if (!apiKey) {
      throw new Error("Football API key is not configured");
    }

    console.log("Fetching matches for dates:", {dateFrom, dateTo});

    // Football API'den maçları çek
    const baseUrl = "https://api.football-data.org/v4/matches";
    const url = `${baseUrl}?dateFrom=${dateFrom}&dateTo=${dateTo}`;

    const response = await fetch(url, {
      headers: {
        "X-Auth-Token": apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMsg = [
        `API error: ${response.statusText}.`,
        `Status: ${response.status}.`,
        `Body: ${errorText}`,
      ].join(" ");
      throw new Error(errorMsg);
    }

    const weeklyMatches = await response.json();
    console.log("Total matches fetched:", weeklyMatches.matches?.length || 0);

    // Sadece TIMED ve SCHEDULED maçları filtrele
    const timedMatches = weeklyMatches.matches.filter(
      (match: {status: string}) =>
        match.status === "TIMED" || match.status === "SCHEDULED",
    );

    console.log("Filtered matches count:", timedMatches.length);

    // Firestore'a kaydet
    await admin
      .firestore()
      .collection("dailyBulletins")
      .doc(dateFrom)
      .set({
        matches: timedMatches,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });

    console.log(
      `Bulletin updated for ${dateFrom} with ${timedMatches.length} matches`,
    );
  } catch (error) {
    console.error("Error updating bulletin:", error);
    // Hata detaylarını logla
    if (error instanceof Error) {
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }
});
