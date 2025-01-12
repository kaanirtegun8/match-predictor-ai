import * as admin from "firebase-admin";
import {Match} from "../types/models";

/**
 * Saves match details to Firestore.
 * @param {string} dateFrom - The date for which the match details are saved
 * @param {Match} match - Basic match information
 * @param {Match} details - Detailed match information
 * @return {Promise<void>}
 */
export async function saveMatchDetails(
  dateFrom: string,
  match: Match,
  details: Match
): Promise<void> {
  await admin
    .firestore()
    .collection("dailyBulletins")
    .doc(dateFrom)
    .collection("matches")
    .doc(match.id.toString())
    .set({
      basicInfo: match,
      details,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });
}

/**
 * Saves information about failed match processing attempts.
 * @param {Match} match - The match that failed to process
 * @param {Error} error - The error that occurred
 * @return {Promise<void>}
 */
export async function saveFailedMatch(
  match: Match,
  error: Error
): Promise<void> {
  await admin
    .firestore()
    .collection("failedMatches")
    .doc(match.id.toString())
    .set({
      match,
      error: error.message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
}
