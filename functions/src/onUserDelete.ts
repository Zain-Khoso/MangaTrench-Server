// Admin Imports.
import { getFirestore } from "firebase-admin/firestore";

// Functions Imports.
import { region } from "firebase-functions/v1";

// Getting Firebase Admin Services.
const firestore = getFirestore();

/*
  This function is triggered everytime a user deletes their account.
  It delete that user's data in firestore, storage and realtimeDB.
*/
export const onUserDelete = region("asia-south1")
  .auth.user()
  .onDelete(async function (user) {
    const { uid } = user;

    return firestore.collection("users").doc(uid).delete();
  });
