import {onSchedule} from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import {defineSecret} from "firebase-functions/params";
import {fetchMatches} from "../services/footballApi";
import {ApiMatch, Match} from "../types/models";

const footballApiKey = defineSecret("FOOTBALL_API_KEY");

/**
 * Transforms an API match response into our minimal Match model
 * @param {ApiMatch} match - The match data from the API
 * @return {Match} The transformed match data for our app
 */
function transformMatch(match: ApiMatch): Match {
  return {
    id: match.id,
    kickoff: match.utcDate,
    status: match.status,
    homeTeam: {
      id: match.homeTeam.id,
      name: match.homeTeam.name,
      shortName: match.homeTeam.shortName,
      crest: match.homeTeam.crest,
    },
    awayTeam: {
      id: match.awayTeam.id,
      name: match.awayTeam.name,
      shortName: match.awayTeam.shortName,
      crest: match.awayTeam.crest,
    },
    competition: {
      id: match.competition.id,
      name: match.competition.name,
      emblem: match.competition.emblem,
    },
    score: match.score,
  };
}

export const fetchDailyBulletin = onSchedule({
  schedule: "0 4 * * *",
  timeZone: "Europe/Istanbul",
  secrets: [footballApiKey],
}, async () => {
  try {
    const today = new Date();
    const dateFrom = today.toISOString().split("T")[0];
    const dateTo = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    console.log("\n🔄 Daily Bulletin Process Started");
    console.log(`📅 Date range: ${dateFrom} to ${dateTo}`);

    const apiMatches = await fetchMatches(
      footballApiKey.value(),
      dateFrom,
      dateTo
    );

    console.log(`\n📊 Found ${apiMatches.length} matches for the next 3 days`);

    // Transform and save matches to Firestore
    const matches = apiMatches.map(transformMatch);
    const bulletinRef = admin.firestore()
      .collection("dailyBulletins")
      .doc(dateFrom);

    await bulletinRef.set({
      fetchDate: admin.firestore.FieldValue.serverTimestamp(),
      matches,
    });

    console.log("\n📝 Bulletin document created");

    // Create empty detail documents for each match
    const matchDetailsCollection = bulletinRef.collection("matchDetails");
    console.log("\n⚽ Creating match detail documents:");

    for (const match of matches) {
      await matchDetailsCollection.doc(match.id.toString()).set({
        details: null,
        h2h: null,
        homeRecentMatches: null,
        awayRecentMatches: null,
        lastUpdated: null,
      });
      console.log(`  ✓ ${match.homeTeam.name} vs ${match.awayTeam.name}`);
    }

    console.log("\n✨ Daily bulletin process completed successfully");
    console.log("⏳ Match details will be processed in batches");
  } catch (error) {
    console.error(`\n❌ Error in fetchDailyBulletin: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
});
