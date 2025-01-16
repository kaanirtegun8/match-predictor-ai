import * as admin from "firebase-admin";
import {onDocumentWritten} from "firebase-functions/v2/firestore";
import {defineSecret} from "firebase-functions/params";
import {getMatchDetail, getHeadToHead, getTeamRecentMatches} from "../services/footballApi";

const footballApiKey = defineSecret("FOOTBALL_API_KEY");

// Helper function to delay execution
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Constants for batch processing
const BATCH_SIZE = 10; // Process 10 matches per function call
const DELAY_BETWEEN_MATCHES = 30000; // 30 seconds between matches

/**
 * Cloud Function that processes match details for today's bulletin
 * Triggered when a document is created or updated in the triggers collection
 * Processes matches in batches to avoid rate limiting and timeout
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
  const lastProcessedIndex = bulletinData?.lastProcessedIndex || 0;
  const totalMatches = matches.length;

  // Calculate the end index for this batch
  const endIndex = Math.min(lastProcessedIndex + BATCH_SIZE, totalMatches);
  const currentBatch = matches.slice(lastProcessedIndex, endIndex);

  console.log(`\n📊 Processing matches ${lastProcessedIndex + 1} to ${endIndex} of ${totalMatches}`);

  // Process current batch
  for (const match of currentBatch) {
    try {
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

      // Delay between matches
      await delay(DELAY_BETWEEN_MATCHES);
    } catch (error) {
      console.error(`❌ Error processing match ${match.id}:`, error);
      // Continue with next match even if current one fails
    }
  }

  // Update the last processed index
  await bulletinRef.update({
    lastProcessedIndex: endIndex,
    allDetailsProcessed: endIndex >= totalMatches,
  });

  // If there are more matches to process, create a new trigger
  if (endIndex < totalMatches) {
    const newTriggerId = `${date}_${Date.now()}`;
    await admin.firestore().collection("triggers").doc(newTriggerId).set({
      type: "processMatchDetails",
      date,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      status: "pending",
    });
    console.log("🔄 Created new trigger for next batch");
  } else {
    console.log("✅ All matches have been processed");
  }
});
