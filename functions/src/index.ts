import * as admin from "firebase-admin";
admin.initializeApp();

export {fetchDailyBulletin} from "./cloudFunctions/fetchBulletin";
export {processMatchDetails} from "./cloudFunctions/processMatchDetails";
