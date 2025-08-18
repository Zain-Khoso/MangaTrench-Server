// Admin Imports.
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

// Functions Imports.
import { region } from "firebase-functions/v1";

// Getting Firebase Admin Services.
const auth = getAuth();
const firestore = getFirestore();

/*
  This function is triggered everytime a new user is created.
  It stores the new user's data inside of users collection in firestore.
*/
export const onUserCreate = region("asia-south1")
  .auth.user()
  .onCreate(async function (user) {
    const {
      uid,
      email,
      displayName,
      photoURL,
      providerData,
      metadata: { creationTime },
    } = user;

    let picture = "";
    const providerId = providerData.at(0)?.providerId;
    const userRole =
      (process.env.CREATOR_EMAIL as string) === email ? "admin" : "user";

    // Cleaning Google or Twitter profile URLs.
    if (photoURL) {
      if (providerId?.includes("google"))
        picture = photoURL.replace(/=\s*s\d+-c/, "");
      else if (providerId?.includes("twitter"))
        picture = photoURL.replace(/_normal/, "");
      else picture = photoURL;
    }

    // Setting custom-claims on user.
    await auth.setCustomUserClaims(uid, { role: userRole, username: uid });

    return firestore
      .collection("users")
      .doc(uid)
      .set({
        uid,
        email,
        picture,
        provider: providerId,
        displayName,
        role: userRole,
        username: uid,
        socialMediaHandles: {
          twitter: "",
          github: "",
        },
        createdAt: new Date(creationTime),
        deactivated: false,
        isOnline: false,
        lastSignIn: FieldValue.serverTimestamp(),
        bookmarks: [false],
        reviewsCount: 0,
        bookmarksCount: 0,
        emailVerified: providerId !== "password",
        OTPExpires: false,
        OTP: "",
      });
  });
