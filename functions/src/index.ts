import * as admin from "firebase-admin";
admin.initializeApp();

export {fetchDailyBulletin} from "./cloudFunctions/fetchBulletin";
export {processMatchDetailsV2} from "./cloudFunctions/processMatchDetails";
