import * as admin from "firebase-admin";
import {defineSecret} from "firebase-functions/params";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {
  getMatchDetail,
  getHeadToHead,
  getTeamRecentMatches,
} from "../services/footballApi";
import {ApiMatch, Match, MatchDetails} from "../types/models";

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

export const processMatchDetails = onSchedule({
  schedule: "* * * * *", // Every minute
  timeZone: "Europe/Istanbul",
  secrets: [footballApiKey],
}, async () => {
  try {
    const today = new Date();
    const dateFrom = today.toISOString().split("T")[0];

    // Find bulletin document
    const bulletinRef = admin.firestore()
      .collection("dailyBulletins")
      .doc(dateFrom);

    const bulletin = await bulletinRef.get();
    if (!bulletin.exists) {
      console.log("📅 No bulletin found for today");
      return;
    }

    const matchDetailsCollection = bulletinRef.collection("matchDetails");
    const matchDetails = await matchDetailsCollection.get();

    // Find unprocessed matches
    const unprocessedMatches = matchDetails.docs.filter((doc) => {
      const data = doc.data();
      return !data.details || !data.h2h ||
             !data.homeRecentMatches || !data.awayRecentMatches;
    });

    if (unprocessedMatches.length === 0) {
      console.log("✅ All matches are processed");
      return;
    }

    console.log(`\n📊 Processing batch: ${unprocessedMatches.length} matches remaining`);

    // Process first 2 matches
    const matchesToProcess = unprocessedMatches.slice(0, 2);

    for (const match of matchesToProcess) {
      const matchId = match.id;
      console.log(`\n⚽ Processing match ${matchId}`);

      try {
        // Fetch match details
        const apiDetails = await getMatchDetail(
          footballApiKey.value(),
          Number(matchId)
        );
        const details = transformMatch(apiDetails);
        console.log(`  ✓ Match details: ${details.homeTeam.name} vs ${details.awayTeam.name}`);

        const apiH2h = await getHeadToHead(
          footballApiKey.value(),
          Number(matchId)
        );
        const h2h = apiH2h.map(transformMatch);
        console.log(`  ✓ Head to head stats: ${h2h.length} matches`);

        const apiHomeRecentMatches = await getTeamRecentMatches(
          footballApiKey.value(),
          details.homeTeam.id
        );
        const homeRecentMatches = apiHomeRecentMatches.map(transformMatch);
        console.log(`  ✓ ${details.homeTeam.name}'s recent matches: ${homeRecentMatches.length}`);

        const apiAwayRecentMatches = await getTeamRecentMatches(
          footballApiKey.value(),
          details.awayTeam.id
        );
        const awayRecentMatches = apiAwayRecentMatches.map(transformMatch);
        console.log(`  ✓ ${details.awayTeam.name}'s recent matches: ${awayRecentMatches.length}`);

        // Save to Firestore
        const matchData: MatchDetails = {
          details,
          h2h,
          homeRecentMatches,
          awayRecentMatches,
          lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
        };

        await matchDetailsCollection.doc(matchId).set(matchData);
        console.log("  ✨ Match processed successfully");
      } catch (error) {
        if (error instanceof Error && error.message.includes("429")) {
          console.log("  ⚠️  Rate limit reached, will retry in next batch");
          return; // Rate limit reached, exit for now
        }
        console.error(`  ❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    // Log remaining matches
    const remaining = unprocessedMatches.length - matchesToProcess.length;
    if (remaining > 0) {
      console.log(`\n⏳ ${remaining} matches remaining for next batch`);
    } else {
      console.log("\n🎉 All matches have been processed successfully");
    }
  } catch (error) {
    console.error(`❌ Error in processMatchDetails: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
});
