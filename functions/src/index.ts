// Lib Imports.
import { configDotenv } from "dotenv";

// Admin Imports.
import { initializeApp } from "firebase-admin/app";

// Functions Imports.
import { setGlobalOptions } from "firebase-functions";

// Setting a maximum number of global cloud function instances.
setGlobalOptions({ maxInstances: 10 });

// Reading Environment Variables.
configDotenv();

// Admin Initialization.
initializeApp();

// Exporting Cloud Functions.
export { onUserCreate } from "./onUserCreate";
export { onUserDelete } from "./onUserDelete";
