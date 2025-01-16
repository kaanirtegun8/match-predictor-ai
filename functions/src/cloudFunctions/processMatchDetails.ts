import * as admin from "firebase-admin";
import {onDocumentWritten} from "firebase-functions/v2/firestore";
import {defineSecret} from "firebase-functions/params";
import {getMatchDetail, getHeadToHead, getTeamRecentMatches} from "../services/footballApi";

const footballApiKey = defineSecret("FOOTBALL_API_KEY");

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Cloud Function that processes match details for today's bulletin
 * Triggered when a document is created or updated in the triggers collection
 * Processes matches in batches to avoid rate limiting
 */
export const processMatchDetailsV2 = onDocumentWritten({
  document: "triggers/{triggerId}",
  secrets: [footballApiKey],
  timeoutSeconds: 540, // 9 dakika timeout
  memory: "256MiB",
}, async (event) => {
  // Skip if this is a delete operation
  if (!event.data?.after.exists) {
    return;
  }

  const triggerData = event.data.after.data();
  if (!triggerData || triggerData.type !== "processMatchDetails") {
    console.log("❌ Invalid trigger data");
    return;
  }

  const date = triggerData.date;
  console.log("\n🔄 Match Details Process Started for date:", date);

  const bulletinRef = admin.firestore().collection("dailyBulletins").doc(date);
  const bulletinSnap = await bulletinRef.get();

  if (!bulletinSnap.exists) {
    console.log("❌ No bulletin found for date:", date);
    return;
  }

  const bulletinData = bulletinSnap.data();
  if (bulletinData?.allDetailsProcessed) {
    console.log("✅ All match details already processed for date:", date);
    return;
  }

  const matches = bulletinData?.matches || [];
  let lastProcessedIndex = bulletinData?.lastProcessedIndex || 0;

  // Process matches in batches
  const batchSize = 2; // Process 2 matches per minute
  const totalMatches = matches.length;

  while (lastProcessedIndex < totalMatches) {
    const batch = matches.slice(lastProcessedIndex, lastProcessedIndex + batchSize);

    for (const match of batch) {
      // Fetch match details
      const matchDetails = await getMatchDetail(footballApiKey.value(), match.id);
      const h2h = await getHeadToHead(footballApiKey.value(), match.id);
      const homeRecentMatches = await getTeamRecentMatches(footballApiKey.value(), matchDetails.homeTeam.id);
      const awayRecentMatches = await getTeamRecentMatches(footballApiKey.value(), matchDetails.awayTeam.id);

      // Save match details to Firestore
      await bulletinRef.collection("matchDetails").doc(match.id.toString()).set({
        details: matchDetails,
        h2h,
        homeRecentMatches,
        awayRecentMatches,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Saved details for match ${match.id}`);

      // Delay to respect API rate limits
      await delay(30000); // 30 seconds delay
    }

    lastProcessedIndex += batchSize;

    // Update Firestore with the last processed index
    await bulletinRef.update({lastProcessedIndex});

    // Delay before processing the next batch
    await delay(60000); // 1 minute delay
  }

  // Mark all details as processed
  await bulletinRef.update({allDetailsProcessed: true});
  console.log("✅ All matches have been processed for date:", date);
});
