import * as admin from "firebase-admin";
admin.initializeApp();

export {fetchDailyBulletin, manualFetchBulletin} from "./cloudFunctions/fetchBulletin";
export {processMatchDetailsV2} from "./cloudFunctions/processMatchDetails";
